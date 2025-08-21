import { render, screen } from "@testing-library/react";

import Post from "../../src/components/Post";

describe("Post", () => {
  test("displays the message and user's full name", () => {
    const testPost = {
      _id: "123",
      message: "test message",
      author: {
        email: "test@example.com",
        firstName: "John",
        lastName: "Doe",
        profileImage: "/uploads/profile.jpg"  
      },
      createdAt: new Date().toISOString()
    };

    render(<Post post={testPost} />);

    const article = screen.getByRole("article");
    expect(article.textContent).toContain("test message");
    expect(article.textContent).toContain("John Doe");  
    expect(article.textContent).toContain("just now");  
  });

  test("displays firstName only when lastName is missing", () => {
    const testPost = {
      _id: "124",
      message: "test message",
      author: {
        email: "test@example.com",
        firstName: "OnlyFirst",
        profileImage: "/uploads/default.jpg"  

      },
      createdAt: new Date().toISOString()
    };

    render(<Post post={testPost} />);
    const article = screen.getByRole("article");
    expect(article.textContent).toContain("OnlyFirst");
    expect(article.textContent).not.toContain("test@example.com");
  });

  test("displays lastName only when firstName is missing", () => {
    const testPost = {
      _id: "125",
      message: "test message", 
      author: {
        email: "test@example.com",
        lastName: "OnlyLast",
        profileImage: "/uploads/default.jpg"
      },
      createdAt: new Date().toISOString()
    };

    render(<Post post={testPost} />);
    const article = screen.getByRole("article");
    expect(article.textContent).toContain("OnlyLast");
    expect(article.textContent).not.toContain("test@example.com");
  });

  test("falls back to email when names are missing", () => {
    const testPost = {
      _id: "126",
      message: "test message",
      author: {email: "fallback@example.com",
      profileImage: null
    },  
      createdAt: new Date().toISOString()
    };

    render(<Post post={testPost} />);
    const article = screen.getByRole("article");
    expect(article.textContent).toContain("fallback@example.com");
  });

  test("displays 'Unknown' when author is missing", () => {
    const testPost = {
      _id: "127",
      message: "test message", 
      author: null, 
      createdAt: new Date().toISOString()
    };

    render(<Post post={testPost} />);
    const article = screen.getByRole("article");
    expect(article.textContent).toContain("Unknown");
  });

  test("displays 'Unknown' when author is undefined", () => {
    const testPost = {
      _id: "128",
      message: "test message",
      createdAt: new Date().toISOString()
    };

    render(<Post post={testPost} />);
    const article = screen.getByRole("article");
    expect(article.textContent).toContain("Unknown");
  });
});