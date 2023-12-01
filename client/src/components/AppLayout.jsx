import "../style/appLayout.css";

import { Outlet, Link,useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

export default function AppLayout() {
  const { user, isLoading, logout } = useAuth0();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="title">
        <h3>Zhimin Drink Shop</h3>
      </div>

      <div className="header">

        <nav className="menu">
          <ul className="menu-list">
            <li>
            <button onClick={() => navigate('/')}className="btn-secondary">
              Home
            </button>
            </li>
            <li>
              <button onClick={() => navigate('/app')}>
                Profile
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/app/order')}>
                Order Now
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/app/orderHistory')}>
                Order History
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/app/debugger')}>
                Auth Debugger
              </button>
            </li>
            <li>
              <button
                className="exit-button"
                onClick={() => logout({ returnTo: window.location.origin })}
              >
                Log Out
              </button>
            </li>
          </ul>
        </nav>

        

      </div>

      <div className="content">
        <Outlet />
      </div>

    </div>
  );
  }  
