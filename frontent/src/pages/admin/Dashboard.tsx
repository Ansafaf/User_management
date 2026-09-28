const AdminDashboard = () => {
  return (
    <div className="page-shell">
      <div className="page-card dashboard-box">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Users</span>
            <strong>128</strong>
          </div>
          <div className="stat-card">
            <span>Active</span>
            <strong>96</strong>
          </div>
          <div className="stat-card">
            <span>Pending</span>
            <strong>14</strong>
          </div>
          <div className="stat-card">
            <span>Blocked</span>
            <strong>18</strong>
          </div>
        </div>

        <div className="list-box">
          <h3>Recent Activity</h3>
          <ul>
            <li>John Doe updated profile</li>
            <li>Maria Chen was approved</li>
            <li>Team access renewed</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard;