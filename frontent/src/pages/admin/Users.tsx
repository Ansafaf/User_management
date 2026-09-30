import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { getUsers } from "../../services/adminApi";
import { setError, setLoading, setUsers } from "../../redux/slices/userSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { useAuth } from "../../hooks/auth";

const Users = () => {
  const { token } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      dispatch(setError(null));
      dispatch(setLoading(true));
      try {
        const data = await getUsers(token);
        dispatch(setUsers(data));
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : "Failed to fetch users"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUsers();
  }, [dispatch, token]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <Loader message="Loading users..." />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-card">
        <div className="section-header">
          <h1>User Management</h1>
          <button className="primary-btn small-btn">Add User</button>
        </div>

        {error && <p className="error-message" role="alert">{error}</p>}

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>
                  {user.status ? (
                    <span className={`status-pill ${user.status.toLowerCase()}`}>{user.status}</span>
                  ) : <span className="muted-text">Not set</span>}
                </td>
                <td>
                  <button type="button" className="link-btn" onClick={() => navigate(`/admin/users/${user.id}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!error && users.length === 0 && <p className="muted-text">No users found.</p>}
      </div>
    </div>
  );
};

export default Users;