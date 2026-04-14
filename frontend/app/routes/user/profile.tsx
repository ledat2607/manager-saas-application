import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import type { User } from "@/types";

import { useGetProfileQuery, useUpdatePicture } from "hook/use-user";
import { Loader, Camera, User as UserIcon, Lock, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileCard, {
  type ProfileFormData,
} from "@/components/dashboard_component/user/profile-card";
import { profileSchema } from "@/lib/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ChangePasswordCard from "@/components/dashboard_component/user/change-password-card";
import { BackButton } from "@/components/dashboard_component/back-button";
import { deleteFileFromCloud, uploadToCloud } from "@/lib/upload-image";
import { toast } from "sonner";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isUploading, setIsUploading] = useState(false);
  const { mutate, isPending: uploadPending } = useUpdatePicture();
  const { data, isPending } = useGetProfileQuery() as {
    data: User;
    isPending: boolean;
  };

  // Logic Forms (Tớ giữ nguyên logic của cậu)
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: data?.name || "",
      profilePicture: data?.profilePicture || "",
    },
  });

  useEffect(() => {
    if (data) {
      profileForm.reset({
        name: data.name,
        profilePicture: data.profilePicture || "",
      });
    }
  }, [data, profileForm]);

  if (isPending)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="animate-spin" />
      </div>
    );

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "cover",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const oldUrl =
      type === "avatar"
        ? profileForm.getValues("profilePicture")
        : data?.preferences?.backgroundImage;

    try {
      setIsUploading(true);

      // Xóa ảnh cũ trước
      if (oldUrl) {
        await deleteFileFromCloud(oldUrl);
      }

      // Upload ảnh mới
      const newUrl = await uploadToCloud(
        file,
        type === "avatar" ? "avatars" : "covers",
        data?._id,
      );

      // Cập nhật state/form
      if (type === "avatar") profileForm.setValue("profilePicture", newUrl);
      mutate(
        {
          profilePicture: newUrl,
          type: type === "avatar" ? "avatar" : "background",
        },
        {
          onSuccess: () => {
            toast.success(
              `${type === "avatar" ? "Avatar" : "Cover photo"} updated successfully!`,
              {
                description: "Your profile has been updated.",
              },
            );
          },
        },
      );
    } catch (error) {
      console.error("Quy trình thất bại:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 p-2">
      {/* HEADER SECTION */}
      <div
        className="relative group h-60 w-full rounded-3xl shadow-lg overflow-hidden transition-all duration-500"
        style={{
          backgroundImage: data?.preferences?.backgroundImage
            ? `url(${data.preferences.backgroundImage})`
            : "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
        <div
          onClick={() => document.getElementById("cover-upload")?.click()}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-black/60 z-10"
        >
          <Camera className="h-6 w-6" />
          <input
            id="cover-upload"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileChange(e, "cover")}
          />
        </div>
        <div className="absolute inset-0 bg-grid-white/10" />

        <div className="absolute top-2 left-6 flex items-end gap-6 translate-y-12 sm:translate-y-16">
          <div className="relative group">
            <Avatar className="h-32 w-32 border-4 border-background shadow-2xl ring-2 ring-black/5">
              <AvatarImage
                src={
                  profileForm.watch("profilePicture") || data?.profilePicture
                }
              />
              <AvatarFallback className="text-3xl bg-slate-100">
                {data?.name?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => document.getElementById("avatar-upload")?.click()}
              className="absolute cursor-pointer inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Camera className="h-6 w-6" />
            </button>
            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
               onChange={(e) => handleFileChange(e, "avatar")}
            />
          </div>
          <div className="mb-4 sm:mb-8 text-white">
            <h2 className="text-2xl font-bold drop-shadow-md">{data?.name}</h2>
            <p className="text-white/80 text-sm flex items-center gap-1.5 shadow-sm bg-black/10 px-2 py-0.5 rounded-full">
              <Mail className="h-3.5 w-3.5" /> {data?.email}
            </p>
            <p className="text-white/80 text-sm">{data?.bio}</p>
          </div>
        </div>
      </div>
      {/* SIDEBAR NAVIGATION (DUMMY) */}
      <div className="md:hidden">
        <Select value={activeTab} onValueChange={setActiveTab}>
          <SelectTrigger className="w-full rounded-xl bg-card/60 backdrop-blur-md border-none shadow-lg">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">
              <div className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" /> Personal Info
              </div>
            </SelectItem>
            <SelectItem value="security">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" /> Security
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* MAIN CONTENT AREA */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden md:flex bg-transparent gap-2 mb-6">
          <TabsTrigger
            value="personal"
            className="rounded-md p-1 data-[state=active]:bg-indigo-500 data-[state=active]:text-white"
          >
            Personal Info
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-md p-1 data-[state=active]:bg-pink-500 data-[state=active]:text-white"
          >
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="mt-0 border-none outline-none">
          <ProfileCard data={data} />
        </TabsContent>

        <TabsContent value="security" className="mt-0 border-none outline-none">
          <ChangePasswordCard user={data} />
        </TabsContent>
      </Tabs>
      <div className="flex justify-end">
        <BackButton />
      </div>
    </div>
  );
};

export default Profile;
