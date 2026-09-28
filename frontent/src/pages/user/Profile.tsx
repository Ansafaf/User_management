const Profile = () => {
  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>My Profile</h1>
        <div className="profile-card">
          <div className="avatar">JD</div>
          <div>
            <h3>John Doe</h3>
            <p>Senior Product Manager</p>
          </div>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Email</span>
            <strong>john@company.com</strong>
          </div>
          <div className="detail-item">
            <span>Department</span>
            <strong>Operations</strong>
          </div>
          <div className="detail-item">
            <span>Location</span>
            <strong>New York</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;