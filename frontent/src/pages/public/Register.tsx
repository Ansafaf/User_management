const Register = () => {
  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>Create Account</h1>
        <form className="form-grid">
          <label className="field">
            <span>Full Name</span>
            <input type="text" placeholder="Jane Smith" />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" placeholder="jane@company.com" />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="Create password" />
          </label>
          <button type="submit" className="primary-btn">Register</button>
        </form>
      </div>
    </div>
  )
}

export default Register;