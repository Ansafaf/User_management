import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { getAdminDashboardSummary, getUsers } from "../../services/adminApi";
import { setDashboardSummary, setError, setLoading, setUsers } from "../../redux/slices/userSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { useAuth } from "../../hooks/auth";

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const dashboard = useSelector((state: RootState) => state.users.dashboard);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);
  const users = useSelector((state: RootState) => state.users.users);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    const load = async () => {
      dispatch(setError(null));
      dispatch(setLoading(true));
      try {
        const [summaryResult, usersResult] = await Promise.allSettled([
          getAdminDashboardSummary(token),
          getUsers(token),
        ]);
        if (cancelled) return;
        if (summaryResult.status === "fulfilled") dispatch(setDashboardSummary(summaryResult.value));
        if (usersResult.status === "fulfilled") dispatch(setUsers(usersResult.value));
        const failures = [summaryResult, usersResult]
          .filter((result): result is PromiseRejectedResult => result.status === "rejected")
          .map((result) => result.reason instanceof Error ? result.reason.message : "Could not load dashboard data.");
        dispatch(setError(failures.length ? failures.join(" ") : null));
      } finally {
        dispatch(setLoading(false));
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [dispatch, token]);

  const visibleUsers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return users.filter((item) => {
      const matchesQuery = !normalizedQuery || [item.name, item.email, item.department, item.role]
        .some((value) => value?.toLowerCase().includes(normalizedQuery));
      const matchesStatus = statusFilter === "All statuses" || (item.status || "Not set") === statusFilter;
      return matchesQuery && matchesStatus;
    }).slice(0, 8);
  }, [query, statusFilter, users]);

  if (loading) {
    return <div className="admin-dashboard-shell"><div className="admin-dashboard-card"><Loader message="Loading dashboard..." /></div></div>;
  }

  const greetingName = user?.name?.trim().split(/\s+/)[0] || "there";
  const stats = [
    { label: "Total users", value: dashboard.totalUsers, mark: "TU", tone: "indigo" },
    { label: "Active", value: dashboard.active, mark: "AC", tone: "green" },
    { label: "Pending", value: dashboard.pending, mark: "PE", tone: "amber" },
    { label: "Blocked", value: dashboard.blocked, mark: "BL", tone: "rose" },
  ];

  return (
    <main className="admin-dashboard-shell">
      <div className="admin-dashboard-card">
        <header className="admin-welcome">
          <div>
            <p className="admin-eyebrow">ADMINISTRATION · OVERVIEW</p>
            <h1>Good day, {greetingName}</h1>
            <p className="admin-welcome-copy">Here’s what’s happening across your workspace today.</p>
          </div>
          <Link className="admin-primary-link" to="/admin/users">Manage users <span aria-hidden="true">↗</span></Link>
        </header>

        {error && <p className="error-message admin-dashboard-error" role="alert">{error}</p>}

        <section className="admin-stats-grid" aria-label="User statistics">
          {stats.map((stat) => (
            <article className="admin-stat-card" key={stat.label}>
              <span className={`admin-stat-mark ${stat.tone}`} aria-hidden="true">{stat.mark}</span>
              <span className="admin-stat-label">{stat.label}</span>
              <strong>{stat.value.toLocaleString()}</strong>
              <span className="admin-stat-caption">Accounts in your workspace</span>
            </article>
          ))}
        </section>

        <section className="admin-users-panel" aria-labelledby="admin-users-heading">
          <div className="admin-panel-heading">
            <div>
              <p className="admin-eyebrow">PEOPLE</p>
              <h2 id="admin-users-heading">User directory</h2>
              <p>Search and review the latest accounts in your workspace.</p>
            </div>
            <Link className="admin-text-link" to="/admin/users">View all users <span aria-hidden="true">→</span></Link>
          </div>

          <div className="admin-directory-tools">
            <label className="admin-search">
              <span aria-hidden="true">⌕</span>
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, department..." aria-label="Search users" />
            </label>
            <label className="admin-filter-label">
              <span className="sr-only">Filter by status</span>
              <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                {["All statuses", "Active", "Pending", "Blocked", "Inactive", "Not set"].map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-user-table">
              <thead><tr><th scope="col">USER</th><th scope="col">ROLE</th><th scope="col">DEPARTMENT</th><th scope="col">STATUS</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
              <tbody>
                {visibleUsers.map((item) => {
                  const initials = item.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("") || "U";
                  const status = item.status || "Not set";
                  return <tr key={item.id}>
                    <td><div className="admin-user-cell"><span className="admin-user-avatar" aria-hidden="true">{initials}</span><span className="admin-user-info"><strong>{item.name}</strong><small>{item.email}</small></span></div></td>
                    <td><span className="admin-role-label">{item.role}</span></td>
                    <td className="admin-department-cell">{item.department || "—"}</td>
                    <td><span className={`admin-status-pill ${status.toLowerCase().replace(/\s+/g, "-")}`}><i aria-hidden="true" />{status}</span></td>
                    <td><button className="admin-view-button" type="button" onClick={() => navigate(`/admin/users/${item.id}`)}>View <span aria-hidden="true">↗</span></button></td>
                  </tr>;
                })}
              </tbody>
            </table>
            {!error && users.length === 0 && <div className="admin-empty-state"><span aria-hidden="true">✳</span><strong>No users yet</strong><p>New accounts will appear here when they join.</p></div>}
            {users.length > 0 && visibleUsers.length === 0 && <div className="admin-empty-state"><strong>No matching users</strong><p>Try another name or status.</p></div>}
          </div>
          {users.length > 8 && <p className="admin-list-note">Showing {visibleUsers.length} of {users.length} accounts. <Link to="/admin/users">See the full directory</Link>.</p>}
        </section>

        {dashboard.activity.length > 0 && <section className="admin-activity-panel" aria-labelledby="admin-activity-heading">
          <div className="admin-panel-heading"><div><p className="admin-eyebrow">UPDATES</p><h2 id="admin-activity-heading">Recent activity</h2></div></div>
          <ul>{dashboard.activity.slice(0, 4).map((item, index) => <li key={`${item}-${index}`}><span className="admin-activity-dot" aria-hidden="true" /><span>{item}</span></li>)}</ul>
        </section>}
      </div>
    </main>
  );
};

export default AdminDashboard;
