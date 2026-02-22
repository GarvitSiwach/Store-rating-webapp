import { useState } from "react";
import { updatePassword } from "../services/api";
import { useNavigate } from "react-router-dom";

const UpdatePassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword || !form.newPassword) {
      return setError("All fields are required");
    }

    if (form.newPassword.length < 6) {
      return setError("New password must be at least 6 characters");
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await updatePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });

      setMessage("Password updated successfully ✅");
      setForm({ currentPassword: "", newPassword: "" });

      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Failed to update password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Update Password</h2>

        {error && (
          <p style={styles.errorText}>
            {error}
          </p>
        )}

        {message && (
          <p style={styles.successText}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.button}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f6f8", // soft white background
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
    transition: "0.2s ease",
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
    transition: "0.2s ease",
  },

  errorText: {
    color: "#ff4d4f",
    marginBottom: "15px",
    fontSize: "14px",
  },

  successText: {
    color: "#52c41a",
    marginBottom: "15px",
    fontSize: "14px",
  },
};

export default UpdatePassword;