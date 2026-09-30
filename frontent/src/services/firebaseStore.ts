import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "../config/firebase";

export const uploadProfileImage = async (
  userId: string,
  file: File
): Promise<string> => {
  const fileRef = ref(
    storage,
    `users/${userId}/profile/profile-image`
  );

  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
};

export const uploadDocument = async (
  userId: string,
  file: File
): Promise<string> => {
  const fileRef = ref(
    storage,
    `users/${userId}/documents/${file.name}`
  );

  await uploadBytes(fileRef, file);

  return await getDownloadURL(fileRef);
};

export const deleteFile = async (filePath: string): Promise<void> => {
  const fileRef = ref(storage, filePath);

  await deleteObject(fileRef);
};