const UserDetails = () => {
  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>User Details</h1>

        <div className="details-grid">
          <div className="detail-item">
            <span>Name</span>
            <strong>John Doe</strong>
          </div>
          <div className="detail-item">
            <span>Email</span>
            <strong>john@company.com</strong>
          </div>
          <div className="detail-item">
            <span>Role</span>
            <strong>Administrator</strong>
          </div>
          <div className="detail-item">
            <span>Status</span>
            <strong>Active</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetails;