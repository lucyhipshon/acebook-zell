import createFetchMock from "vitest-fetch-mock";
import { describe, expect, vi } from "vitest";

import { getPosts } from "../../src/services/posts";
import { createPost } from "../../src/services/posts";
import { getPostById } from "../../src/services/posts";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Mock fetch function
createFetchMock(vi).enableMocks();

describe("posts service", () => {
  describe("getPosts", () => {
    test("includes a token with its request", async () => {
      fetch.mockResponseOnce(JSON.stringify({ posts: [], token: "newToken" }), {
        status: 200,
      });

      await getPosts("testToken");

      // This is an array of the arguments that were last passed to fetch
      const fetchArguments = fetch.mock.lastCall;
      const url = fetchArguments[0];
      const options = fetchArguments[1];

      expect(url).toEqual(`${BACKEND_URL}/posts`);
      expect(options.method).toEqual("GET");
      expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    });

    test("rejects with an error if the status is not 200", async () => {
      fetch.mockResponseOnce(
        JSON.stringify({ message: "Something went wrong" }),
        { status: 400 }
      );

      try {
        await getPosts("testToken");
      } catch (err) {
        expect(err.message).toEqual("Unable to fetch posts");
      }
    });
  });
});

describe("createPost", () => {
  test("includes a token with it's request", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: "Post created", token: "newToken" }),
      { status: 201 }
    );

    await createPost("testToken", { message: "hello world" });

    // This is an array of the arguments that were last passed to fetch
    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/posts`);
    expect(options.method).toEqual("POST");
    expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    expect(options.headers["Content-Type"]).toEqual("application/json"); // Verifies the HTTP request sets the correct content type for JSON data
    expect(options.body).toEqual(JSON.stringify({ message: "hello world" }));
  });
  test("sends image data when provided", async () => {
    const imageData =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==";

    fetch.mockResponseOnce(
      JSON.stringify({ message: "Post created", token: "newToken" }),
      { status: 201 }
    );

    await createPost("testToken", {
      message: "hello world",
      image: imageData,
    });

    const fetchArguments = fetch.mock.lastCall;
    const options = fetchArguments[1];
    const sentData = JSON.parse(options.body);

    expect(sentData.message).toEqual("hello world");
    expect(sentData.image).toEqual(imageData);
  });

  test("works without image data", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ message: "Post created", token: "newToken" }),
      { status: 201 }
    );

    await createPost("testToken", { message: "hello world" });

    const fetchArguments = fetch.mock.lastCall;
    const options = fetchArguments[1];
    const sentData = JSON.parse(options.body);

    expect(sentData.message).toEqual("hello world");
    expect(sentData.image).toBeUndefined();
  });
});

describe("getPostById", () => {
  test("includes a token with its request", async () => {
    fetch.mockResponseOnce(
      JSON.stringify({ post: { _id: "abc123", message: "Hello" }, token: "newToken" }),
      { status: 200 }
    );

    await getPostById("testToken", "abc123");

    const fetchArguments = fetch.mock.lastCall;
    const url = fetchArguments[0];
    const options = fetchArguments[1];

    expect(url).toEqual(`${BACKEND_URL}/posts/abc123`);
    expect(options.method).toEqual("GET");
    expect(options.headers["Authorization"]).toEqual("Bearer testToken");
    expect(options.headers["Content-type"]).toEqual("application/json")
  });

  test("rejects with an error if the status is not 200", async () => {
    fetch.mockResponseOnce(JSON.stringify({ message: "Invalid post id" }), { status: 400 });

    try {
      await getPostById("testToken", "bad-id");
    } catch (err) {
      expect(err.message).toEqual("Unable to fetch post");
    }
  });
});

