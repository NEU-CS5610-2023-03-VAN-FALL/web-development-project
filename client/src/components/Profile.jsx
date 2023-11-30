import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const {user, getAccessTokenSilently } = useAuth0();
  const [name, setName] = useState(user.name);
  const [address, setAddress] = useState(user.address);
  const [email, setEmail] = useState(user.email);
  
  useEffect(() => {
    setName(user.name);
    setAddress(user.address);
    setEmail(user.email);
  }, [user.name, user.address, user.email]);

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

  return (
    <div>
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
