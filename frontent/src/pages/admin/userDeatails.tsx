import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { getUserById } from "../../services/adminApi";
import { setError, setLoading, setSelectedUser } from "../../redux/slices/userSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { useAuth } from "../../hooks/auth";

const UserDetails = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const selectedUser = useSelector((state: RootState) => state.users.selectedUser);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  useEffect(() => {
    if (!id || !token) return;

    const fetchUser = async () => {
      dispatch(setError(null));
      dispatch(setSelectedUser(null));
      dispatch(setLoading(true));
      try {
        const user = await getUserById(id, token);
        dispatch(setSelectedUser(user));
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : "Failed to load user details"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch, id, token]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <button type="button" className="back-btn" onClick={() => navigate("/admin/users")}>
            ← Back to users
          </button>
          <Loader message="Loading user details..." />
        </div>
      </div>
    );
  }

  if (error || !selectedUser) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <button type="button" className="back-btn" onClick={() => navigate("/admin/dashboard")}>
            ← Back to dashboard
          </button>
          <h1>User Details</h1>
          <p className={error ? "error-message" : "muted-text"} role={error ? "alert" : undefined}>
            {error || "User not found."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-card">
        <button type="button" className="back-btn" onClick={() => navigate("/admin/dashboard")}>
          ← Back to dashboard
        </button>
        <div className="section-header">
          <h1>User Details</h1>
          <button type="button" className="primary-btn small-btn" onClick={() => navigate(`/admin/users/${selectedUser.id}/edit`)}>
            Edit User
          </button>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span>Name</span>
            <strong>{selectedUser.name}</strong>
          </div>
          <div className="detail-item">
            <span>Email</span>
            <strong>{selectedUser.email}</strong>
          </div>
          <div className="detail-item">
            <span>Role</span>
            <strong>{selectedUser.role}</strong>
          </div>
          <div className="detail-item">
            <span>Status</span>
            <strong>{selectedUser.status || "Not set"}</strong>
          </div>
          <div className="detail-item">
            <span>Phone</span>
            <strong>{selectedUser.phone || "N/A"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;