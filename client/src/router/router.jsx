import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginRequired from "../pages/LoginRequired";
import RequireAuth from "../auth/RequireAuth";
import PrescriptionOrdersReportPage from "../pages/PrescriptionOrdersReportPage";
import UnitDoseOrdersReportPage from "../pages/UnitDoseOrdersReportPage";

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
      path: "/PrescriptionOrdersReport",
      element: (
        <RequireAuth>
          <PrescriptionOrdersReportPage />
        </RequireAuth>
      ),
    },
    {
      path: "/UnitDoseReport",
      element: (
        <RequireAuth>
          <UnitDoseOrdersReportPage />
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
