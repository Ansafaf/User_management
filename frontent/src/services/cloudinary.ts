export const uploadProfileImage = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const formData = new FormData();

  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const xhr = new XMLHttpRequest();

  return new Promise((resolve, reject) => {
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round(
          (event.loaded / event.total) * 100
        );

        onProgress?.(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);

        resolve(response.secure_url);
      } else {
        reject(new Error("Failed to upload image to Cloudinary."));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Cloudinary upload failed."));
    };

    xhr.send(formData);
  });
};