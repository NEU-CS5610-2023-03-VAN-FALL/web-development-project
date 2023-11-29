
import React from 'react';
import { Link } from 'react-router-dom';

export default function  CartPage({ cartItems, isAuthenticated }) {
  const cartItemCount = Object.values(cartItems).reduce((acc, quantity) => acc + quantity, 0);

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>
      <ul>
        {Object.entries(cartItems).map(([itemId, quantity]) => (
          <li key={itemId}>
            Item ID: {itemId}, Quantity: {quantity}
          </li>
        ))}
      </ul>
      {isAuthenticated ? (
        <Link to="/checkout">Proceed to Checkout</Link>
      ) : (
        <p>
          Please <Link to="/login">log in</Link> to proceed to checkout.
        </p>
      )}
    </div>
  );
};


