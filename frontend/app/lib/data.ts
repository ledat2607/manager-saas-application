import type { Attachment } from "@/types";

  // Hàm format dung lượng file
export const mockAttachments: Attachment[] = [
  {
    _id: "att_01",
    fileName: "Project_Proposal_v2.pdf",
    fileUrl: "https://example.com/files/proposal.pdf",
    fileType: "application/pdf",
    fileSize: 2457600, // ~2.34 MB
    uploadedBy: "user_01",
    uploadedAt: new Date("2026-04-15T08:30:00Z"),
  },
  {
    _id: "att_02",
    fileName: "Dashboard_Design_Final.png",
    fileUrl: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?q=80&w=1000", // Link ảnh minh họa
    fileType: "image/png",
    fileSize: 5242880, // 5 MB
    uploadedBy: "user_01",
    uploadedAt: new Date("2026-04-18T14:20:00Z"),
  },
  {
    _id: "att_03",
    fileName: "Database_Schema_Draft.docx",
    fileUrl: "https://example.com/files/schema.docx",
    fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: 45056, // 44 KB
    uploadedBy: "user_02",
    uploadedAt: new Date("2026-04-19T09:00:00Z"),
  },
  {
    _id: "att_04",
    fileName: "Sprint_Retrospective_Notes.txt",
    fileUrl: "https://example.com/files/notes.txt",
    fileType: "text/plain",
    fileSize: 1024, // 1 KB
    uploadedBy: "user_01",
    uploadedAt: new Date("2026-04-19T10:45:00Z"),
  }
];