import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CreateWorkspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateWorkspace } from "hook/use-worksapce";
import { Loader2, PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";

interface CreateWorkspaceProps {
  isCreatingWorkspace: boolean;
  setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}
export type WorkspaceForm = z.infer<typeof CreateWorkspaceSchema>;

const PRESET_COLORS = [
  "#ef4444",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#000000",
];

const CreateWorkspace = ({
  isCreatingWorkspace,
  setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
  const { isPending, mutate } = useCreateWorkspace();
  const navigate = useNavigate();
  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(CreateWorkspaceSchema),
    defaultValues: {
      name: "",
      color: "#ffffff",
      workspacePicture: "",
      description: "",
    },
  });

  const handleSubmit = (values: WorkspaceForm) => {
    mutate(values, {
      onSuccess: (data: any) => {
        form.reset();
        setIsCreatingWorkspace(false);

        toast.success("Create workspace successfull !");
        setTimeout(() => {
          navigate(`/workspaces/${data._id}`);
        }, 3000);
      },
      onError: (error) => {
        console.log(error);
      },
    });
  };

  return (
    <Dialog
      open={isCreatingWorkspace}
      onOpenChange={setIsCreatingWorkspace}
      modal={true}
    >
      <DialogContent className="min-h-[40vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold">
            Create workspace
          </DialogTitle>
          <DialogDescription className="truncate text-balance">
            Create your new workspace
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="flex flex-col gap-4">
              {/*Workspace name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace name</FormLabel>
                    <FormControl>
                      <Input placeholder="Workspace name here...." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*Workspace description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Workspace description here...."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/*Workspace color */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        {/* 1. Mảng màu chọn nhanh */}
                        <div className="flex gap-2">
                          {PRESET_COLORS.map((color) => (
                            <Button
                              key={color}
                              type="button"
                              className={`h-8 w-8 rounded-full border-2 transition-all ${
                                field.value === color
                                  ? "border-slate-900 scale-110"
                                  : "border-transparent"
                              }`}
                              style={{ backgroundColor: color }}
                              onClick={() => field.onChange(color)}
                            />
                          ))}
                        </div>
                        <div className="h-8 w-px bg-slate-200" />{" "}
                        <div className="relative h-8 w-8 overflow-hidden rounded-full border border-slate-200">
                          <input
                            type="color"
                            className="absolute -inset-2 h-12 w-12 cursor-pointer"
                            value={field.value || "#000000"}
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground uppercase">
                          {field.value}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="my-4 bg-white" />
            <DialogFooter>
              <Button disabled={form.formState.isSubmitting} type="submit">
                {isPending ? (
                  <div className="flex gap-4 items-center">
                    <Loader2 className="w-4 h-4  cursor-pointer animate-spin" />
                    Creating....
                  </div>
                ) : (
                  <div className="flex gap-4 items-center">
                    <PlusIcon className="w-4 h-4 cursor-pointer " />
                    Create workspace
                  </div>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspace;
