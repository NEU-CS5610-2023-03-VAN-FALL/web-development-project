import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import "../style/authDebugger.css";

export default function AuthDebugger() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();

  return (
    <div className="container">
      <div className="section">
        <h3>Access Token:</h3>
        <pre>{JSON.stringify(accessToken, null, 2)}</pre>
      </div>

      <div className="section">
        <h3>User Info:</h3>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}
