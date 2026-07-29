import { Link } from "react-router";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="navbar-logo">NBAHub</h2>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/create">Create Post</Link>
      </div>
    </nav>
  );
}

export default Navbar;