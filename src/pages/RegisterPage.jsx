import { Link } from "react-router-dom";

export default function Register() {

  return (
    <div style={styles.page}>

      <div style={styles.card}>

        {/* Logo */}
        <div style={styles.logo}>TaxPal</div>

        {/* Heading */}
        <h2 style={styles.heading}>Create Your Account</h2>
        <p style={styles.subheading}>
          Start managing your finances today
        </p>

        {/* Full Name */}
        <label style={styles.label}>Full Name</label>
        <input
          type="text"
          placeholder="Enter full name"
          style={styles.input}
        />

        {/* Email */}
        <label style={styles.label}>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          style={styles.input}
        />

        {/* Password */}
        <label style={styles.label}>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          style={styles.input}
        />

        {/* Confirm Password */}
        <label style={styles.label}>Confirm Password</label>
        <input
          type="password"
          placeholder="••••••••"
          style={styles.input}
        />

        {/* Country */}
        <label style={styles.label}>Country</label>
        <select style={styles.input}>
          <option>Select your country</option>
          <option>India</option>
          <option>USA</option>
          <option>UK</option>
        </select>

        {/* Income Bracket */}
        <label style={styles.label}>Income Bracket (Optional)</label>
        <select style={styles.input}>
          <option>Select your income bracket</option>
          <option>$0-$25k</option>
          <option>$25k-$50k</option>
          <option>$50k-$100k</option>
        </select>

        {/* Sign Up */}
        <button style={styles.signUpBtn}>Sign Up</button>

        {/* Terms */}
        <p style={styles.terms}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>

        {/* Login */}
        <p style={styles.loginText}>
          Already have an account? <Link to="/">Login</Link>
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

  signUpBtn: {
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

  terms: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "15px"
  },

  loginText: {
    marginTop: "20px",
    fontSize: "14px",
    color: "#6b7280"
  }

};
