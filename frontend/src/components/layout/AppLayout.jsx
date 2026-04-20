import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col ">
      <Header />
      <main className="mx-auto w-full flex-1 px-2 pt-6">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
