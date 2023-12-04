import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "../style/orderNow.css";

export default function Order() {
  const { user, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [drinks, setDrinks] = useState([]);
  const [cart, setCart] = useState([]);

  const addToCart = (productId) => {
    const selectedDrink = drinks.find((drink) => drink.productId === productId);
    setCart([...cart, selectedDrink]);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((drink) => drink.productId !== productId);
    setCart(updatedCart);
  };

  const calculateTotalAmount = () => {
    return cart.reduce((total, drink) => total + drink.price, 0);
  };

  const handleCheckOut = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          totalAmount: calculateTotalAmount(),
          products: cart.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            description: item.description,
            price: item.price,
            imageUrl: item.imageUrl,
          })),
        }),
      });

      if (response.ok) {
        
        setCart([]);
      } else {
        console.error("Error during checkout. Server response:", response.statusText);
      }
    } catch (error) {
      console.error("Error during checkout", error);
    }
  };

  useEffect(() => {
    const fetchDrinks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products`);
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

  return (
    <div className="drinks-container">
      <ul className="drinks-list">
        {drinks.map((drink) => (
          <li key={drink.productId}>
            <img
              src={drink.imageUrl}
              alt={drink.productName}
              width="150"
              height="150"
              onClick={() => alert(`Product ID: ${drink.productId}\nProduct Name: ${drink.productName}\nDescription: ${drink.description}\nPrice: ${drink.price}`)}
            />
            <h3>{drink.productName}</h3>
            <p>${drink.price}</p>
            <button onClick={() => addToCart(drink.productId)}>+</button>
            <button onClick={() => removeFromCart(drink.productId)}>-</button>
          </li>
        ))}
      </ul>

      <div>
        <h2>Shopping Cart</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.productId}>{item.productName} </li>
          ))}
        </ul>
        <p>Total Amount: ${calculateTotalAmount()}</p>
        <button onClick={handleCheckOut}>Checkout</button>
      </div>
    </div>
  );
}
