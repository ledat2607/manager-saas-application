import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ListCollapse, UserIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { useUpdateAdvancedDetails, useUpdateUserProfile } from "hook/use-user";
import type { User } from "@/types";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { profileSchema } from "@/lib/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SkillInput } from "./input-skill";
import { Textarea } from "@/components/ui/textarea";

export type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileCard = ({ data }: { data: User }) => {
  const { mutate: updateUserProfile, isPending: isUpdatingProfile } =
    useUpdateUserProfile();
  const { mutate: updateDetails, isPending: isUpdatingDetails } =
    useUpdateAdvancedDetails();
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: data?.name || "",
      profilePicture: data?.profilePicture || "",
      skills: data?.skills || [],
      language: data.preferences?.language || "en",
      timezone: data.preferences?.timezone || "UTC",
      bio: data?.bio || "",
      backgroundImage: data?.preferences.backgroundImage || "",
    },
  });
  const handleProfileFormSubmit = (values: ProfileFormData) => {
    updateUserProfile(values, {
      onSuccess: () => toast.success("Profile updated!"),
    });
  };

  const handleAdvancedSubmit = (values: ProfileFormData) => {
    const payload = {
      skills: values.skills,
      bio: values.bio,
      preferences: {
        language: values.language,
        timezone: values.timezone,
        backgroundImage: values.backgroundImage,
      },
    };

    updateDetails(payload, {
      onSuccess: () => {
        toast.success("Advanced details updated!");
      },
      onError: (error) => {
        toast.error("Something went wrong!");
      },
    });
  };

  return (
    <div className="space-y-8">
      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <UserIcon className="h-5 w-5 text-indigo-500" /> Basic Details
          </CardTitle>
          <CardDescription>
            Update your public profile and identity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(handleProfileFormSubmit)}
              className="space-y-6"
            >
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="rounded-xl bg-background/50 focus-visible:ring-indigo-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <Label className="text-muted-foreground">
                  Registered Email
                </Label>
                <div className="flex items-center gap-2 bg-muted/50 p-3 rounded-xl border border-dashed text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm italic">{data?.email}</span>
                  <Badge variant="outline" className="ml-auto text-[10px]">
                    VERIFIED
                  </Badge>
                </div>
              </div>
              <Button
                type="submit"
                disabled={isUpdatingProfile}
                className="rounded-xl px-8 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
              >
                {isUpdatingProfile ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-xl bg-card/60 backdrop-blur-md overflow-hidden relative">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl flex items-center gap-2">
            <ListCollapse className="h-5 w-5 text-indigo-500" /> Advanced
            Details
          </CardTitle>
          <CardDescription>
            Customize your workspace preferences and professional skills.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(handleProfileFormSubmit)}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
                {/* Cài đặt Ngôn ngữ */}
                <FormField
                  control={profileForm.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        // Dùng value để force đồng bộ với form state
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-md bg-background/50">
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="vi">Tiếng Việt</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Múi giờ - Rất quan trọng cho Deadline trong Task Manager */}
                <FormField
                  control={profileForm.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded-md bg-background/50">
                            <SelectValue placeholder="Select Timezone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Asia/Ho_Chi_Minh">
                            (GMT+7) Ho Chi Minh
                          </SelectItem>
                          <SelectItem value="UTC">(GMT+0) UTC</SelectItem>
                          <SelectItem value="America/New_York">
                            (GMT-5) New York
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Phần Skills - Hiển thị dạng Badge */}
              <div className="space-y-3">
                <FormField
                  control={profileForm.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div>
                        <FormLabel className="text-base">
                          Professional Skills
                        </FormLabel>
                        <CardDescription>
                          Identify your expertise. This helps in task
                          distribution within teams.
                        </CardDescription>
                      </div>
                      <FormControl>
                        <SkillInput
                          selectedSkills={field.value || []}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Skills help team leaders assign tasks more effectively to you.
              </p>

              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a bit about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <Button
            disabled={isUpdatingDetails}
            onClick={() => handleAdvancedSubmit(profileForm.getValues())}
            className="mt-4 bg-blue-500 hover:bg-blue-600 cursor-pointer"
            size={"sm"}
          >
            {isUpdatingDetails ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Save Advanced Details"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard;
