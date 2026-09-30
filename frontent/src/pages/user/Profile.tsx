import { Link } from "react-router-dom";
import UserPageLayout from "../../components/UserPageLayout";
import { useAuth } from "../../hooks/auth";

const Profile = () => {
  const { user } = useAuth();
  const initials = user?.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

  return (
    <UserPageLayout title="Profile" description="Your personal and account details.">
      <section className="profile-overview">
        <div className="account-avatar" aria-hidden="true">{initials}</div>
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
      </section>
    </UserPageLayout>
  );
};

export default Profile;