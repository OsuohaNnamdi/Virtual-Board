import "../Styles/Navbar.css";
import logo from "./logos.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBars } from 'react-icons/fa';
import Swal from 'sweetalert2';  

function Navbar() {
  const nav = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);  // State to toggle the main menu
  const [subMenuOpen, setSubMenuOpen] = useState(false);  // State to toggle the SubNavbar
  const userType = localStorage.getItem("TYPE");
  const userStudentType = localStorage.getItem("TYPES");

  const logOut = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      nav("/"); 
      localStorage.clear(); 
      window.location.reload(); 
    }
  };


  
  const closeMenu = () => {
    setMenuOpen(false);
    setSubMenuOpen(false);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setSubMenuOpen(false); 
  };

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);  
  };

  return (
    <nav className="NavbarContainer">
      <img 
        src={logo} 
        alt="Logo" 
        id="logo" 
        style={{
          width: '110px',  
          height: 'auto',  
          display: 'block',
          float: 'left'
        }} 
      />

      
      <FaBars className="menu-icon" onClick={toggleMenu} />

      <div className={`categories ${menuOpen ? "show-menu" : ""}`}>
        {userStudentType ? (
          <>
            
            <Link to="/" onClick={ toggleSubMenu}>Home</Link>
            <Link to="/community" onClick={closeMenu}>Community</Link>
            <Link to="/profile" onClick={closeMenu}>Profile</Link>
            <Link onClick={() => { closeMenu(); logOut(); }}>Sign Out</Link>
          </>
        ) : userType ? (
          <>
            <Link to="/"  onClick={closeMenu} >Home</Link>
            <Link to="/community"  onClick={closeMenu}>Community</Link>
            <Link to="/add"  onClick={closeMenu} >Add Dashboard</Link>
            <Link to="/notice"  onClick={closeMenu} >All Notice</Link>
            <Link  onClick={() => { closeMenu(); logOut(); }}>Sign Out</Link>
          </>
        ) : (
          <div className="buttons">
            <Link to="/">
              <button  onClick={closeMenu} >Home</button>
            </Link>
            <Link to="/login">
              <button  onClick={closeMenu} >Login</button>
            </Link>
          </div>
        )}

      </div>

      
      {subMenuOpen && (
        <div className="sub-navbar-mobile">
          <Link to="/" className="sub-nav-link"  onClick={closeMenu} >All</Link>
          <Link to="/faculty" className="sub-nav-link"  onClick={closeMenu} >Faculty</Link>
          <Link to="/department" className="sub-nav-link"  onClick={closeMenu} >Department</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
