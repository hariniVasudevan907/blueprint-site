import { useState } from "react";

export default function Signup({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSignup = (e) => {
    e.preventDefault();
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!email.includes("@")) {
      newErrors.email = "Email must contain '@'";
    }
    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      alert("Sign Up successful!");
      // Call typical proceed logic here
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>RoomAdda</h2>
        <p style={styles.subtitle}>Create an Account</p>

        <input
          style={{ ...styles.input, borderColor: errors.name ? "red" : "#444" }}
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <div style={styles.error}>{errors.name}</div>}

        <input
          style={{ ...styles.input, borderColor: errors.email ? "red" : "#444" }}
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <div style={styles.error}>{errors.email}</div>}

        <input
          style={{ ...styles.input, borderColor: errors.password ? "red" : "#444" }}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <div style={styles.error}>{errors.password}</div>}

        <button style={styles.button} onClick={handleSignup}>
          Sign Up
        </button>

        <p style={styles.link} onClick={onSwitchToLogin}>
          Already have an account? Login
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #0f0f0f, #1a1a1a)",
    color: "white",
    fontFamily: "Arial, sans-serif"
  },
  card: {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "40px",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "400px",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
    boxSizing: "border-box"
  },
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    margin: "0 0 5px 0"
  },
  subtitle: {
    textAlign: "center",
    color: "#ccc",
    margin: "0 0 15px 0",
    fontSize: "15px"
  },
  input: {
    padding: "14px",
    borderRadius: "8px",
    border: "1px solid #444",
    background: "rgba(0, 0, 0, 0.2)",
    color: "white",
    width: "100%",
    boxSizing: "border-box",
    fontSize: "15px"
  },
  button: {
    marginTop: "10px",
    padding: "15px",
    background: "linear-gradient(45deg, red, orange)",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "16px"
  },
  error: {
    color: "#ff4444",
    fontSize: "12px",
    marginTop: "-6px"
  },
  link: {
    fontSize: "14px",
    textAlign: "center",
    color: "#aaa",
    cursor: "pointer",
    marginTop: "10px",
    textDecoration: "underline"
  }
};
