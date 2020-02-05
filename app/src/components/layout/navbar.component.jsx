import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const Navbar = () => {
    return (
        <nav className="nav-wrapper gret-darken-3">
            <div className="container">
                <Link to="/" className="left">My Actions</Link>
                <ul className="right">
                    <li><NavLink to="/create">New Opportunity</NavLink></li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar