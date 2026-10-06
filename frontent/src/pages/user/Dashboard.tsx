import { Link } from "react-router-dom";
import UserPageLayout from "../../components/UserPageLayout";
import { useAuth } from "../../hooks/auth";
import ShapeGrid from "../../components/background";


const UserDashboard = () => {
  const { user } = useAuth();
  // const initials = user?.name
  //   ?.split(" ")
  //   .filter(Boolean)
  //   .slice(0, 2)
  //   .map((part) => part[0]?.toUpperCase() ?? "")
  //   .join("") || "U";
    
  const photoUrl = user?.profileImage;
  return (
    <UserPageLayout
      title="Dashboard"
      description="Your account at a glance."
      background={<ShapeGrid
        className="user-dashboard-shape-grid"
        direction="diagonal"
        speed={0.18}
        borderColor="rgba(24, 59, 53, 0.14)"
        squareSize={46}
        hoverFillColor="rgba(221, 112, 78, 0.16)"
        hoverTrailAmount={3}
      />}
    >

      <section className="account-overview" aria-label="Account overview">
        <div className="account-identity">
          <div className="account-avatar" aria-hidden="true">
            <img src={photoUrl ? photoUrl : "https://imgs.search.brave.com/L3aVk2Ws9bJTfmLYFXyJPNsv__LTW4dYsRuhGDFzX40/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9kZWZh/dWx0LWF2YXRhci1w/cm9maWxlLWljb24t/dmVjdG9yLXNvY2lh/bC1tZWRpYS11c2Vy/LWltYWdlLTE4MjE0/NTc3Ny5qcGc"} width="60px" height="58px" />
          </div>
          <div>
            <p className="account-kicker">WELCOME BACK</p>
            <h2>{user?.name || "Your account"}</h2>
            <p>{user?.email || ""}</p>
          </div>
        </div>
        <span className="account-role">{user?.role || "Member"}</span>
      </section>
      <section className="account-shortcuts" aria-labelledby="shortcuts-heading">
        <div className="account-section-heading">
          <div>
            <p className="account-kicker">YOUR ACCOUNT</p>
            <h2 id="shortcuts-heading">Quick access</h2>
          </div>
        </div>
        <Link className="account-shortcut" to="/profile">
          <span className="shortcut-mark">01</span>
          <span><strong>Profile details</strong><small>View your contact information</small></span>
          <span className="shortcut-arrow" aria-hidden="true">→</span>
        </Link>
        <Link className="account-shortcut" to="/profile/edit">
          <span className="shortcut-mark">02</span>
          <span><strong>Edit your profile</strong><small>Update your name, email, or phone</small></span>
          <span className="shortcut-arrow" aria-hidden="true">→</span>
        </Link>
        <Link className="account-shortcut" to="/change-password">
          <span className="shortcut-mark">03</span>
          <span><strong>Password &amp; security</strong><small>Change your account password</small></span>
          <span className="shortcut-arrow" aria-hidden="true">→</span>
        </Link>
      </section>
    </UserPageLayout>
  );
};

export default UserDashboard
