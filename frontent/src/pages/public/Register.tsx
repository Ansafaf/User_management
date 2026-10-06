import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authApi";
import RegisterForm from "../../components/RegisterForm";

const Register = () => {
  const navigate = useNavigate();
  const handleSubmit = async (form: { name: string; email: string; password: string }) => {
      await registerUser(form);
      navigate("/login", {
        state: { successMessage: "Account created successfully. Please sign in." },
      });
  };

  return (
    <div className="page-shell">
      <div className="page-card">
        <button type="button" className="back-btn" onClick={() => navigate("/")}>
          ← Back
        </button>
        <RegisterForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default Register;
