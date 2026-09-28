type AuthMode = 'login' | 'register'

type AuthFormProps = {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
}

export function AuthForm({ mode, onModeChange }: AuthFormProps) {
  const isLogin = mode === 'login'

  return (
    <div className="auth-card">
      <div className="brand-panel">
        <div className="brand-badge">UM</div>
        <div className="brand-copy">
          <p className="eyebrow">Secure workspace</p>
          <h1>User Management</h1>
          <p className="subtitle">
            Manage team access, monitor users, and streamline onboarding from one place.
          </p>
        </div>

        <ul className="feature-list">
          <li>Centralized user directory</li>
          <li>Role-based access controls</li>
          <li>Structured onboarding workflows</li>
        </ul>
      </div>

      <div className="form-panel">
        <div className="form-header">
          <div className="toggle-group" aria-label="Authentication toggle">
            <button
              type="button"
              className={isLogin ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => onModeChange('login')}
            >
              Login
            </button>
            <button
              type="button"
              className={!isLogin ? 'toggle-btn active' : 'toggle-btn'}
              onClick={() => onModeChange('register')}
            >
              Register
            </button>
          </div>

          <h2>{isLogin ? 'Welcome back' : 'Create your account'}</h2>
          <p>
            {isLogin
              ? 'Sign in to continue managing your organization.'
              : 'Set up your profile to start managing users securely.'}
          </p>
        </div>

        <form className="auth-form">
          {!isLogin && (
            <div className="field-row">
              <label className="field">
                <span>Full name</span>
                <input type="text" placeholder="Jane Smith" />
              </label>
            </div>
          )}

          {!isLogin && (
            <label className="field">
              <span>Company</span>
              <input type="text" placeholder="Acme Inc." />
            </label>
          )}

          <label className="field">
            <span>Email address</span>
            <input type="email" placeholder="name@company.com" />
          </label>

          <label className="field">
            <span>Password</span>
            <input type="password" placeholder="Enter your password" />
          </label>

          {!isLogin && (
            <label className="field">
              <span>Confirm password</span>
              <input type="password" placeholder="Repeat your password" />
            </label>
          )}

          {isLogin && (
            <div className="utility-row">
              <label className="checkbox-wrap">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#">Forgot password?</a>
            </div>
          )}

          <button type="submit" className="primary-btn">
            {isLogin ? 'Login' : 'Create account'}
          </button>

          <div className="divider">
            <span>or continue with</span>
          </div>

          <div className="social-row">
            <button type="button" className="social-btn">
              Google
            </button>
            <button type="button" className="social-btn">
              Microsoft
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
