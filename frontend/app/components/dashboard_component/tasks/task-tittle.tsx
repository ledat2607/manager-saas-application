import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTaskUpdateTitle } from "hook/use-task";
import { Check, Pencil, X, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskTitleProps {
  title: string;
  taskId: string;
}

const TaskTitle = ({ taskId, title }: TaskTitleProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutate, isPending } = useTaskUpdateTitle();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleUpdate = () => {
    if (newTitle.trim() === "" || newTitle === title) {
      setIsEditing(false);
      setNewTitle(title);
      return;
    }

    mutate(
      { taskId, title: newTitle.trim() },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Cập nhật thành công!", {
            icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
          });
        },
        onError: () => {
          setNewTitle(title);
          toast.error("Có lỗi xảy ra");
        },
      },
    );
  };

  return (
    <div className="group relative flex items-center gap-3 mt-8 p-2 rounded-xl transition-all duration-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
      {isEditing ? (
        <div className="flex items-center gap-2 flex-1 animate-in slide-in-from-left-2 duration-300">
          <div className="relative flex-1">
            <Input
              ref={inputRef}
              disabled={isPending}
              className={cn(
                "h-11 text-xl font-bold border-2 transition-all duration-300",
                "border-indigo-400/50 focus-visible:ring-indigo-500 focus-visible:border-indigo-500",
                "bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm shadow-[0_0_15px_rgba(99,102,241,0.1)]",
              )}
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleUpdate();
                if (e.key === "Escape") {
                  setIsEditing(false);
                  setNewTitle(title);
                }
              }}
            />
            {isPending && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 overflow-hidden">
                <div className="h-1 w-12 bg-indigo-500 animate-progress-loop" />
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={isPending}
              className="h-9 w-9 p-0 bg-linear-to-tr from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-90"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-5 w-5" />
              )}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 w-9 p-0 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors"
              onClick={() => {
                setIsEditing(false);
                setNewTitle(title);
              }}
              disabled={isPending}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="relative flex-1">
            <h2
              onClick={() => setIsEditing(true)}
              className={cn(
                "text-2xl font-extrabold tracking-tight cursor-pointer inline-block",
                "bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400",
                "hover:from-indigo-600 hover:to-violet-500 transition-all duration-300",
              )}
            >
              {title}
            </h2>
            {/* Thanh gạch chân trang trí cực mảnh */}
            <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent group-hover:w-24 transition-all duration-500" />
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-all duration-300 h-8 px-3 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800"
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs font-medium">Edit</span>
          </Button>
        </>
      )}
    </div>
  );
};

export default TaskTitle;
