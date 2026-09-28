const UserDashboard = () => {
  return (
    <div className="page-shell">
      <div className="page-card dashboard-box">
        <div className="section-header">
          <h1>User Dashboard</h1>
          <button className="primary-btn small-btn">New Request</button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Open Tasks</span>
            <strong>12</strong>
          </div>
          <div className="stat-card">
            <span>Team Members</span>
            <strong>24</strong>
          </div>
          <div className="stat-card">
            <span>Projects</span>
            <strong>8</strong>
          </div>
          <div className="stat-card">
            <span>Alerts</span>
            <strong>3</strong>
          </div>
        </div>

        <div className="details-grid">
          <div className="list-box">
            <h3>My Tasks</h3>
            <ul>
              <li>Review access request</li>
              <li>Finalize onboarding checklist</li>
              <li>Update profile details</li>
            </ul>
          </div>

          <div className="list-box">
            <h3>Recent Updates</h3>
            <ul>
              <li>System maintenance scheduled</li>
              <li>New team members approved</li>
              <li>Security policy updated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDashboard
