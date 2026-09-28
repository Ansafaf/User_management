import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { getUserById } from "../../services/adminApi";
import { setError, setLoading, setSelectedUser } from "../../redux/slices/userSlice";
import type { AppDispatch, RootState } from "../../redux/store";

const UserDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const selectedUser = useSelector((state: RootState) => state.users.selectedUser);
  const loading = useSelector((state: RootState) => state.users.loading);

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      dispatch(setLoading(true));
      try {
        const user = await getUserById(id);
        dispatch(setSelectedUser(user ?? null));
      } catch (error) {
        dispatch(setError(error instanceof Error ? error.message : "Failed to load user details"));
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchUser();
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <Loader message="Loading user details..." />
        </div>
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="page-shell">
        <div className="page-card">
          <h1>User Details</h1>
          <p className="muted-text">User not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-card">
        <h1>User Details</h1>

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
            <strong>{selectedUser.status}</strong>
          </div>
          <div className="detail-item">
            <span>Department</span>
            <strong>{selectedUser.department || "N/A"}</strong>
          </div>
          <div className="detail-item">
            <span>Location</span>
            <strong>{selectedUser.location || "N/A"}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;