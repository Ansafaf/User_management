import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = user?.name
    ?.split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("") || "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="user-topbar">
      <div className="user-brand-wrap">
        <div className="user-brand">UM</div>
        <span>User Portal</span>
      </div>

      <nav className="user-navbar" aria-label="Main navigation">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>
        <Link to="/profile/edit">Edit Profile</Link>
        <Link to="/change-password">Change Password</Link>
      </nav>

      <div className="user-profile-pill">
        <div className="user-avatar" aria-label="Profile avatar">
          {initials}
        </div>
        <div className="user-meta">
          <strong>{user?.name || "User"}</strong>
          <span>{user?.role || "member"}</span>
        </div>
        <button type="button" className="text-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default UserNavbar;
