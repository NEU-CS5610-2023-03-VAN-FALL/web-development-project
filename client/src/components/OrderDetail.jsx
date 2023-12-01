import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; 
import "../style/orderDetail.css";

export default function OrderDetail() {
    const { user, getAccessTokenSilently } = useAuth0();
    const [orderDetails, setOrderDetails] = useState({});
    const params = useParams();
  
    useEffect(() => {
      async function getOrderDetails() {
        try {
          const accessToken = await getAccessTokenSilently();
          const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/${params.orderId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            setOrderDetails(data);
          } else {
            console.error(`Failed to fetch order details. Status: ${response.status}`);
          }
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      }
  
      if (params.orderId && user) {
        getOrderDetails();
      }
    }, [user, params]);
  
    return (
      <div className="orderDetail">
        <Link to="/app/orderHistory"> ⬅️ Back to Order History</Link>
        <h2>Order Details</h2>
        <div>
          <p>Order ID: {orderDetails.orderId}</p>
        </div>
        <div>
          <p>Order Date: {orderDetails.orderDate}</p>
        </div>
        <div>
          <p>Total Amount: {orderDetails.totalAmount}</p>
        </div>
        
        <div className="drinks-container">
          <ul className="drinks-list">
            {orderDetails.products && orderDetails.products.length > 0 ? (
              orderDetails.products.map((drink) => (
                <li key={drink.id}>
                  <img
                    src={drink.imageUrl}
                    alt={drink.productName}
                    width="150"
                    height="150"
                  />
                  <p> ProductName : {drink.productName}</p>
                  <p> Description : {drink.description}</p>
                  <p> Price       : ${drink.price}</p>
                </li>
              ))
            ) : (
              <p>No products in this order.</p>
            )}
          </ul>
        </div>
      </div>
    );
  }
  