import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div className="page-shell not-found-shell">
      <div className="page-card not-found-card">
        <p className="not-found-code">404</p>
        <h1>Page not found</h1>
        <p className="muted-text">
          The page you are looking for might have been moved, deleted, or never existed.
        </p>

        <div className="cta-row">
          <Link to="/" className="primary-btn large-btn link-btn-inline">
            Back to home
          </Link>
          <Link to="/login" className="ghost-btn large-btn link-btn-inline">
            Go to login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
