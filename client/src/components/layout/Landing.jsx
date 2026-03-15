import { Link } from "react-router-dom"


function Landing() {
    return (
        <div className="landing-page">
            <h1>Welcome to ChatApp</h1>
            <div className="auth-options">
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
                <Link to="/admin/login">Admin Login</Link>
            </div>
        </div>
    )
}

export default Landing