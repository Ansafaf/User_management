import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import UserPageLayout from "../../components/UserPageLayout";
import { useAuth } from "../../hooks/auth";
import { uploadProfileImage } from "../../services/cloudinary";
import { updateUserProfile } from "../../services/userApi";

const EditProfile = () => {
  const { user, token, login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStage, setUploadStage] = useState<"preparing" | "uploading" | "saving">("preparing");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const file = input.files?.[0];
    if (!file) return;
    input.value = "";

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Choose a valid image file.");
      return;
    }

    setError("");
    setSuccess("");
    setIsUploading(true);
    setUploadStage("preparing");
    setUploadProgress(0);

    try {
      const userId = user?.id;
      if (!userId) throw new Error("User is not authenticated.");

      console.log("Starting Firebase upload");

const imageUrl = await uploadProfileImage(file, (progress) => {
  console.log("Progress:", progress);
  setUploadStage("uploading");
  setUploadProgress(progress);
});

console.log("Firebase upload finished:", imageUrl);

setUploadStage("saving");

console.log("Updating backend...");
const updatedUser = {...user, profileImage: imageUrl };
await updateUserProfile(updatedUser, token);

console.log("Backend update finished");
login(updatedUser, token);

console.log("Auth state updated");
     
      setSuccess("Profile photo updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload profile image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    if (!user) {
      setError("Your account could not be loaded. Please sign in again.");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedUser = {
        ...user,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };
      await updateUserProfile(updatedUser, token);
      login(updatedUser, token);
      navigate("/dashboard", {
        state: { successMessage: "Profile updated successfully." },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserPageLayout title="Edit profile" description="Keep your contact details up to date.">
        <form className="user-form" onSubmit={handleSubmit}>
          <label htmlFor="photo" className="user-field photo-field">
            <span>Profile photo</span>
            <input id="photo" type="file" accept="image/*" name="image" onChange={handleImageChange} disabled={isUploading} />
            {isUploading && (
              <Loader
                message={uploadStage === "preparing"
                  ? "Preparing photo..."
                  : uploadStage === "saving"
                    ? "Saving photo..."
                    : `Uploading photo... ${uploadProgress}%`}
                inline
              />
            )}
          </label>

          <label className="user-field">
            <span>Full Name</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label className="user-field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label className="user-field">
            <span>Phone</span>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 555 789 1234"
            />
          </label>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="portal-button" disabled={isSubmitting || isUploading}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
    </UserPageLayout>
  );
};

export default EditProfile;