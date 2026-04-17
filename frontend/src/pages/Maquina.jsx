import { useEffect } from "react";
import api from "../../api/api";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

function Maquina() {
  const { id } = useParams();
  const [maquina, setMaquina] = useState();
  useEffect(() => {
    const fetchMaquina = async () => {
      try {
        const response = await api.get(`/maquinas/${id}`);

        console.log(response.data);
        setMaquina(response.data);
      } catch (error) {
        toast.error(error?.response?.data?.error);
      }
    };
    fetchMaquina();
  }, [id]);
  return (
    <div className="mt-24 space-y-10 max-w-6xl mx-auto px-4 pb-16">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative overflow-hidden h-96 rounded-3xl border bg-white shadow-sm">
          <img
            src={`/maquinas/${id}.jpg`}
            alt={maquina}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand uppercase">
            {maquina?.categoria}
          </span>
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">
            Detalhes do produto
          </p>
          <h1 className="font-display text-3xl font-bold text-gray-900 uppercase">
            {maquina?.nome}
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
            {maquina?.categoria} • {maquina?.sub_categoria}
          </p>

          <p className="text-sm text-gray-600">{maquina?.descricao}</p>
          <div className="flex flex-col space-y-2">
            <p className="font-display text-[1.4rem] uppercase font-bold">
              Cores
            </p>
            <div className="flex flex-row space-x-4">
              <div className="w-6 h-6 bg-black rounded-full border-black cursor-pointer"></div>
              <div className="w-6 h-6 bg-gray-300 rounded-full border-black cursor-pointer"></div>
              <div className="w-6 h-6 bg-yellow-300 rounded-full border-black cursor-pointer"></div>
              <div className="w-6 h-6 bg-red-700 rounded-full border-black cursor-pointer"></div>
              <div className="w-6 h-6 bg-orange-500 rounded-full border-black cursor-pointer"></div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/"
              className="rounded-full border border-gray-200 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-700 hover:border-brand/40 hover:text-brand"
            >
              Voltar ao catálogo
            </Link>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-1  space-x-0 md:space-x-3 space-y-5 md:space-y-0 ">
        <section className="space-y-4">
          <div className="rounded-3xl border bg-white p-6 shadow-sm space-y-6 h-[450px]">
            <h2 className="text-lg font-semibold text-gray-900">
              Expecificações
            </h2>
            <ul className="flex flex-col w-full space-y-8">
              <li className="flex flex-row items-center justify-between py-4 border-b border-gray-200 last:border-0">
                <p className="text-sm md:text-lg font-medium text-gray-700">
                  {" "}
                  Comprimento
                </p>
                <p className="text-md text-gray-600">
                  {Number(maquina?.comprimento).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  m
                </p>
              </li>
              <li className="flex flex-row items-center justify-between py-4 border-b border-gray-200 last:border-0">
                {" "}
                <p className="text-sm md:text-lg font-medium text-gray-700">
                  {" "}
                  Largura
                </p>
                <p className="text-md text-gray-600">
                  {Number(maquina?.largura).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  m
                </p>
              </li>
              <li className="flex flex-row items-center justify-between py-4 border-b border-gray-200 last:border-0">
                {" "}
                <p className="text-sm md:text-lg font-medium text-gray-700">
                  {" "}
                  Altura
                </p>
                <p className="text-md text-gray-600">
                  {Number(maquina?.altura).toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  m
                </p>
              </li>
              <li className="flex flex-row items-center justify-between py-4 border-b border-gray-200 last:border-0">
                {" "}
                <p className="text-sm md:text-lg font-medium text-gray-700">
                  {" "}
                  Peso
                </p>
                <p className="text-md text-gray-600">
                  {Number(maquina?.peso).toLocaleString("pt-BR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}{" "}
                  kg
                </p>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
export default Maquina;
