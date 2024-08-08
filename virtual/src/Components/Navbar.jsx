import "../Styles/App.css";
import "../Styles/Navbar.css";
import logo from "./logos.jpeg";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const nav = useNavigate();

  const userType = localStorage.getItem("TYPE");
  const userStudentType = localStorage.getItem("TYPES");

  console.log(userStudentType, userType)
  const logOut = () => {
    localStorage.clear();
    window.location.reload();
    nav("/");
  };

  console.log(userType);

  return (
    <nav className="NavbarContainer">
      <img 
        src={logo} 
        alt="Logo" 
        id="logo" 
        style={{
         width: '110px',  
         height: 'auto',  
         display : 'block',
         float: 'left'
        }} 
        />


      {userStudentType ? (
        <div className="categories">
          <Link to="/">Home</Link>
          <Link to="/community">Community</Link>
          <Link to="/about">About</Link>
          <Link to="/profile">Profile</Link>
          <Link onClick={logOut}>Sign Out</Link>
        </div>
      ) : userType ? (
        <div className="categories">
          <Link to="/">Home</Link>
          <Link to="/community">Community</Link>
          <Link to="/add">Add Dashboard</Link>
          <Link to="/notice">All Notice</Link>
          <Link onClick={logOut}>Sign Out</Link>
        </div>
      ) : (
        <div className="buttons">
          <Link to="/about">
            <button>About</button>
          </Link>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
