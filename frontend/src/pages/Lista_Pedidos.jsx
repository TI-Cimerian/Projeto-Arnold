import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";

function Lista_Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [valorTotalFiltrado, setValorTotalFiltrado] = useState(0);
  const [limit, setLimit] = useState(10);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendedor, setVendedor] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);

        const response = await api.get("pedidos", {
          params: {
            page: currentPage,
            limit,
            searchTerm,
            vendedor,
            status,
          },
        });

        const total = Number(response.data.totalPedidos) || 0;
        const calculatedTotalPages = Math.max(1, Math.ceil(total / limit));

        setPedidos(response.data.pedidos || []);
        setTotalPedidos(total);
        setValorTotalFiltrado(Number(response.data.valorTotalFiltrado) || 0);
        setTotalPages(calculatedTotalPages);

        const arrayPages = [];
        for (let i = 1; i <= calculatedTotalPages; i++) {
          arrayPages.push(i);
        }

        setPages(arrayPages);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, [currentPage, limit, searchTerm, vendedor, status]);

  return (
    <main className="mx-auto mt-12 w-full max-w-7xl flex-1 px-4 py-6 space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
          Arnold
        </p>
        <h1 className="text-2xl font-bold">Propostas geradas</h1>
        <p className="text-sm text-slate-600">Controle de pedidos</p>
      </div>

      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Valor total filtrado
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {valorTotalFiltrado.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total de pedidos
              </p>

              <p className="mt-1 text-2xl font-bold text-slate-900">
                {totalPedidos}
              </p>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 gap-3 text-sm md:grid-cols-4">
            <div className="md:col-span-1">
              <label className="text-xs text-slate-500">
                Buscar por número do pedido:
              </label>

              <input
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                type="text"
                placeholder="Digite o número do pedido"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div>
              <label className="text-xs text-slate-500">Vendedor</label>

              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                value={vendedor}
                onChange={(e) => {
                  setVendedor(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Todos</option>
                <option value="Benedito Salles">Benedito Salles</option>
                <option value="Jhonatan Barbosa">Jhonatan Barbosa</option>
                <option value="João Henrique">João Henrique</option>
                <option value="Dayane Geocondo">Dayane Geocondo</option>
                <option value="Murilo Mansano">Murilo Mansano</option>
                <option value="Fábio Furtado">Fábio Furtado</option>
                <option value="Gabriel Wesley">Gabriel Wesley</option>
                <option value="Vitor Hugo da Rocha">Vitor Hugo da Rocha</option>
                <option value="Fernando Nascimento">Fernando Nascimento</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">Status</label>

              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="">Todos</option>
                <option value="Aberto">Aberto</option>
                <option value="Termo">Termo</option>
                <option value="Vendido">Vendido</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500">Itens por página</label>

              <select
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>

          <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200">
            {loading ? (
              <div className="py-8 text-center text-sm text-slate-400">
                Carregando pedidos...
              </div>
            ) : (
              <table className="min-w-full text-left text-xs text-slate-700">
                <thead className="border-b border-slate-200 bg-slate-50 uppercase tracking-[0.1em] text-slate-600">
                  <tr>
                    <th className="px-3 py-2">Número do Pedido</th>
                    <th className="px-3 py-2">Cliente</th>
                    <th className="px-3 py-2">Valor total</th>
                    <th className="px-3 py-2">Pagamento</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Vendedor</th>
                  </tr>
                </thead>

                <tbody>
                  {pedidos.length > 0 ? (
                    pedidos.map((pedido) => (
                      <tr
                        key={pedido.id}
                        className="bg-white hover:bg-slate-50"
                      >
                        <td className="px-3 py-3">
                          <Link to={`/pedidos/${pedido.id}`}>
                            <div className="font-bold text-slate-900">
                              {pedido.id}
                            </div>
                          </Link>
                        </td>

                        <td className="px-3 py-3">{pedido.nome}</td>

                        <td className="px-3 py-3">
                          {Number(pedido.valor_liquido_total).toLocaleString(
                            "pt-BR",
                            {
                              style: "currency",
                              currency: "BRL",
                            },
                          )}
                        </td>

                        <td className="px-3 py-3">{pedido.tipo_pagamento}</td>

                        <td className="px-3 py-3">
                          <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                            {pedido.status || "Sem status"}
                          </span>
                        </td>

                        <td className="px-3 py-3">{pedido.vendedor}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="py-8 text-center text-slate-400"
                      >
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Página {currentPage} de {totalPages} páginas
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Anterior
              </button>

              <button
                type="button"
                disabled={currentPage === totalPages || totalPedidos === 0}
                className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Próximo
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Lista_Pedidos;
