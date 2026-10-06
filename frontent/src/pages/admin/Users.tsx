import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader";
import { deleteAdminUser, getUsers, toggleBlockUser } from "../../services/adminApi";
import { removeUser, setError, setLoading, setUsers, updateUser } from "../../redux/slices/userSlice";
import type { AppDispatch, RootState } from "../../redux/store";
import { useAuth } from "../../hooks/auth";
import type { User } from "../../types/user";

const Users = () => {
  const { token } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const users = useSelector((state: RootState) => state.users.users);
  const loading = useSelector((state: RootState) => state.users.loading);
  const error = useSelector((state: RootState) => state.users.error);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteDialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = deleteDialogRef.current;
    if (!dialog) return;

    if (userToDelete && !dialog.open) dialog.showModal();
    if (!userToDelete && dialog.open) dialog.close();
  }, [userToDelete]);

  const handleDelete = async (user: User) => {
    if (!token) {
      dispatch(setError("You must be signed in to delete a user."));
      return;
    }
    dispatch(setError(null));
    setUserToDelete(user);
  };

  const confirmDelete = async () => {
    if (!token || !userToDelete) return;

    setIsDeleting(true);
    dispatch(setError(null));
    try {
      await deleteAdminUser(userToDelete.id, token);
      dispatch(removeUser(userToDelete.id));
      setUserToDelete(null);
    } catch (deleteError) {
      dispatch(setError(deleteError instanceof Error ? deleteError.message : "Failed to delete user."));
    } finally {
      setIsDeleting(false);
    }
  };
  const handleToggle = async (user: User) => {
    
    if (!token) {
      dispatch(setError("You must be signed in to update a user."));
      return;
    }

    dispatch(setError(null));
    try{
      const newStatus = user.status === "Active" ? "Blocked": "Active";
      const updatedUser = await toggleBlockUser(user.id, newStatus, token);
      dispatch(updateUser(updatedUser));
    }
    catch(error){
      dispatch(setError(error instanceof Error ? error.message : "Failed to update user."));
    }
  }
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
          <button type="button" className="primary-btn small-btn" onClick={() => navigate("/admin/users/add")}>Add User</button>
        </div>
          <button type="button" className="back-btn" onClick={() => navigate("/admin/dashboard")}>
            ← Back to dashboard
          </button>

        {error && <p className="error-message" role="alert">{error}</p>}

        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
              <th>Account access</th>
              <th>Delete</th>
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
                <td>
                  <button
                    type="button"
                    className={`user-toggle ${user.status === "Blocked" ? "user-toggle--unblock" : "user-toggle--block"}`}
                    onClick={() => handleToggle(user)}
                    aria-label={`${user.status === "Blocked" ? "Unblock" : "Block"} ${user.name}`}
                  >
                    {user.status === "Blocked" ? "Unblock" : "Block"}
                  </button>
                </td>
                <td>
                  <button type="button" className="user-toggle user-toggle--block" onClick={() => handleDelete(user)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!error && users.length === 0 && <p className="muted-text">No users found.</p>}
      </div>

      <dialog
        ref={deleteDialogRef}
        className="admin-delete-dialog"
        aria-labelledby="admin-delete-title"
        onCancel={(event) => {
          if (isDeleting) {
            event.preventDefault();
            return;
          }
          setUserToDelete(null);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget && !isDeleting) setUserToDelete(null);
        }}
      >
        <h2 id="admin-delete-title">Delete this user?</h2>
        <p>
          This will permanently delete {userToDelete?.name ?? "this user"}. This action cannot be undone.
        </p>
        {error && <p className="error-message" role="alert">{error}</p>}
        <div className="admin-delete-dialog-actions">
          <button
            type="button"
            className="admin-delete-cancel"
            onClick={() => setUserToDelete(null)}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="admin-delete-confirm"
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete user"}
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default Users;
