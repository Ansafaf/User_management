import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserPageLayout from "../../components/UserPageLayout";
import { useAuth } from "../../hooks/auth";
import { changeUserPassword } from "../../services/userApi";

const ChangePassword = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (!token) {
      setError("Your session has expired. Please log in again.");
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please complete all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      await changeUserPassword({ currentPassword, newPassword, confirmPassword }, token);
      navigate("/dashboard", {
        state: { successMessage: "Password updated successfully." },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <UserPageLayout title="Password & security" description="Choose a strong password to protect your account.">
        <form className="user-form" onSubmit={handleSubmit}>
          <label className="user-field">
            <span>Current Password</span>
            <input
              type="password"
              autoComplete="current-password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </label>
          <label className="user-field">
            <span>New Password</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="New password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </label>
          <label className="user-field">
            <span>Confirm Password</span>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </label>
          {error && <p className="error-message" role="alert">{error}</p>}
          <button type="submit" className="portal-button" disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
    </UserPageLayout>
  )
}

export default ChangePassword;