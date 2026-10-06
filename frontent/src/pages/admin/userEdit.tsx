import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { useAuth } from "../../hooks/auth";
import { getUserById, updateAdminUser } from "../../services/adminApi";
import type { UserRole } from "../../types/user";

const EditUser = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user" as UserRole,
  });
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<{ userId: string; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const isLoading = Boolean(id && token && loadedUserId !== id);
  const displayedLoadError = id && loadError?.userId === id ? loadError.message : "";

  useEffect(() => {
    let isCurrent = true;

    if (!id || !token) return;

    getUserById(id, token)
      .then((user) => {
        if (!isCurrent) return;
        setFormData({
          name: user.name,
          email: user.email,
          phone: user.phone ?? "",
          role: user.role,
        });
        setLoadError(null);
        setLoadedUserId(id);
      })
      .catch((loadError: unknown) => {
        if (!isCurrent) return;
        setLoadError({
          userId: id,
          message: loadError instanceof Error ? loadError.message : "Failed to load user details.",
        });
        setLoadedUserId(id);
      });

    return () => {
      isCurrent = false;
    };
  }, [id, token]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!id || !token) {
      setError("Your session has expired. Please sign in again.");
      return;
    }

    const values = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      role: formData.role,
    };
    if (!values.name || !values.email) {
      setError("Name and email are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const updatedUser = await updateAdminUser(id, values, token);
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone ?? "",
        role: updatedUser.role,
      });
      setSuccess("User updated successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!id || !token) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <button type="button" className="back-btn" onClick={() => navigate("/admin/users")}>
            ← Back to users
          </button>
          <h1>Edit User</h1>
          <p className="error-message" role="alert">The user could not be loaded. Please sign in again.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <button type="button" className="back-btn" onClick={() => navigate(`/admin/users/${id}`)}>
            ← Back to user details
          </button>
          <Loader message="Loading user details..." />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-card">
        <button type="button" className="back-btn" onClick={() => navigate(`/admin/users/${id}`)}>
          ← Back to user details
        </button>
        <h1>Edit User</h1>
        {displayedLoadError && <p className="error-message" role="alert">{displayedLoadError}</p>}
        {!displayedLoadError && (
          <form className="form-grid" onSubmit={handleSubmit}>
            {error && <p className="error-message" role="alert">{error}</p>}
            <label className="field">
              <span>Full Name</span>
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>
            <label className="field">
              <span>Phone</span>
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={(event) => setFormData((current) => ({ ...current, phone: event.target.value }))}
              />
            </label>
            <label className="field">
              <span>Role</span>
              <select
                name="role"
                value={formData.role}
                onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value as UserRole }))}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </label>
            {success && <p className="success-message" role="status">{success}</p>}
            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditUser;
