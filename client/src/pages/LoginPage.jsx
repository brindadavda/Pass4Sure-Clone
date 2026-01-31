import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(formData.email, formData.password);
      navigate("/practice");
    } catch (err) {
      const responseData = err.response?.data;
      const status = err.response?.status;
      const message =
        status === 404
          ? "Your account is not created yet. Please sign up first."
          : responseData?.message || "Unable to log in. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg px-6 py-12">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">Log in</h2>
        <p className="mt-2 text-sm text-slate-600">Access your dashboard and subscriptions.</p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          ) : null}
          <button
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing in..." : "Continue"}
          </button>
        </form>
        <div className="mt-4 text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="text-blue-600">
            Sign up
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
