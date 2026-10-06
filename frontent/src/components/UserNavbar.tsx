import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/auth";

const UserNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // const initials = user?.name
  //   ?.split(" ")
  //   .filter(Boolean)
  //   .slice(0, 2)
  //   .map((word) => word[0]?.toUpperCase() ?? "")
  //   .join("") || "U";

    const photoUrl = user?.profileImage;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="user-topbar">
      <Link className="user-brand-wrap" to="/dashboard" aria-label="User portal home">
        <span className="user-brand">U</span>
        <span className="user-brand-name">Teamspace</span>
      </Link>

      <nav className="user-navbar" aria-label="Main navigation">
        <NavLink to="/dashboard" end>Dashboard</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>

      <details className="user-account-menu">
        <summary>
          <span className="user-avatar" aria-hidden="true">
            <img src={photoUrl ? photoUrl : "https://imgs.search.brave.com/x8jah8UjhG41izgdyJ4ZHffs-1p4QtG-Mf9fPg_kIQw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/aWNvbnM4LmNvbS9u/b2xhbi8xMjAwL3Vz/ZXItZGVmYXVsdC5q/cGc"} width="30px" height="auto" />
          </span>
          <span className="user-meta">
            <strong>{user?.name || "User"}</strong>
            <span>{user?.role || "member"}</span>
          </span>
          <span className="menu-caret" aria-hidden="true">⌄</span>
        </summary>
        <div className="user-menu-panel">
          <Link to="/profile/edit">Edit profile</Link>
          <Link to="/change-password">Change password</Link>
          <button type="button" onClick={handleLogout}>Sign out</button>
        </div>
      </details>
    </header>
  );
};

export default UserNavbar;
