import { useState } from "react";
import { loginUser } from "../../services/authApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../hooks/auth";
import RouteNotice from "../../components/RouteNotice";

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const accountNotice = searchParams.get("notice") === "blocked"
        ? "This account was blocked by an administrator. Contact an administrator for help."
        : searchParams.get("notice") === "deleted"
            ? "Your account was deleted by an administrator. Please contact support if you believe this is a mistake."
            : "";
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter") return;

    const inputs = Array.from(
        e.currentTarget.querySelectorAll<HTMLElement>(
            'input:not([disabled]):not([type="submit"]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])'
        )
    );

    const index = inputs.indexOf(e.target as HTMLElement);

    if (index < 0 || index >= inputs.length - 1) return;

    e.preventDefault();
    inputs[index + 1].focus();
};
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
            navigate(data.user.role === "admin" ? "/admin/dashboard" : "/dashboard", { replace: true });
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
                <RouteNotice />
                {accountNotice && <p className="error-message" role="alert">{accountNotice}</p>}
                <form className="form-grid" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
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