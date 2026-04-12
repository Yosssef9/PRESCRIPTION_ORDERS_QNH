import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import router from "./router/router";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <AuthProvider>
       <Toaster position="top-right" />
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
