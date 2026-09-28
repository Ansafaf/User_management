import { useState } from "react";
import { loginUser } from "../../services/authApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/auth";

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!email.trim() || !password.trim()) {
            setError("Please enter both email and password.");
            return;
        }

        setIsSubmitting(true);

        try {
            const data = await loginUser({ email, password });
            login(data.user, data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Login failed. Please try again.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="page-shell">
            <div className="page-card">
                <button type="button" className="back-btn" onClick={() => navigate("/")}>
                    ← Back
                </button>
                <h1>Login</h1>
                <form className="form-grid" onSubmit={handleSubmit}>
                    <label className="field">
                        <span>Email</span>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <label className="field">
                        <span>Password</span>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" className="primary-btn" disabled={isSubmitting}>
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login;