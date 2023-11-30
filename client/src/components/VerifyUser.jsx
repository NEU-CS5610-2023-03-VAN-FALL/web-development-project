import "../style/appLayout.css";

import { useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useNavigate } from "react-router-dom";

export default function VerifyUser() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function verifyUser() {
      try {
        const data = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (data.ok) {
          const user = await data.json();
          if (user.auth0Id) {
            navigate("/app");
          }
        } else {
          console.error("Error verifying user:", data.statusText);
          // Handle the error (e.g., show an error message)
        }
      } catch (error) {
        console.error("Error during verification:", error);
        // Handle the error (e.g., show an error message)
      }
    }
  
    if (accessToken) {
      verifyUser();
    }
  }, [accessToken, navigate]);
  

  return (
    <>
      {accessToken ? (
        <div className="loading">Verifying user...</div>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </>
  );
  
}
