const ChangePassword = () => {
  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>Change Password</h1>
        <form className="form-grid">
          <label className="field">
            <span>Current Password</span>
            <input type="password" placeholder="Current password" />
          </label>
          <label className="field">
            <span>New Password</span>
            <input type="password" placeholder="New password" />
          </label>
          <label className="field">
            <span>Confirm Password</span>
            <input type="password" placeholder="Confirm password" />
          </label>
          <button type="submit" className="primary-btn">Update Password</button>
        </form>
      </div>
    </div>
  )
}

export default ChangePassword;