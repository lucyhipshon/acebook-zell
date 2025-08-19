import { render, screen } from "@testing-library/react";

import Post from "../../src/components/Post";

describe("Post", () => {
  test("displays the message as an article", () => {
    const testPost = {
      _id: "123",
      message: "test message",
      author: {email: "test@example.com"},
      createdAt: new Date().toISOString()
    };

    render(<Post post={testPost} />);

    const article = screen.getByRole("article");
    expect(article.textContent).toContain("test message");
    expect(article.textContent).toContain("test@example.com");
    expect(article.textContent).toContain("just now");  
  });
});