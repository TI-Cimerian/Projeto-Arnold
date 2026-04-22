import CimerianLogo from "../../assets/logo-cimerian.webp";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import ModalCliente from "../common/ModalCliente";

export default function PrintHeader() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <header className=" top-0 z-40 w-full border-b border-white/10 bg-black shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo Container */}
        <img
          src={CimerianLogo}
          alt="Logo"
          className="w-[120px] lg:w-[200px] object-contain"
        />
      </div>
    </header>
  );
}
