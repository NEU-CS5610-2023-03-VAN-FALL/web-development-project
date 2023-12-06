import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "../components/Profile";
import { useAuth0 } from "@auth0/auth0-react";

jest.mock("@auth0/auth0-react");

describe("Profile Component Tests", () => {
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
  });

  test("displays user information correctly", () => {
    render(<Profile />);

    expect(screen.getByText(`Name: ${mockUser.name}`)).toBeInTheDocument();

    expect(screen.getByText(`Email: ${mockUser.email}`)).toBeInTheDocument();
    expect(screen.getByText(`Address: ${mockUser.address}`)).toBeInTheDocument();
    

    expect(screen.getByText(`Auth0Id: ${mockUser.sub}`)).toBeInTheDocument();

    expect(
      screen.getByText(
        `Email verified: ${mockUser.email_verified.toString()}`
      )
    ).toBeInTheDocument();
  });
});
