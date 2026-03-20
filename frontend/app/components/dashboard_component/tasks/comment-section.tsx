import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Comment, User } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useAddComment, useGetComment } from "hook/use-task";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const CommentSection = ({
  taskId,
  member,
}: {
  taskId: string;
  member: User[];
}) => {
  const [newCommnet, setNewCommnet] = useState("");

  const { mutate: addComment, isPending } = useAddComment();
  const { data: comments, isLoading } = useGetComment(taskId) as {
    data: Comment[];
    isLoading: boolean;
  };

  const handleAddComment = () => {
    addComment(
      { taskId, comment: newCommnet },
      {
        onSuccess: () => {
          toast.success("Added successfull");
          setNewCommnet("");
        },
        onError: (err: any) => {
          const errMes = err.response.data.message;
          toast.error(errMes);
          console.log(err);
        },
      },
    );
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-medium mb-4">Comment Section</h3>

      <ScrollArea className="h-75 mb-4">
        {comments?.length > 0 ? (
          comments?.map((comment) => (
            <div key={comment._id} className="flex gap-4 py-2">
              <Avatar title={comment.author.name}>
                <AvatarImage src={comment.author.profilePicture} />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold text-blue-500">
                    {comment.author.name}
                  </span>

                  <i className="text-xs text-muted-foreground">
                    {formatDistanceToNow(comment.createdAt, {
                      addSuffix: true,
                    })}
                  </i>
                </div>
                <span className="text-xs text-muted-foreground">
                  {comment.text}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center py-4">
            <p className="text-xs font-medium text-muted-foreground">
              No comment yet
            </p>
          </div>
        )}
      </ScrollArea>

      <Separator className="my-4 bg-blue-400" />

      <div className="mt-4">
        <Textarea
          placeholder="Add new comment"
          onChange={(e) => setNewCommnet(e.target.value)}
          value={newCommnet}
        />

        <div className="flex justify-end mt-4">
          <Button
            onClick={handleAddComment}
            disabled={!newCommnet.trim() || isPending}
            className="bg-blue-500 hover:bg-blue-600"
          >
            <Plus className="mr-2 size-4" />
            Add new
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
