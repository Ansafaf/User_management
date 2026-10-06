import { useState } from "react";

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
};

type RegisterFormProps = {
  title?: string;
  submitLabel?: string;
  submittingLabel?: string;
  onSubmit: (values: RegisterFormValues) => Promise<void>;
};

const RegisterForm = ({
  title = "Create Account",
  submitLabel = "Register",
  submittingLabel = "Registering...",
  onSubmit,
}: RegisterFormProps) => {
  const [form, setForm] = useState<RegisterFormValues>({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter") return;
    const inputs = Array.from(event.currentTarget.querySelectorAll<HTMLInputElement>(
      'input:not([disabled]):not([type="submit"]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])',
    ));
    const index = inputs.indexOf(event.target as HTMLInputElement);
    if (index < 0 || index >= inputs.length - 1) return;

    event.preventDefault();
    inputs[index + 1].focus();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const values = { name: form.name.trim(), email: form.email.trim(), password: form.password };
    if (!values.name || !values.email || !values.password) {
      setError("Please fill in all fields.");
      return;
    }
    if (values.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Could not create the account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1>{title}</h1>
      <form className="form-grid" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <label className="field">
          <span>Full Name</span>
          <input type="text" name="name" placeholder="Jane Smith" value={form.name}
            onChange={(event) => setForm((previous) => ({ ...previous, name: event.target.value }))} />
        </label>
        <label className="field">
          <span>Email</span>
          <input type="email" name="email" placeholder="jane@company.com" value={form.email}
            onChange={(event) => setForm((previous) => ({ ...previous, email: event.target.value }))} />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" name="password" placeholder="Create password" value={form.password}
            onChange={(event) => setForm((previous) => ({ ...previous, password: event.target.value }))} />
        </label>
        {error && <p className="error-message" role="alert">{error}</p>}
        <button type="submit" className="primary-btn" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </form>
    </>
  );
};

export default RegisterForm;
