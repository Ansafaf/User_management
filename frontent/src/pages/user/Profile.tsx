import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserPageLayout from "../../components/UserPageLayout";
import { useAuth } from "../../hooks/auth";
import { deleteUserAccount } from "../../services/userApi";

const Profile = () => {
  const { user ,token,logout} = useAuth();
  const navigate = useNavigate();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  // const initials = user?.name
  //   ?.split(" ")
  //   .filter(Boolean)
  //   .slice(0, 2)
  //   .map((part) => part[0]?.toUpperCase() ?? "")
  //   .join("") || "U";
    const imageUrl = user?.profileImage;
  const handleDeletion = async () => {
    if (!token) {
      setFeedback({ type: "error", message: "Your session has expired. Please sign in again." });
      return;
    }

    setIsDeleting(true);
    setFeedback(null);
    try {
      await deleteUserAccount(token);
      setIsConfirmingDelete(false);
      setFeedback({ type: "success", message: "Your account has been deleted. Redirecting to sign in..." });
      setTimeout(() => {
        logout();
        navigate("/login", { replace: true });
      }, 1800);
    } catch {
      setFeedback({ type: "error", message: "We couldn't delete your account. Please try again." });
    } finally {
      setIsDeleting(false);
    }
  }
  return (
    <UserPageLayout title="Profile" description="Your personal and account details.">
      <section className="profile-overview">
        <div className="account-avatar" aria-hidden="true">
          <img src={imageUrl ? imageUrl : "https://imgs.search.brave.com/L3aVk2Ws9bJTfmLYFXyJPNsv__LTW4dYsRuhGDFzX40/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9kZWZh/dWx0LWF2YXRhci1w/cm9maWxlLWljb24t/dmVjdG9yLXNvY2lh/bC1tZWRpYS11c2Vy/LWltYWdlLTE4MjE0/NTc3Ny5qcGc"} width="60px" height="58px" />
        </div>
        <div className="profile-identity">
          <h2>{user?.name || "User"}</h2>
          <p>{user?.role || "Member"}</p>
        </div>
        <Link className="portal-button" to="/profile/edit">Edit profile</Link>
      </section>

      <section className="profile-details" aria-label="Profile details">
        <div className="profile-detail">
          <span>Email address</span>
          <strong>{user?.email || "Not provided"}</strong>
        </div>
        <div className="profile-detail">
          <span>Phone number</span>
          <strong>{user?.phone || "Not provided"}</strong>
        </div>
        <div className="profile-detail">
          <span>Account type</span>
          <strong className="capitalize">{user?.role || "Member"}</strong>
        </div>
        <div className="profile-detail">
          <span>Delete your account</span>
          <button
            className="danger-button danger-button-outline"
            type="button"
            onClick={() => {
              setFeedback(null);
              setIsConfirmingDelete(true);
            }}
            disabled={isDeleting || feedback?.type === "success"}
          >
            Delete account
          </button>
        </div>
      </section>

      {isConfirmingDelete && (
        <section className="delete-confirmation" aria-labelledby="delete-confirmation-title">
          <div>
            <h2 id="delete-confirmation-title">Delete this account?</h2>
            <p>This permanently removes your account and profile details. This action cannot be undone.</p>
          </div>
          <div className="delete-confirmation-actions">
            <button
              className="delete-cancel-button"
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              disabled={isDeleting}
            >
              Keep account
            </button>
            <button className="danger-button" type="button" onClick={handleDeletion} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Yes, delete account"}
            </button>
          </div>
        </section>
      )}

      {feedback && (
        <p className={`profile-feedback ${feedback.type}`} role={feedback.type === "error" ? "alert" : "status"}>
          {feedback.message}
        </p>
      )}
    </UserPageLayout>
  );
};

export default Profile;