import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const role = await login(form.email, form.password);

      // Role-based redirect
      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (role === "STORE_OWNER") {
        navigate("/owner");
      } else {
        navigate("/stores");
      }

    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>

        {error && <p style={styles.errorText}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={styles.footerText}>
          Don’t have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f6f8",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  card: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "20px",
    width: "380px",
    color: "#333",
    border: "1px solid #eee",
    boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
  },

  title: {
    marginBottom: "25px",
    fontWeight: 600,
    fontSize: "22px",
    textAlign: "center",
  },

  input: {
    width: "100%",
    padding: "12px 15px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #e5e5e5",
    background: "#ffffff",
    color: "#333",
    outline: "none",
    fontSize: "14px",
  },

  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "25px",
    border: "none",
    background: "#ff7a00",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: "14px",
  },

  errorText: {
    color: "#ff4d4f",
    marginBottom: "15px",
    fontSize: "14px",
    textAlign: "center",
  },

  footerText: {
    marginTop: "20px",
    fontSize: "14px",
    textAlign: "center",
    color: "#666",
  },

  link: {
    color: "#ff7a00",
    cursor: "pointer",
    fontWeight: 500,
  },
};

export default Login;