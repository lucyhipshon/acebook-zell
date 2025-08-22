import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { FeedPage } from "./pages/Feed/FeedPage";
import { CreatePostPage } from "./pages/CreatePost/CreatePostPage"
import ProfilePage from "./pages/Profile/ProfilePage"
import { SearchPosts } from "./components/SearchPosts";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";
import { AboutPage } from "./pages/About/AboutPage";


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
    path: "/quacks",
    element: <FeedPage />,
  },
  {
    path: "/createquack",
    element: <CreatePostPage />
  },
  {
    path: "/profile",
    element: <ProfilePage />
  },
  {
    path: "/search",
    element: <SearchPosts />
  },
  {
    path: "*",
    element: <NotFoundPage/>
  },
  {
    path: "/about",
    element: <AboutPage/>
  },
]);

function App() {
  return (
    <div style={{width: "100vw"}}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
