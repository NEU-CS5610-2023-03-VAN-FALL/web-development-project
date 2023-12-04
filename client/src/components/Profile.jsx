import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "../style/profile.css";

export default function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        setUserData(userData);
        setName(userData.name || "");
        setAddress(userData.address || "");
        setEmail(userData.email || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [getAccessTokenSilently, user.sub]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleUpdateProfile = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.sub}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, address, email }),
      });

      if (response.ok) {
        console.log("Profile updated successfully");
      } else {
        console.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div>
        <label>Name: </label>
        <input type="text" value={name} onChange={handleNameChange} />
      </div>
      <div>
        <label>Address: </label>
        <input type="text" value={address} onChange={handleAddressChange} />
      </div>
      <div>
        <label>Email: </label>
        <input type="email" value={email} onChange={handleEmailChange} />
      </div>
      <div>
        <p>Auth0Id: {user.sub}</p>
      </div>
      <div>
        <p>Email verified: {user.email_verified?.toString()}</p>
      </div>
      <button onClick={handleUpdateProfile}>Save</button>
    </div>
  );
}
