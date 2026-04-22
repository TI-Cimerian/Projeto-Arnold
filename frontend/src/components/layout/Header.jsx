import CimerianLogo from "../../assets/logo-cimerian.webp";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import ModalCliente from "../common/ModalCliente";

export default function Header() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <header className=" top-0 z-40 w-full border-b border-white/10 bg-black shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        {/* Logo Container */}
        <NavLink to="/" className="flex items-center">
          <img
            src={CimerianLogo}
            alt="Logo"
            className="w-[120px] lg:w-[200px] object-contain"
          />
        </NavLink>

        {/* Navigation and Actions */}
        <div className="flex items-center gap-4 lg:gap-8">
          <NavLink
            to="/pedidos"
            className="text-sm font-semibold text-white hover:text-gray-300 transition-colors"
          >
            Pedidos
          </NavLink>

          <button
            onClick={() => setModalOpen(true)}
            className="whitespace-nowrap rounded-full border border-white/40 px-4 py-2 text-[10px] lg:text-xs uppercase font-bold text-white backdrop-blur hover:bg-white hover:text-black hover:border-white transition-all"
          >
            Cadastrar cliente
          </button>
        </div>
      </div>

      <ModalCliente show={isModalOpen} onClose={() => setModalOpen(false)} />
    </header>
  );
}
