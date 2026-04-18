import { useState } from "react";

export default function Login({ onLogin, onSwitchToSignup, onSwitchToForgot }) {
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
            newErrors.email = "Please enter a valid email address";
        }

        if (!password) {
            newErrors.password = "Password is required";
        }

        return newErrors;
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            setLoading(true);

            // Simulate API call
            setTimeout(() => {
                setLoading(false);
                onLogin();
            }, 1500);
        }
    };

    return (
        <div className="login-container">
            <style>{`
        .login-container {
          min-height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
          color: white;
          font-family: Arial, sans-serif;
          box-sizing: border-box;
          padding: 20px;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 45px 40px;
          border-radius: 16px;
          width: 100%;
          max-width: 400px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.05);
          animation: fadeIn 0.6s ease-out;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .login-logo {
          font-size: 32px;
          font-weight: bold;
          color: red;
          text-align: center;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-label {
          font-size: 14px;
          color: #ccc;
          font-weight: 500;
        }

        .input-wrapper {
          position: relative;
          width: 100%;
        }

        .login-input {
          width: 100%;
          padding: 14px 16px;
          border-radius: 8px;
          border: 1px solid #444;
          background: rgba(0, 0, 0, 0.2);
          color: white;
          font-size: 15px;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .login-input::placeholder {
          color: #777;
        }

        .login-input:focus {
          outline: none;
          border-color: red;
          transform: scale(1.02);
          background: rgba(255, 0, 0, 0.05);
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.1);
        }

        .login-input.error {
          border-color: #ff4444;
        }

        .error-text {
          color: #ff4444;
          font-size: 12px;
          margin-top: 4px;
          animation: shake 0.3s ease-in-out;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        .eye-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          color: #aaa;
          font-size: 14px;
          user-select: none;
          transition: color 0.2s;
          font-weight: 500;
        }

        .eye-icon:hover {
          color: white;
        }

        .login-button {
          width: 100%;
          padding: 15px;
          margin-top: 10px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(45deg, red, orange);
          color: white;
          font-weight: bold;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 0, 0, 0.4);
        }

        .login-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .links-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          margin-top: 5px;
        }

        .login-link {
          color: #aaa;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s;
          background: none;
          border: none;
          padding: 0;
          font-family: inherit;
        }

        .login-link:hover {
          color: white;
          text-decoration: underline;
        }
      `}</style>

            <form className="login-card" onSubmit={handleLogin}>
                <div className="login-logo">RoomAdda</div>

                <div className="input-group">
                    <label className="input-label">Email Address</label>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            className={`login-input ${errors.email ? 'error' : ''}`}
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    {errors.email && <div className="error-text">{errors.email}</div>}
                </div>

                <div className="input-group">
                    <label className="input-label">Password</label>
                    <div className="input-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            className={`login-input ${errors.password ? 'error' : ''}`}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: "60px" }}
                        />
                        <span
                            className="eye-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Hide" : "Show"}
                        </span>
                    </div>
                    {errors.password && <div className="error-text">{errors.password}</div>}
                </div>

                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>

                <div className="links-container">
                    <button
                        type="button"
                        className="login-link"
                        onClick={onSwitchToForgot}
                    >
                        Forgot Password?
                    </button>
                    <button
                        type="button"
                        className="login-link"
                        onClick={onSwitchToSignup}
                    >
                        Don't have an account? Sign up
                    </button>
                </div>
            </form>
        </div>
    );
}