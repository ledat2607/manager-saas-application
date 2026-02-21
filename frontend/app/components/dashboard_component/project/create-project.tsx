import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ProjectSchema } from "@/lib/schema";
import { ProjectStatus, type Member } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";

interface CreateProjectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  workspaceMembers: Member[];
}

export type CreateProjectShemaDialogProps = z.infer<typeof ProjectSchema>;

const CreateProjectDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
  workspaceMembers,
}: CreateProjectDialogProps) => {
  const form = useForm<CreateProjectShemaDialogProps>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      members: [],
      status: ProjectStatus.PLANNING,
      startDate: "",
      dueDate: "",
      tags: undefined,
    },
  });
  const handleSubmit = (data: CreateProjectShemaDialogProps) => {
    console.log(data);
  };
  console.log(workspaceMembers);
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-135">
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Create new project in workspace to countinue
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="my-1">Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Project 1,..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="my-1">Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Project description..."
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="my-1">Project Status</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select project status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ProjectStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover modal={true}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) =>
                            field.onChange(date?.toISOString())
                          }
                          disabled={(date) => date < new Date("1900-01-01")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/*Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="my-1">Project Tags</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Project tags..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/*Members */}
            <FormField
              control={form.control}
              name="members" // Đảm bảo đúng tên trong schema
              render={({ field }) => {
                const selectedIds = Array.isArray(field.value)
                  ? field.value
                  : [];

                return (
                  <FormItem>
                    <FormLabel>Members</FormLabel>
                    <FormControl>
                      {/* Popover bao bọc Button trigger */}
                      <Popover modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            type="button" // Tránh trigger submit form
                            className="w-full justify-between font-normal min-h-11 h-auto py-2"
                          >
                            <div className="flex flex-wrap gap-1">
                              {selectedIds.length === 0 ? (
                                <span className="text-muted-foreground">
                                  Select Members
                                </span>
                              ) : (
                                selectedIds.map((item: any) => {
                                  const m = workspaceMembers.find(
                                    (wm) => wm.user?._id === item.user,
                                  );
                                  return (
                                    <span
                                      key={item.user}
                                      className="bg-secondary px-2 py-0.5 rounded text-xs"
                                    >
                                      {m?.user?.name || "Unknown"} ({item.role})
                                    </span>
                                  );
                                })
                              )}
                            </div>
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-80 p-3" align="start">
                          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
                            {workspaceMembers.map((wm) => {
                              const isSelected = selectedIds.find(
                                (id: any) => id.user === wm.user?._id,
                              );

                              return (
                                <div
                                  key={wm.user?._id}
                                  className="flex items-center gap-2 p-2 border rounded-md shadow-sm"
                                >
                                  <Checkbox
                                    checked={!!isSelected}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([
                                          ...selectedIds,
                                          {
                                            user: wm.user?._id,
                                            role: "owner",
                                          },
                                        ]);
                                      } else {
                                        field.onChange(
                                          selectedIds.filter(
                                            (id: any) =>
                                              id.user !== wm.user?._id,
                                          ),
                                        );
                                      }
                                    }}
                                  />

                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">
                                      {wm.user?.name}
                                    </p>
                                  </div>

                                  {isSelected && (
                                    <Select
                                      value={isSelected.role}
                                      onValueChange={(newRole) => {
                                        const updated = selectedIds.map(
                                          (item: any) =>
                                            item.user === wm.user?._id
                                              ? { ...item, role: newRole }
                                              : item,
                                        );
                                        field.onChange(updated);
                                      }}
                                    >
                                      <SelectTrigger className="h-8 w-25 text-xs">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="manager">
                                          Manager
                                        </SelectItem>
                                        <SelectItem value="owner">
                                          Owner
                                        </SelectItem>
                                        <SelectItem value="viewer">
                                          Viewer
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <DialogFooter>
              <Button type="submit">Create Project</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProjectDialog;
