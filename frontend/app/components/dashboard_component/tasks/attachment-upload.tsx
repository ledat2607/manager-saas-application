import React, { useRef } from "react";
import { Button } from "@/components/ui/button"; // Shadcn Button
import { FileText, Loader2 } from "lucide-react";

const AttachmentUpload = ({
  onFileSelect,
  isUploading,
}: {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelect(file);
      event.target.value = "";
    }
  };

  return (
    <div className="w-full">
      {/* Input file bị ẩn đi */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        // Cậu có thể thêm accept="image/*,.pdf" để giới hạn loại file
      />

      <Button
        onClick={handleButtonClick}
        disabled={isUploading}
        className="w-full cursor-pointer bg-slate-800/50 hover:bg-slate-700/50 backdrop-blur-sm border border-slate-700 text-slate-200 transition-all"
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

export default AttachmentUpload;