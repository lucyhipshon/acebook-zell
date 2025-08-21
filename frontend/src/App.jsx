import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { CreatePostPage } from "./pages/CreatePost/CreatePostPage"
import ProfilePage from "./pages/Profile/ProfilePage"
import { SearchPosts } from "./components/SearchPosts";


// docs: https://reactrouter.com/en/main/start/overview
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
  {
    path: "/posts",
    element: <FeedPage />,
  },
  {
    path: "/createpost",
    element: <CreatePostPage />
  },
  {
    path: "/profile",
    element: <ProfilePage />
  },
  {
    path: "/search",
    element: <SearchPosts />
  }
]);

function App() {
  return (
    <div style={{width: "100vw"}}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
