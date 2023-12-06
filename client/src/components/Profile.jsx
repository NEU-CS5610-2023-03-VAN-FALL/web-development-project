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
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = await response.json();
      setUserData(userData);
      setName(userData.name || "");
      setAddress(userData.address || "");
      setEmail(userData.email || "");
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
    return <div aria-busy="true" aria-live="polite">Loading...</div>;
  }

  return (
    <form>
      <div role="region" aria-label="User Profile Information" className="profile-container">
        <div>
          <label htmlFor="name">Name: </label>
          <input type="text" id="name" value={name} onChange={handleNameChange} />
        </div>
        <div>
          <label htmlFor="address">Address: </label>
          <input type="text" id="address" value={address} onChange={handleAddressChange} />
        </div>
        <div>
          <label htmlFor="email">Email: </label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} />
        </div>
        <div>
          <p>Auth0Id: {user.sub}</p>
        </div>
        <div>
          <p>Email verified: {user.email_verified?.toString()}</p>
        </div>
        <button type="button" onClick={handleUpdateProfile}>Save</button>
      </div>
    </form>
  );
}
