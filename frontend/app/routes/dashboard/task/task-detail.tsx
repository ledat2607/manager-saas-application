import CommentSection from "@/components/dashboard_component/tasks/comment-section";
import SubtaskDetails from "@/components/dashboard_component/tasks/sub-task";
import TaskActivity from "@/components/dashboard_component/tasks/task-activity";
import TaskAssigneeSelector from "@/components/dashboard_component/tasks/task-assignee-selector";
import TaskAttachment from "@/components/dashboard_component/tasks/task-attachments";
import TaskDescription from "@/components/dashboard_component/tasks/task-desctiption";
import TaskPrioritySelector from "@/components/dashboard_component/tasks/task-priority";
import TaskStatusSelector from "@/components/dashboard_component/tasks/task-status-selector";
import TaskTitle from "@/components/dashboard_component/tasks/task-tittle";
import TopNavigation from "@/components/dashboard_component/tasks/top-navigation";
import Watchers from "@/components/dashboard_component/tasks/watchers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { uploadFileToFirebase } from "@/lib/upload-image";
import { userAuth } from "@/provider/auth-context";
import { formatDistanceToNow } from "date-fns";
import { useGetTaskQuery, useUploadAttachment } from "hook/use-task";
import { AlignLeft, Calendar, Clock, Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { toast } from "sonner";

const TaskDetail = () => {
  const { user } = userAuth();
  const { taskId } = useParams<{ taskId: string }>();

  const { data, isLoading } = useGetTaskQuery(taskId!) as any;

  useEffect(() => {
    if (data?.task?.attachments) {
      setAttachments(data.task.attachments);
    }
  }, [data]);
  
  const [attachments, setAttachments] = useState(data?.attachments);
  const { mutate: uploadAttachment, isPending } = useUploadAttachment();

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50/50">
        <Loader className="animate-spin text-blue-600" size={32} />
      </div>
    );

  const { task, project } = data;
  const isAssignee = task?.assignees?.some((a: any) => a._id === user?._id);

  const handleUpload = async (file: File) => {
    if (!user?._id || !taskId) {
      toast.error("You must be logged in to upload files");
      return;
    }

    try {
      const firebaseUrl = await uploadFileToFirebase(file, `tasks/${taskId}`);

      uploadAttachment(
        {
          taskId: taskId!,
          fileName: file.name,
          fileUrl: firebaseUrl, // Link download
          fileType: file.type,
          fileSize: file.size,
          uploadedBy: user?._id,
          uploadedAt: new Date().toISOString(),
        },
        {
          onSuccess: (response: any) => {
            const newAttachment = response.attachment || response;
            setAttachments((prev: any) => [...(prev || []), newAttachment]);

            toast.success("File uploaded successfully");
          },
        },
      );
    } catch (error) {
      console.error("Lỗi upload:", error);
      toast.error("Failed to upload file.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* Top Navigation Bar */}
      <TopNavigation task={task} user={user as any} />

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (Left) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)] border border-slate-200">
              {/* Task Header Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Badge className="rounded-full px-3 py-0.5 font-semibold uppercase tracking-wider text-[10px]">
                    {task.priority} Priority
                  </Badge>
                  {task.isArchived && (
                    <Badge
                      variant="secondary"
                      className="bg-amber-100 text-amber-700 border-none"
                    >
                      Archived
                    </Badge>
                  )}
                </div>

                <TaskTitle title={task.title} taskId={task._id} />

                <div className="flex flex-wrap items-center gap-6 text-slate-500">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 text-blue-500" />
                    <span className="font-medium">
                      Due:{" "}
                      {formatDistanceToNow(new Date(task.dueDate), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="size-4 text-slate-400" />
                    <span>
                      Created{" "}
                      {formatDistanceToNow(new Date(task.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="my-8 opacity-50" />

              {/* Description Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900">
                  <AlignLeft className="h-5 w-5" />
                  <h3 className="font-bold uppercase text-xs tracking-widest">
                    Description
                  </h3>
                </div>
                <div className="pl-7">
                  <TaskDescription
                    taskId={task._id}
                    description={task?.description}
                  />
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="mt-10 pt-10 border-t border-slate-100">
                <SubtaskDetails
                  subTasks={task.subtasks || []}
                  taskId={task._id}
                />
              </div>
            </div>

            {/* Comments Area */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
              <CommentSection
                taskId={task._id}
                member={project.members as any}
              />
            </div>
          </div>

          {/* Sidebar Area (Right) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 divide-y divide-slate-100">
              <div className="pb-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  Status & Metadata
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-sm font-medium text-slate-500">
                      Status
                    </label>
                    <TaskStatusSelector
                      status={task.status}
                      taskId={task._id}
                      isAssigned={isAssignee}
                    />
                  </div>
                  <div className="grid grid-cols-2 items-center gap-4">
                    <label className="text-sm font-medium text-slate-500">
                      Priority
                    </label>
                    <TaskPrioritySelector
                      taskId={task._id}
                      priority={task.priority}
                    />
                  </div>
                </div>
              </div>

              <div className="py-6">
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                  Owner
                </h3>
                <div className="flex items-center gap-4">
                  <Avatar className="size-6">
                    <AvatarImage
                      src={task.createdBy.profilePicture}
                      title={task.createdBy.name}
                      className="cursor-pointer"
                    />
                    <AvatarFallback>
                      {task.createdBy.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs truncate text-muted-foreground">
                    {task.createdBy.name}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider mt-4">
                  Assignees
                </h3>
                <TaskAssigneeSelector
                  task={task}
                  assignees={task.assignees}
                  projectMembers={project.members as any}
                  isAssignees={isAssignee}
                />
              </div>

              <div className="pt-6">
                <Watchers watchers={task?.watchers || []} />
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                Attachments
              </h3>
              <TaskAttachment
                data={attachments || []}
                onUpload={handleUpload}
                isUploading={isPending}
              />
            </div>
            {/* Activity Feed */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                Activity Feed
              </h3>
              <TaskActivity resourceId={task._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
