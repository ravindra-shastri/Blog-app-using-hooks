import React from 'react';
import { NavLink } from 'react-router-dom';

export default class Header extends React.Component {
  handlelogout = () => {
    return localStorage.clear()
  }
  render() {
    return (
      <>
        <div>
          <header className="header-nav-content">
            <NavLink to="/">
              <button className="header-nav-btn logo">
                Blog
              </button>
            </NavLink>
            <nav>
              <NavLink to="/">
                <button className="header-nav-btn">
                  Home
                </button>
              </NavLink>
              <NavLink to="/addArticle">
                <button className="header-nav-btn">
                  <i className="fa-solid fa-pen-to-square"></i>
                  New Post
                </button>
              </NavLink>
              <NavLink to="/settings">
                <button className="header-nav-btn">
                  <i className="fa-solid fa-gear"></i>
                  Settings
                </button>
              </NavLink>
              <NavLink to="/signup" exact>
                <button className="header-nav-btn">
                  Sign up
                </button>
              </NavLink>
              <NavLink to="/login" exact>
                <button className="header-nav-btn">
                  Login
                </button>
              </NavLink>
              <button className="header-nav-btn"
                onClick={this.handlelogout}
              >
                Log out
              </button>
            </nav>
          </header>
        </div>
      </>
    )
  }
}