import { useNavigate } from "react-router-dom";
import RegisterForm from "../../components/RegisterForm";
import { useAuth } from "../../hooks/auth";
import { createAdminUser } from "../../services/adminApi";

const AddUser = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleSubmit = async (values: { name: string; email: string; password: string }) => {
    if (!token) throw new Error("You must be signed in to add a user.");
    await createAdminUser(values, token);
    navigate("/admin/users", { state: { successMessage: "User added successfully." } });
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <button type="button" className="back-btn" onClick={() => navigate("/admin/users")}>
          ← Back to users
        </button>
        <RegisterForm
          title="Add User"
          submitLabel="Add User"
          submittingLabel="Adding user..."
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AddUser;
