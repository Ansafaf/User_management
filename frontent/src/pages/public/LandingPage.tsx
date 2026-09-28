import { Link } from "react-router-dom"

const LandingPage = () => {
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="brand-mark">UM</div>
        <nav className="landing-nav">
          <a href="#features">Features</a>
          <a href="#solutions">Solutions</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="landing-actions">
          <Link to="/login">
          <button className="nav-btn ghost-btn">Login</button>
          </Link>

          <Link to="/register">
          <button className="nav-btn primary-btn">Get Started</button>
          </Link>
        </div>
      </header>

      <main className="landing-hero">
        <div className="hero-copy">
          <span className="pill">Built for modern teams</span>
          <h1>Manage users with clarity, speed, and confidence.</h1>
          <p>
            Keep your team organized with secure access control, smarter onboarding,
            and a dashboard built for real-world operations.
          </p>
          <div className="cta-row">
            <button className="primary-btn large-btn">Start Free</button>
            <button className="ghost-btn large-btn">Book Demo</button>
          </div>

          <div className="mini-stats">
            <div>
              <strong>12k+</strong>
              <span>Active users</span>
            </div>
            <div>
              <strong>99.9%</strong>
              <span>Uptime</span>
            </div>
            <div>
              <strong>3x</strong>
              <span>Faster onboarding</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card main-card">
            <div className="panel-header">
              <span>Overview</span>
              <span className="badge-success">Healthy</span>
            </div>
            <div className="chart-bars">
              <span style={{ height: '38%' }} />
              <span style={{ height: '52%' }} />
              <span style={{ height: '69%' }} />
              <span style={{ height: '82%' }} />
              <span style={{ height: '96%' }} />
            </div>
          </div>

          <div className="panel-card side-card">
            <p>New sign-ups</p>
            <strong>246</strong>
            <span className="trend">+18.2% this week</span>
          </div>
        </div>
      </main>

      <section className="feature-grid" id="features">
        <div className="feature-box">
          <h3>User Directory</h3>
          <p>Track every profile, role, and account status in one searchable place.</p>
        </div>
        <div className="feature-box">
          <h3>Role Access</h3>
          <p>Assign permissions quickly and keep sensitive actions protected.</p>
        </div>
        <div className="feature-box">
          <h3>Automations</h3>
          <p>Reduce admin work with structured workflows and approval flows.</p>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
