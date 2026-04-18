import { useState } from "react";

export default function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        let newErrors = {};

        if (!email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Enter valid email";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const handleLogin = () => {
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);

            setTimeout(() => {
                setLoading(false);
                onLogin(); // 👉 switches to dashboard
            }, 1000);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2>Login</h2>

                {/* Email */}
                <input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        ...styles.input,
                        borderColor: errors.email ? "red" : "#ccc",
                    }}
                />
                {errors.email && <p style={styles.error}>{errors.email}</p>}

                {/* Password */}
                <div style={{ position: "relative" }}>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{
                            ...styles.input,
                            paddingRight: "40px",
                            borderColor: errors.password ? "red" : "#ccc",
                        }}
                    />

                    {/* 👁 Custom toggle */}
                    <span
                        onClick={() => setShowPassword(!showPassword)}
                        style={styles.eye}
                    >
                        {showPassword ? "Hide" : "Show"}
                    </span>
                </div>

                {errors.password && <p style={styles.error}>{errors.password}</p>}

                <button onClick={handleLogin} style={styles.button}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p style={styles.link}>Forgot Password?</p>
                <p style={styles.link}>Don’t have an account? Sign up</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg,#0f0f0f,#1a1a1a)",
        color: "white",
    },
    card: {
        background: "rgba(255,255,255,0.05)",
        padding: "30px",
        borderRadius: "12px",
        width: "320px",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    input: {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #444",
        background: "transparent",
        color: "white",
    },
    eye: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        fontSize: "12px",
        color: "#aaa",
    },
    button: {
        marginTop: "10px",
        padding: "10px",
        background: "linear-gradient(45deg,red,orange)",
        border: "none",
        borderRadius: "8px",
        color: "white",
        cursor: "pointer",
    },
    error: {
        color: "red",
        fontSize: "12px",
    },
    link: {
        fontSize: "12px",
        textAlign: "center",
        color: "#ccc",
        cursor: "pointer",
    },
};