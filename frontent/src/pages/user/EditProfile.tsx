import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserPageLayout from "../../components/UserPageLayout";
import { useAuth } from "../../hooks/auth";
import { uploadProfileImage } from "../../services/firebaseStore";
import { updateUserProfile } from "../../services/userApi";

const EditProfile = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    setError("");
    setSuccess("");
    setIsUploading(true);

    try {
      const userId = user?.id;
      if (!userId) {
        throw new Error("User is not authenticated");
      }

      const imageUrl = await uploadProfileImage(userId, file);
      await updateUserProfile({ profileImage: imageUrl }, token);
      setSuccess("Profile photo updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload profile image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Name and email are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateUserProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      }, token);
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
            <input id="photo" type="file" accept="image/*" name="image" onChange={handleImageChange} />
            {isUploading && <small>Uploading photo...</small>}
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