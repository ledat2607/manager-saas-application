import type { Attachment } from "@/types";
import {
  FileText,
  Image as ImageIcon,
  File,
  Download,
  Trash2,
  Paperclip,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import React, { useRef } from "react";

const TaskAttachment = ({
  data,
  onUpload,
  isUploading,
}: {
  data: Attachment[];
  onUpload?: (file: File) => void;
  isUploading?: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("image"))
      return <ImageIcon className="w-5 h-5 text-blue-400" />;
    if (type.includes("pdf"))
      return <FileText className="w-5 h-5 text-red-400" />;
    return <File className="w-5 h-5 text-slate-400" />;
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="flex items-center gap-2 mb-4">
        <Paperclip className="w-4 h-4 text-slate-400" />
        <h3 className="text-sm font-semibold text-slate-900">
          Attachments ({data?.length})
        </h3>
      </div>

      {data?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-800/20 backdrop-blur-sm">
          <p className="text-sm text-slate-500 font-medium">
            No attachments yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
          {data?.map((attachment) => (
            <div
              key={attachment._id}
              className="group flex items-center justify-between p-3 rounded-xl 
                         bg-slate-400/40 backdrop-blur-md border border-slate-700/50 
                         hover:border-blue-500/50 hover:cursor-pointer hover:bg-slate-800/60 
                         text-blue-900 hover:text-white transition-all duration-300"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 shrink-0">
                  {getFileIcon(attachment.fileType)}
                </div>

                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm font-medium truncate max-w-37.5 sm:max-w-20">
                    {attachment.fileName}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                    {formatSize(attachment.fileSize)} •{" "}
                    {format(new Date(attachment.uploadedAt), "MMM dd")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 h-8 w-8 bg-slate-900/50 border-slate-700"
                  asChild
                >
                  <a href={attachment.fileUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>

                {/* Nút Download - Cậu có thể dùng URL của Firebase trực tiếp */}
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 h-8 w-8 bg-slate-900/50 border-slate-700 hover:text-green-400"
                  onClick={() => window.open(attachment.fileUrl, "_blank")}
                >
                  <Download className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 h-8 w-8 bg-slate-900/50 border-slate-700 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Separator className="my-4 border-slate-700/50" />

      <Button
        className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        onClick={handleAddClick}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <FileText className="w-4 h-4 mr-2" />
        )}
        {isUploading ? "Uploading..." : "Add Attachment"}
      </Button>
    </div>
  );
};

export default TaskAttachment;
