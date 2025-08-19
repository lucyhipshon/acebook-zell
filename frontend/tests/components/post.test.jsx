import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Post from "../../src/components/Post";

describe("Post", () => {
  test("displays the message as a card", () => {
    const testPost = {
      _id: "123",
      message: "test message",
      author: { email: "test@example.com" },
      createdAt: new Date().toISOString(),
    };

    render(
      <MemoryRouter> 
        <Post post={testPost} />
      </MemoryRouter>
    );

    const cardElement = screen.getByText("test message").closest(".card");
    expect(cardElement).toBeInTheDocument();
    expect(cardElement).toHaveTextContent("test message");
    expect(cardElement).toHaveTextContent("test@example.com");
    expect(cardElement).toHaveTextContent("just now");
  });
});