import "../style/home.css";
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";


export default function Menu() {
    const navigate = useNavigate();
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const signUp = () => loginWithRedirect({ screen_hint: "signup" });
    const [cart, setCart] = useState({});
    const [drinks, setDrinks] = useState([]);

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

    useEffect(() => {
        const fetchDrinks = async () => {
          try {
            const response = await fetch("http://localhost:8000/products");
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setDrinks(data);
          } catch (error) {
            console.error("Error fetching drinks:", error);
          }
        };
      
        fetchDrinks();
    }, []);
      

    return(
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
              <button onClick={() => navigate('/Menu')}className="btn-secondary">
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

    <div className="drinks-container">
        <ul className="drinks-list">
          {drinks.map((drink) => (
            <li key={drink.id}>
              <img
                src={drink.imageUrl}
                alt={drink.productName}
                width="150"
                height="150"
                onClick={() => alert(`Product ID: ${drink.productId}\nProduct Name: ${drink.productName}\nDescription: ${drink.description}\nPrice: ${drink.price}`)}
              />
              <p>{drink.productName}</p>
              <p>${drink.price}</p>

            </li>
            ))}
        </ul>
      </div>
    </div>
    )

}
