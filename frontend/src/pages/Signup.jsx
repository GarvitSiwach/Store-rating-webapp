import { useState } from "react";
import { signupUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");

    try {
      setLoading(true);
      await signupUser(form);

      setSuccess("Registration successful. Please login.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors[0].msg);
      } else {
        setError(
          err.response?.data?.message || "Registration failed"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>

        {error && <p style={styles.errorText}>{error}</p>}
        {success && <p style={styles.successText}>{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            style={styles.input}
            required
          />

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

          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            style={styles.input}
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="USER">USER</option>
            <option value="STORE_OWNER">STORE OWNER</option>
          </select>

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/login")}
          >
            Login
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
    width: "400px",
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
    marginBottom: "16px",
    borderRadius: "10px",
    border: "1px solid #e5e5e5",
    background: "#ffffff",
    color: "#333",
    outline: "none",
    fontSize: "14px",
  },

  select: {
    width: "100%",
    padding: "12px 15px",
    marginBottom: "18px",
    borderRadius: "10px",
    border: "1px solid #e5e5e5",
    background: "#ffffff",
    fontSize: "14px",
    cursor: "pointer",
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

  successText: {
    color: "#52c41a",
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

export default Signup;