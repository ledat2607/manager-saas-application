import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "./firebase";

export const uploadToCloud = async (
  file: File,
  folder: string,
  id: string,
): Promise<string> => {
  if (!file) throw new Error("No file provided");

  const fileName = `${Date.now()}_${id}_${file.name}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);

  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => reject(error),
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(downloadURL);
      },
    );
  });
};

export const deleteFileFromCloud = async (fileUrl: string) => {
  if (!fileUrl || !fileUrl.includes("firebasestorage.googleapis.com")) return;

  try {
    // 1. Lấy phần path sau /o/ và trước ?
    const baseUrl = "https://firebasestorage.googleapis.com/v0/b/";
    // Trích xuất path: covers/1776050..._nhatrang.jpg
    const tmp = fileUrl.split("/o/")[1];
    const filePath = decodeURIComponent(tmp.split("?")[0]);

    const fileRef = ref(storage, filePath);

    await deleteObject(fileRef);
  } catch (error: any) {
    if (error.code === "storage/object-not-found") {
      console.log("File không tồn tại trên Storage, bỏ qua.");
    } else {
      console.error("Lỗi xóa file:", error);
    }
  }
};
