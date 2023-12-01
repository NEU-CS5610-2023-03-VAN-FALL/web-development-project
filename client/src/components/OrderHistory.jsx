import "../style/orderHistory.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function OrderHistory() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [orderHistory, setOrderHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function getOrderHistory() {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/orders`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setOrderHistory(data);
        } else {
          console.error("Failed to fetch order history");
        }
      } catch (error) {
        console.error("Error fetching order history:", error);
      }
    }

    if (user) {
      getOrderHistory();
    }
  }, [user, getAccessTokenSilently]);

  return (
    <div>
      <h3>Order History</h3>
      <ul className="repositories-list">
        {orderHistory.map((order) => (
          <li
            className="repository-row-li"
            key={order.orderId}
            onClick={() => navigate(`/app/orderHistory/${order.orderId}`)}
          >
            <div className="repository-row">
              <div className="order-details">
                <div className="order-date">{order.orderDate}</div>
                <div className="total-amount">{order.totalAmount}</div>
              </div>
              {/* Add other details as needed */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
