import UserNavbar from "../../components/UserNavbar";
import { useAuth } from "../../hooks/auth";

const UserDashboard = () => {
  const { user } = useAuth();

  const firstName = user?.name?.split(" ")[0] || "User";
  const roleLabel = user?.role === "admin" ? "Administrator" : "Member";

  const stats = [
    { label: "Open Tasks", value: user?.role === "admin" ? 8 : 12 },
    { label: "Team Members", value: user?.role === "admin" ? 31 : 24 },
    { label: "Projects", value: user?.role === "admin" ? 10 : 8 },
    { label: "Alerts", value: user?.role === "admin" ? 2 : 3 },
  ];

  const myTasks =
    user?.role === "admin"
      ? [
          "Review approval queue",
          "Audit access permissions",
          "Approve onboarding requests",
        ]
      : [
          "Review access request",
          "Finalize onboarding checklist",
          "Update profile details",
        ];

  const recentUpdates =
    user?.role === "admin"
      ? [
          "Access policy updated",
          "New admin approvals pending",
          "Security review completed",
        ]
      : [
          "System maintenance scheduled",
          "New team members approved",
          "Security policy updated",
        ];

  return (
    <div className="page-shell">
      <div className="page-card dashboard-box">
        <UserNavbar />

        <div className="section-header">
          <div>
            <p className="muted-text">Welcome back, {firstName}</p>
            <h1>{roleLabel} Dashboard</h1>
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat) => (
            <div className="stat-card" key={stat.label}>
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>

        <div className="details-grid">
          <div className="list-box">
            <h3>My Tasks</h3>
            <ul>
              {myTasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </div>

          <div className="list-box">
            <h3>Recent Updates</h3>
            <ul>
              {recentUpdates.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard
