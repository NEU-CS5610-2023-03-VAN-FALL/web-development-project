// Cart.jsx
import React, { useState } from 'react';

const Cart = () => {
  const [selectedItems, setSelectedItems] = useState([]); // State to store selected items

  // Function to add an item to the cart
  const addItemToCart = (item) => {
    setSelectedItems((prevItems) => [...prevItems, item]);
  };

  // Function to place an order (you can implement database logic here)
  const placeOrder = () => {
    // Implement logic to store selected items in the database
    console.log('Placing order with items:', selectedItems);
    // You can add further logic to clear the cart or navigate to a thank you page, etc.
  };

  return (
    <div>
      <h2>Your Cart</h2>
      <ul>
        {selectedItems.map((item) => (
          <li key={item.id}>
            {item.name} - ${item.price}
          </li>
        ))}
      </ul>
      <button onClick={placeOrder}>Place Order</button>
    </div>
  );
};

export default Cart;
