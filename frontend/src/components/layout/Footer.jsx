import CimerianLogo from '../../assets/logo-cimerian.webp'

export default function Footer() {
  return (
    <footer className="border-t bg-[#101010] ">
      <div className="mx-auto grid grid-cols-4 max-w-6xl px-4 py-6 text-xs text-gray-500 items-center">
        <div>
          <img src={CimerianLogo} alt="Cimerian logo" width={240} />
          <p className="text-white mt-4">
            R. Adhemar Pereira de Barros, 1500 – Sala 1201 – Bela Suiça,
            Londrina – PR, 86050-190
          </p>
        </div>
      </div>
    </footer>
  )
}
