import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { signup } from "../../src/services/authentication";
import { SignupPage } from "../../src/pages/Signup/SignupPage";

// Mock react-slick carousel
vi.mock("react-slick", () => ({
  __esModule: true,
  default: React.forwardRef((props, ref) => {
    if (ref) {
      ref.current = { slickGoTo: vi.fn() };
    }
    return <div>{props.children}</div>;
  }),
}));

vi.mock("slick-carousel/slick/slick.css", () => ({}));
vi.mock("slick-carousel/slick/slick-theme.css", () => ({}));

// Mock React Router
const mockNavigate = vi.fn();

vi.mock("react-router-dom", () => ({
  ...vi.importActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

// Mock authentication service
vi.mock("../../src/services/authentication", () => ({
  signup: vi.fn(),
}));

async function completeSignupForm() {
  const user = userEvent.setup();

  // Find and fill out the inputs using their specific placeholder text
  await user.type(screen.getByPlaceholderText("First Name"), "Ross");
  await user.type(screen.getByPlaceholderText("Last Name"), "Smith");
  await user.type(screen.getByPlaceholderText("Email"), "test@email.com");
  await user.type(screen.getByPlaceholderText("Password"), "password1234");
  await user.type(screen.getByPlaceholderText("Confirm Password"), "password1234");
  
  // Submit the form
  await user.click(screen.getByRole("button", { name: /submit/i }));
}

describe("Signup Page", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test("renders signup form", () => {
    render(<SignupPage />);
    
    expect(screen.getByText("Create a new quack account")).toBeTruthy();
    expect(screen.getAllByPlaceholderText("First Name")[0]).toBeTruthy();
    expect(screen.getAllByPlaceholderText("Last Name")[0]).toBeTruthy();
    expect(screen.getAllByPlaceholderText("Email")[0]).toBeTruthy();
    expect(screen.getAllByPlaceholderText("Password")[0]).toBeTruthy();
    expect(screen.getByRole("button", { name: /submit/i })).toBeTruthy();
  });

  test("submits form with valid data", async () => {
    render(<SignupPage />);
    await completeSignupForm();
    expect(signup).toHaveBeenCalledWith(
      "test@email.com",
      "password1234",
      "Ross",
      "Smith",
      "",
      "",
      "",
      "",
      "",
      "",
      null
    );
  });

  test("navigates to login on success", async () => {
    render(<SignupPage />);
    await completeSignupForm();
    expect(mockNavigate).toHaveBeenCalledWith("/profile"); //changed here
  });

  test("navigates back to signup on failure", async () => {
    signup.mockRejectedValue(new Error("Signup failed"));
    render(<SignupPage />);
    await completeSignupForm();
    expect(mockNavigate).toHaveBeenCalledWith("/signup");
  });
});