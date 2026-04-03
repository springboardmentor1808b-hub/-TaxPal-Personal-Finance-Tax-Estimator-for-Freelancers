import { Link } from "react-router-dom";

export default function Login() {
  const handleHover = (e) => {
    e.target.style.border = "1px solid #2563eb";
    e.target.style.color = "#2563eb";
  };

  const handleLeave = (e) => {
    e.target.style.border = "1px solid #e5e7eb";
    e.target.style.color = "#374151";
  };

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>TaxPal</div>

        {/* Heading */}
        <h2 style={styles.heading}>Welcome Back</h2>
        <p style={styles.subheading}>
          Enter your credentials to access your account
        </p>

        {/* Email */}
        <label style={styles.label}>Email address</label>
        <input
          type="email"
          placeholder="Enter email"
          style={styles.input}
        />

        {/* Password */}
        <div style={styles.passwordRow}>
          <label style={styles.label}>Password</label>
          <span style={styles.forgot}>Forgot Password?</span>
        </div>

        <input
          type="password"
          placeholder="••••••••••"
          style={styles.input}
        />

        {/* Sign In */}
        <button style={styles.signInBtn}>Sign In</button>

        {/* Divider */}
        <div style={styles.divider}>
          <div style={styles.line}></div>
          <span style={styles.or}>OR</span>
          <div style={styles.line}></div>
        </div>

        {/* Social Buttons */}
        <div style={styles.socialContainer}>
          <button
            style={styles.socialBtn}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            Google
          </button>

          <button
            style={styles.socialBtn}
            onMouseEnter={handleHover}
            onMouseLeave={handleLeave}
          >
            GitHub
          </button>
        </div>

        {/* Signup */}
        <p style={styles.signupText}>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>

      </div>
    </div>
  );
}

const styles = {

  page: {
    height: "100vh",
    background: "#f9fafb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "sans-serif"
  },

  card: {
    width: "380px",
    background: "#fff",
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    textAlign: "center"
  },

  logo: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#2563eb",
    marginBottom: "20px"
  },

  heading: {
    margin: 0
  },

  subheading: {
    color: "#6b7280",
    fontSize: "14px",
    marginBottom: "25px"
  },

  label: {
    display: "block",
    textAlign: "left",
    fontSize: "14px",
    marginBottom: "5px"
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    marginBottom: "15px"
  },

  passwordRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  forgot: {
    fontSize: "13px",
    color: "#2563eb",
    cursor: "pointer"
  },

  signInBtn: {
    width: "100%",
    padding: "12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "500",
    marginTop: "10px",
    cursor: "pointer"
  },

  divider: {
    display: "flex",
    alignItems: "center",
    margin: "20px 0"
  },

  line: {
    flex: 1,
    height: "1px",
    background: "#e5e7eb"
  },

  or: {
    margin: "0 10px",
    color: "#9ca3af",
    fontSize: "14px"
  },

  socialContainer: {
    display: "flex",
    gap: "10px"
  },

  socialBtn: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    color: "#374151",
    fontWeight: "500",
    cursor: "pointer",
    transition: "0.2s"
  },

  signupText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#6b7280"
  }

};
