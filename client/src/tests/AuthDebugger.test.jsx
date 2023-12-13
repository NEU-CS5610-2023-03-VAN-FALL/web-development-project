import React from "react";
import { render, screen } from "@testing-library/react";
import AuthDebugger from "../components/AuthDebugger";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";

jest.mock("@auth0/auth0-react");
jest.mock("../AuthTokenContext");

describe("AuthDebugger Component Tests", () => {
  const mockUser = {
    name: "John Doe",
    email: "johndoe@example.com",
    address: "201-11st",
    sub: "auth0|123456",
    email_verified: true,
  };

  beforeEach(() => {
    useAuth0.mockReturnValue({
      user: mockUser,
    });

    useAuthToken.mockReturnValue({
      accessToken: "mockAccessToken",
    });
  });

  test("renders AuthDebugger component with mock data", () => {
    render(<AuthDebugger />);

    expect(screen.getByText('Access Token:')).toBeInTheDocument();
    expect(screen.getByText('User Info:')).toBeInTheDocument();
    expect(screen.getByText(/mockAccessToken/i)).toBeInTheDocument(); 
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument(); 
  });
});
