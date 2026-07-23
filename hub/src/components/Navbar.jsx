import { Link } from "react-router";

function Navbar(){
    return(
        <nav>
            <h2>NbaHub Forum</h2>

            <dev>
                <Link to="/">Home</Link>
                <Link to="/create">Create Post</Link>
            </dev>
        </nav>
    );
}

export default Navbar;