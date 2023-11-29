import "../style/home.css";
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CartPage from './CartPage';
import Contact from './Contact';



export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect,logout } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  const order = async () => {
    if (isAuthenticated) {
      navigate('/CartPage');
    } else {
      try {
        await loginWithRedirect({ screen_hint: 'login' });
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  const drinks = [
    { id: 1, name: 'Latte', price: 3.5, image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/flat-white-3402c4f.jpg?quality=90&resize=500,454" },
    { id: 2, name: 'Tea', price: 2.5, image: "https://www.foodandwine.com/thmb/6wTm7a0y87X97LK-ZMxe2787kI8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/different-types-of-tea-FT-BLOG0621-7c7fd231e66d4fea8ca9a47cad52ba79.jpg" },
    { id: 3, name: 'Smoothie', price: 4.0, image: 'https://cdn.loveandlemons.com/wp-content/uploads/2023/05/mango-smoothie.jpg' },
    { id: 4, name: 'Bubble Tea', price: 4.0, image: 'https://www.honestfoodtalks.com/wp-content/uploads/2021/09/How-to-make-bubble-tea.jpeg' },
    { id: 5, name: 'Orange Juice', price: 4.0, image: 'https://www.alphafoodie.com/wp-content/uploads/2020/11/Orange-Juice-1-of-1.jpeg' },
    { id: 6, name: 'Machete Latte', price: 4.0, image: 'https://www.ohhowcivilized.com/wp-content/uploads/matcha-green-tea-latte-3.jpg' },
    { id: 7, name: 'Watermelon Juice', price: 4.0, image: 'https://cdn.loveandlemons.com/wp-content/uploads/2021/06/watermelon-juice.jpg' },
    { id: 8, name: 'Strawberries Juice', price: 4.0, image: 'https://cdn3.foodviva.com/static-content/food-images/juice-recipes/strawberry-juice-recipe/strawberry-juice-recipe.jpg' },
   
  ];

   // State to keep track of items in the cart
   const [cart, setCart] = useState({});
   const [showCart, setShowCart] = useState(false);

   const updateCart = (drink, quantity) => {
    const updatedCart = { ...cart };
    updatedCart[drink.id] = quantity;
    setCart(updatedCart);
  };

  const addToCart = (drink) => {
    const updatedQuantity = (cart[drink.id] || 0) + 1;
    updateCart(drink, updatedQuantity);
  };

  const removeFromCart = (drink) => {
    const updatedQuantity = Math.max((cart[drink.id] || 0) - 1, 0);
    updateCart(drink, updatedQuantity);
  };

  const cartItemCount = Object.values(cart).reduce((acc, quantity) => acc + quantity, 0);

  return (
    <div className="Home">
      <header className="header">
        <h1 className="title">Welcome to Zhimin Drink Shop!</h1>
      </header>
  
      <div className="menu">
        <ul className="menu-list">
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

          <li>
            <button onClick={() => navigate('/Contact')}className="btn-secondary">
              Contact Us
            </button>
          </li>

          <li>
            <button onClick={() => navigate('/CartPage')} className="cart-icon">
              <img
                src="https://www.clker.com//cliparts/X/U/F/3/N/2/shopping-cart-logo.svg.hi.png"
                alt="Cart"
                style={{ width: '40px', height: '40px' }}
              />
              <span>{cartItemCount}</span>
            </button>
          </li>

        </ul>
      </div>
    

      <div className="drinks-container">
        <ul className="drinks-list">
          {drinks.map((drink) => (
            <li key={drink.id}>
              <img src={drink.image} alt={drink.name} width="150" height="150" />
              <p>{drink.name}</p>
              <p>${drink.price}</p>
              <div className="quantity-buttons">
                <button onClick={() => removeFromCart(drink)}>-</button>
                <span>{cart[drink.id] || 0}</span>
                <button onClick={() => addToCart(drink)}>+</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
);
};  

