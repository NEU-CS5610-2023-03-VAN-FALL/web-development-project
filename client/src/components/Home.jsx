import "../style/home.css";
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";


export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  const order = async () => {
    if (isAuthenticated) {
      navigate('/app');
    } else {
      try {
        await loginWithRedirect({ screen_hint: 'login' });
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  const handleMenuClick = () => {
    navigate('/Menu');
  };

  return (
    <div className="Home">
      <header className="header">
        <h1 className="title">Welcome to Zhimin Drink Shop!</h1>
      </header>
  
      <div className="menu">
        <ul className="menu-list">
          <li>
          <button onClick={() => navigate('/')}className="btn-secondary">
            Home
          </button>
          </li>
          <li>
            <button onClick={handleMenuClick} className="btn-secondary">
              Menu
            </button>
          </li>
          <li>
            <button onClick={() => navigate('/Contact')}className="btn-secondary">
              Contact Us
            </button>
          </li>

          {!isAuthenticated ? (
          
            <li>
              <button onClick={loginWithRedirect} className="btn-primary">
                Login
              </button>
            </li>
          ) : (
            <li>
              <Link to="/app" className="btn-primary">
                Enter App
              </Link>
            </li>
          )}

          <li>
            <button onClick={signUp} className="btn-secondary">
              Create Account
            </button>
          </li>
  
          <li>
            <button onClick={order} className="btn-secondary">
              Order
            </button>
          </li>
        </ul>
      </div>

    </div>
);
};  

