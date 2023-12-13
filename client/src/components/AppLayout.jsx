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
      {/* <img src="https://i.fbcd.co/products/original/pig-logo-design-vector-0e7cea69facb05b519d578326eca960e19f6ae46513ef4226529aa50362635dd.jpg" alt="Logo" className="logo" /> */}
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
              <button onClick={() => navigate('profile')}>
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
                AuthDebugger
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
