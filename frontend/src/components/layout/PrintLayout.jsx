import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ToastContainer, toast } from "react-toastify";
import PrintHeader from "./PrintHeader";

export function PrintLayout() {
  return (
    <div className="flex min-h-screen flex-col ">
      <PrintHeader />
      <main className="mx-auto w-full flex-1 px-2">
        <Outlet />
      </main>
    </div>
  );
}
