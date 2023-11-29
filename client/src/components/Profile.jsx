import { useAuth0 } from "@auth0/auth0-react";

export default function Profile() {
  const { user } = useAuth0();

  return (
    <div>
      <div>
        <p>FirstName: {user.firstName}</p>
        <p>LastName: {user.lastName}</p>
      </div>
      <div>
        <p>Address: {user.address}</p>
      </div>
      <div>
        <p>Email: {user.email}</p>
      </div>
      <div>
        <p>Auth0Id: {user.sub}</p>
      </div>
      <div>
        <p>Email verified: {user.email_verified?.toString()}</p>
      </div>
    </div>
  );
}
