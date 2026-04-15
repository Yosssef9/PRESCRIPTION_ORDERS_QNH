import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginRequired from "../pages/LoginRequired";
import RequireAuth from "../auth/RequireAuth";
import PrescriptionOrdersReportPage from "../pages/PrescriptionOrdersReportPage";

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
      path: "/report", // 👈 ADD THIS ROUTE
      element: (
        <RequireAuth>
          <PrescriptionOrdersReportPage />
        </RequireAuth>
      ),
    },
    {
      path: "/login-required",
      element: <LoginRequired />,
    },
  ],
  {
    basename: "/prescription-orders",
  },
);

export default router;
