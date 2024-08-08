import React from "react";
import "../Styles/SubNavbar.css";

function SubNavbar() {

    const auth = localStorage.getItem("jwtToken");

    return (
        <div className="sub-navbar">
            {auth?<>
            <a href="/" className="sub-nav-link">All</a>
            <a href="/faculty" className="sub-nav-link">Faculty</a>
            <a href="/department" className="sub-nav-link">Department</a>
            </>
            :<></> }

        </div>
    );
}

export default SubNavbar;
