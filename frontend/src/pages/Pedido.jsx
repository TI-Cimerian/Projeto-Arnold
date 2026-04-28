import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useParams, NavLink } from "react-router-dom";
import api from "../../api/api";

function Pedido() {
  const [abaAtiva, setAbaAtiva] = useState("cliente");
  const [pedido, setPedido] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [maquinas, setMaquinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusPedido, setStatusPedido] = useState("");
  const [atualizandoStatus, setAtualizandoStatus] = useState(false);

  const { id } = useParams();
  const pedidoRef = useRef(null);

  const optionsStatus = ["Aberto", "Termo", "Vendido"];

  const formatCurrency = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const formatCPF = (cpf) => {
    if (!cpf) return "";

    if (cliente?.pais !== "Brasil") {
      return cpf;
    }

    return cpf
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  const formatTelefone = (telefone) => {
    if (!telefone) return "";

    if (cliente?.pais !== "Brasil") {
      return telefone;
    }

    return telefone
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  };

  useEffect(() => {
    const fetchPedidoDetalhes = async () => {
      try {
        setLoading(true);

        const response = await api.get(`pedidos/${id}`);

        setPedido(response.data.pedido);
        setStatusPedido(response.data.pedido.status || "");
        setCliente(response.data.cliente);
        setMaquinas(response.data.maquinas || []);
      } catch (err) {
        console.error("Erro ao buscar detalhes do pedido:", err);
        setError("Não foi possível carregar os detalhes do pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidoDetalhes();
  }, [id]);

  useEffect(() => {
    pedidoRef.current = pedido;
  }, [pedido]);

  const atualizarStatusPedido = async () => {
    if (!statusPedido) {
      toast.warning("Selecione um status");
      return;
    }

    try {
      setAtualizandoStatus(true);

      const response = await api.patch(`/pedidos/${id}/status`, {
        status: statusPedido,
      });

      setPedido((prev) => ({
        ...prev,
        status: response.data.pedido.status,
      }));

      toast.success("Status atualizado com sucesso");
    } catch (error) {
      toast.error(
        error?.response?.data?.error || "Erro ao atualizar status do pedido",
      );
    } finally {
      setAtualizandoStatus(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto mt-12 w-full max-w-7xl px-4 py-6">
        <p className="text-sm text-slate-500">Carregando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto mt-12 w-full max-w-7xl px-4 py-6">
        <p className="text-sm font-semibold text-red-600">{error}</p>
      </main>
    );
  }

  if (!pedido) {
    return (
      <main className="mx-auto mt-12 w-full max-w-7xl px-4 py-6">
        <p className="text-sm text-slate-500">Pedido não encontrado.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto mt-12 w-full max-w-7xl px-4 py-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Detalhes do orçamento #{pedido.id}
          </h1>

          <p className="text-sm text-slate-500">
            Registro de propostas geradas durante o Arnold
          </p>

          <NavLink to="imprimir" target="_blank">
            <button className="mt-3 rounded-lg border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300">
              Imprimir
            </button>
          </NavLink>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setAbaAtiva("cliente")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              abaAtiva === "cliente"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Detalhes do cliente
          </button>

          <button
            onClick={() => setAbaAtiva("pagamento")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              abaAtiva === "pagamento"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Pedido
          </button>

          <button
            onClick={() => setAbaAtiva("maquinas")}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              abaAtiva === "maquinas"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Máquinas
          </button>
        </div>

        {abaAtiva === "cliente" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Detalhes do cliente
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Nome
                </p>
                <p className="text-sm text-slate-800">{cliente?.nome}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  CPF
                </p>
                <p className="text-sm text-slate-800">
                  {formatCPF(cliente?.cpf)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  E-mail
                </p>
                <p className="text-sm text-slate-800">{cliente?.email}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Telefone
                </p>
                <p className="text-sm text-slate-800">
                  {formatTelefone(cliente?.telefone)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Empresa
                </p>
                <p className="text-sm text-slate-800">
                  {cliente?.razao_social}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Endereço
                </p>
                <p className="text-sm text-slate-800">
                  {cliente?.rua}, {cliente?.numero}, {cliente?.bairro} -{" "}
                  {cliente?.cidade}/{cliente?.estado}, {cliente?.pais}
                </p>
              </div>
            </div>
          </section>
        )}

        {abaAtiva === "pagamento" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Detalhes do pedido
            </h2>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-end">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase text-slate-500">
                    Status do pedido
                  </p>

                  <select
                    value={statusPedido}
                    onChange={(e) => setStatusPedido(e.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none ring-brand/20 transition focus:ring-2"
                  >
                    <option value="">Selecione o status</option>

                    {optionsStatus.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={atualizarStatusPedido}
                  disabled={atualizandoStatus || statusPedido === pedido.status}
                  className="h-10 rounded-xl bg-black px-4 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {atualizandoStatus ? "Salvando..." : "Atualizar status"}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                Status atual:{" "}
                <span className="font-semibold text-slate-700">
                  {pedido.status || "Não informado"}
                </span>
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Valor bruto
                </p>
                <p className="text-sm text-slate-800">
                  {formatCurrency(pedido.valor_bruto)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Forma de pagamento
                </p>
                <p className="text-sm text-slate-800">
                  {pedido.tipo_pagamento}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Parcelas
                </p>
                <p className="text-sm text-slate-800">
                  {pedido.num_parcelas}x de{" "}
                  {formatCurrency(pedido.valor_parcelas)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Desconto
                </p>
                <p className="text-sm text-slate-800">{pedido.desconto}%</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Valor de desconto
                </p>
                <p className="text-sm text-slate-800">
                  {formatCurrency(
                    pedido.valor_liquido * (pedido.desconto / 100),
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Entrada
                </p>
                <p className="text-sm text-slate-800">{pedido.entrada}%</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Valor de entrada
                </p>
                <p className="text-sm text-slate-800">
                  {formatCurrency(
                    pedido.valor_liquido * (pedido.entrada / 100),
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Acréscimo
                </p>
                <p className="text-sm text-slate-800">{pedido.acrescimo}%</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Vendedor
                </p>
                <p className="text-sm text-slate-800">{pedido.vendedor}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Observação
                </p>
                <p className="text-sm text-slate-800">{pedido.observacao}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Valor total
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {formatCurrency(pedido.valor_liquido)}
                </p>
              </div>
            </div>
          </section>
        )}

        {abaAtiva === "maquinas" && (
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold text-slate-900">Máquinas</h2>

              <span className="text-sm font-semibold text-slate-500">
                {maquinas.length} item{maquinas.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead className="bg-slate-50 text-xs uppercase tracking-[0.08em] text-slate-600">
                  <tr>
                    <th className="px-4 py-3 text-center">Código</th>
                    <th className="px-4 py-3 text-center">Descrição</th>
                    <th className="px-4 py-3 text-center">Valor unitário</th>
                    <th className="px-4 py-3 text-center">Quantidade</th>
                    <th className="px-4 py-3 text-center">Subtotal</th>
                  </tr>
                </thead>

                <tbody>
                  {maquinas.map((item) => (
                    <tr key={item.id} className="border-t border-slate-200">
                      <td className="px-4 py-4 text-center">{item.id}</td>

                      <td className="px-4 py-4 text-center">{item.nome}</td>

                      <td className="px-4 py-4 text-center">
                        {formatCurrency(item.valor_unitario)}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {item.quantidade}
                      </td>

                      <td className="px-4 py-4 text-center font-medium">
                        {formatCurrency(item.valor_unitario * item.quantidade)}
                      </td>
                    </tr>
                  ))}

                  <tr className="border-t border-slate-300 bg-slate-50">
                    <td colSpan="4" className="px-4 py-4 text-right font-bold">
                      Total
                    </td>

                    <td className="px-4 py-4 text-center font-bold text-slate-900">
                      {formatCurrency(pedido.valor_bruto)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

export default Pedido;
