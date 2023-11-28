import "../style/home.css";
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";


export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  const order = async () => {
    if (isAuthenticated) {
      navigate('/cart');
    } else {
      try {
        await loginWithRedirect({ screen_hint: 'login' });
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  const drinks = [
    { id: 1, name: 'Coffee', price: 3.5, image: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/flat-white-3402c4f.jpg?quality=90&resize=500,454" },
    { id: 2, name: 'Tea', price: 2.5, image: "https://www.foodandwine.com/thmb/6wTm7a0y87X97LK-ZMxe2787kI8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/different-types-of-tea-FT-BLOG0621-7c7fd231e66d4fea8ca9a47cad52ba79.jpg" },
    { id: 3, name: 'Smoothie', price: 4.0, image: 'https://cdn.loveandlemons.com/wp-content/uploads/2023/05/mango-smoothie.jpg' },
    { id: 4, name: 'bubble tea', price: 4.0, image: 'https://www.honestfoodtalks.com/wp-content/uploads/2021/09/How-to-make-bubble-tea.jpeg' },
    { id: 5, name: 'Orange Juice', price: 4.0, image: 'https://www.alphafoodie.com/wp-content/uploads/2020/11/Orange-Juice-1-of-1.jpeg' },
  ];

  return (
    <div className="home">

      <h1>Welcome to Zhimin Drink Shop!</h1>

      <div>
        <h2>Featured Drinks:</h2>
        <ul>
          {drinks.map((drink) => (
            <li key={drink.id}>
              <img src={drink.image} alt={drink.name} width="50" height="50" />
              {drink.name} - ${drink.price}
            </li>
          ))}
        </ul>
      </div>

      <div>
        {!isAuthenticated ? (
          <button className="btn-primary" onClick={loginWithRedirect}>
            Login
          </button>
        ) : (
          <button className="btn-primary" onClick={() => navigate("/app")}>
            Enter App
          </button>
        )}
      </div>
      <div>
        <button className="btn-secondary" onClick={signUp}>
          Create Account
        </button>
      </div>

      <div>
        <button className="btn-secondary" onClick={order}>
          Order
        </button>
      </div>

    </div>
  );
};

