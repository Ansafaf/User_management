const EditProfile = () => {
  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>Edit Profile</h1>
        <form className="form-grid">
          <label className="field">
            <span>Full Name</span>
            <input type="text" defaultValue="John Doe" />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" defaultValue="john@company.com" />
          </label>
          <label className="field">
            <span>Phone</span>
            <input type="tel" defaultValue="+1 555 789 1234" />
          </label>
          <button type="submit" className="primary-btn">Save Changes</button>
        </form>
      </div>
    </div>
  )
}

export default EditProfile;