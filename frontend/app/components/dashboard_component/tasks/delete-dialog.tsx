import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteDialogProps {
  taskId: string;
  onDelete: (taskId: string) => void;
}

const DeleteDialog = ({ taskId, onDelete }: DeleteDialogProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          title="Delete"
          variant="destructive"
          size="sm"
          className="flex shadow-sm"
        >
          <Trash2 className="lg:mr-2 size-4" />
          <p className="hidden lg:block">Delete</p>
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the task
            from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-md p-2 cursor-pointer">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onDelete(taskId)}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md p-2 cursor-pointer"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
