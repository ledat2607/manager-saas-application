import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // Sử dụng Textarea cho mô tả
import { useTaskUpdateDescription } from "hook/use-task"; // Giả định bạn có hook này
import { Check, Pencil, X, Loader2, Sparkles, AlignLeft } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface TaskDescriptionProps {
  taskId: string;
  description: string | undefined;
}

const TaskDescription = ({
  taskId,
  description = "",
}: TaskDescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newDescription, setNewDescription] = useState(description);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Giả sử bạn có hook update description tương tự như update title
  const { mutate, isPending } = useTaskUpdateDescription();

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
      // Đưa con trỏ chuột về cuối văn bản
      textareaRef.current?.setSelectionRange(
        newDescription.length,
        newDescription.length,
      );
    }
  }, [isEditing]);

  const handleUpdate = () => {
    if (newDescription === description) {
      setIsEditing(false);
      return;
    }

    mutate(
      { taskId, description: newDescription.trim() },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success("Cập nhật mô tả thành công!", {
            icon: <Sparkles className="h-4 w-4 text-yellow-500" />,
          });
        },
        onError: () => {
          setNewDescription(description);
          toast.error("Có lỗi xảy ra khi cập nhật");
        },
      },
    );
  };

  return (
    <div className="group relative flex flex-col gap-2 mt-3 rounded-xl transition-all duration-300 hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
     
      {isEditing ? (
        <div className="flex flex-col gap-3 animate-in fade-in zoom-in-95 duration-200">
          <Textarea
            ref={textareaRef}
            disabled={isPending}
            className={cn(
              "min-h-30 text-base leading-relaxed border-2 transition-all duration-300 resize-none",
              "border-indigo-400/50 focus-visible:ring-indigo-500 focus-visible:border-indigo-500",
              "bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm shadow-inner",
            )}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            onKeyDown={(e) => {
              // Ctrl + Enter để lưu (vì Enter bình thường là xuống dòng trong textarea)
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleUpdate();
              if (e.key === "Escape") {
                setIsEditing(false);
                setNewDescription(description);
              }
            }}
            placeholder="Thêm mô tả chi tiết cho công việc này..."
          />

          <div className="flex items-center justify-end gap-2">
            <span className="text-[10px] text-slate-400 mr-auto italic">
              Nhấn{" "}
              <kbd className="font-sans border px-1 rounded">Ctrl + Enter</kbd>{" "}
              để lưu
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 px-3 hover:bg-red-50 hover:text-red-500 text-slate-500"
              onClick={() => {
                setIsEditing(false);
                setNewDescription(description);
              }}
              disabled={isPending}
            >
              <X className="h-4 w-4 mr-1" /> Hủy
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={isPending}
              className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all active:scale-95"
            >
              {isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-1" /> Lưu
                </>
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="relative group/content cursor-pointer"
          onClick={() => setIsEditing(true)}
        >
          <div
            className={cn(
              "text-base leading-relaxed text-slate-600 dark:text-slate-300 min-h-10 transition-colors",
              !description && "italic text-slate-400 dark:text-slate-600",
            )}
          >
            {description || "Chưa có mô tả. Nhấp để thêm..."}
          </div>

          {/* Nút Edit hiện ra khi hover vào vùng content */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute -top-8 right-0 opacity-0 group-hover:opacity-100 transition-all h-7 px-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/20"
          >
            <Pencil className="h-3 w-3 mr-1" />
            <span className="text-[11px]">Chỉnh sửa</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
