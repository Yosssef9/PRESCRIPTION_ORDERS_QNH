import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginRequired from "../pages/LoginRequired";
import RequireAuth from "../auth/RequireAuth";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: (
        <RequireAuth>
          <HomePage />
        </RequireAuth>
      ),
    },
    {
      path: "/login-required",
      element: <LoginRequired />,
    },
  ],
  {
    basename: "/PRESCRIPTION-ORDERS",
  },
);

export default router;
