import "../style/menu.css";
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";


export default function Menu() {
    const navigate = useNavigate();
    const { isAuthenticated, loginWithRedirect } = useAuth0();
    const signUp = () => loginWithRedirect({ screen_hint: "signup" });
    const [drinks, setDrinks] = useState([]);


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

    const order = async () => {
      if (isAuthenticated) {
        navigate('/app/order');
      } else {
        try {
          await loginWithRedirect({ screen_hint: 'login' });
        } catch (error) {
          console.error('Login error:', error);
        }
      }
    };
      

    return(
      <div className="Home">
      {/* <img src="https://i.fbcd.co/products/original/pig-logo-design-vector-0e7cea69facb05b519d578326eca960e19f6ae46513ef4226529aa50362635dd.jpg" alt="Logo" className="logo" /> */}
        <header className="header">
          <h2 className="title">Zhimin Drink Shop</h2>
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
                Contact
              </button>
            </li>
            <li>
              <button onClick={order} className="btn-secondary">
                Order
              </button>
            </li>
            <li>
              <button onClick={signUp} className="btn-secondary">
                SignUp
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
              <button className="enter-button" onClick={() => navigate('/app/profile')}>
              Enter App
              </button>
            </li>
            )}
  
          </ul>
        </div>
  

    <div className="drinks-container">
        <ul className="drinks-list">
          {drinks.map((drink) => (
            <li key={drink.productId}>
              {/* console.log(drink.id); */}
              <img
                src={drink.imageUrl}
                alt={drink.productName}
                width="150"
                height="150"
                onClick={() => alert(`Product ID: ${drink.productId}\nProduct Name: ${drink.productName}\nDescription: ${drink.description}\nPrice: ${drink.price}`)}
              />
              <h3>{drink.productName}</h3>
              <h3>${drink.price}</h3>
            </li>
            ))}
        </ul>
      </div>
    </div>
    )
}
