import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { getAdminDashboardSummary } from "../../services/adminApi";
import { setDashboardSummary, setError, setLoading } from "../../redux/slices/userSlice";
import type { AppDispatch, RootState } from "../../redux/store";

const AdminDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboard = useSelector((state: RootState) => state.users.dashboard);
  const loading = useSelector((state: RootState) => state.users.loading);

  useEffect(() => {
    const fetchDashboard = async () => {
      dispatch(setLoading(true));
      try {
        const summary = await getAdminDashboardSummary();
        dispatch(setDashboardSummary(summary));
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : "Failed to load dashboard summary"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchDashboard();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <Loader message="Loading dashboard..." />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-card dashboard-box">
        <h1>Admin Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <span>Total Users</span>
            <strong>{dashboard.totalUsers}</strong>
          </div>
          <div className="stat-card">
            <span>Active</span>
            <strong>{dashboard.active}</strong>
          </div>
          <div className="stat-card">
            <span>Pending</span>
            <strong>{dashboard.pending}</strong>
          </div>
          <div className="stat-card">
            <span>Blocked</span>
            <strong>{dashboard.blocked}</strong>
          </div>
        </div>

        <div className="list-box">
          <h3>Recent Activity</h3>
          <ul>
            {dashboard.activity.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;