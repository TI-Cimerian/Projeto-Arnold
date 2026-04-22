import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import api from "../../api/api";

function Pedido() {
  const [abaAtiva, setAbaAtiva] = useState("cliente");
  const navigate = useNavigate();
  const [pedido, setPedido] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [maquinas, setMaquinas] = useState([null]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { id } = useParams();

  const formatCurrency = (valor) => {
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };
  const formatCPF = (cpf) => {
    if (cliente.pais != "Brasil") {
      return cpf;
    }
    const cpfFormatado = cpf
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpfFormatado;
  };

  const formatTelefone = (telefone) => {
    if (cliente.pais != "Brasil") {
      return telefone;
    }
    const telefoneFormatado = telefone
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
    return telefoneFormatado;
  };

  useEffect(() => {
    const fetchPedidoDetalhes = async () => {
      try {
        const response = await api.get(`pedidos/${id}`);
        setPedido(response.data.pedido);
        setCliente(response.data.cliente);
        setMaquinas(response.data.maquinas);
        console.log(response.data);
      } catch (err) {
        console.error("Erro ao buscar detalhes do pedido:", err);
        setError("Não foi possível carregar os detalhes do pedido.");
      } finally {
        setLoading(false);
      }
    };

    fetchPedidoDetalhes();
  }, [id]);

  const pedidoRef = useRef(null);

  useEffect(() => {
    pedidoRef.current = pedido;
  }, [pedido]);

  if (loading) {
    return <>Carregando</>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!pedido) {
    return <p>Pedido não encontrado.</p>;
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
          <NavLink to={"imprimir"} target="blank">
            <button className="rounded-lg border bg-white mt-3 border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300">
              Imprimir
            </button>
          </NavLink>
        </div>

        {/* ABAS */}
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

        {/* CONTEÚDO DAS ABAS */}
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
                <p className="text-sm text-slate-800">{cliente.nome}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  CPF
                </p>
                <p className="text-sm text-slate-800">
                  {formatCPF(cliente.cpf)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  E-mail
                </p>
                <p className="text-sm text-slate-800">{cliente.email}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Telefone
                </p>
                <p className="text-sm text-slate-800">
                  {formatTelefone(cliente.telefone)}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Empresa
                </p>
                <p className="text-sm text-slate-800">{cliente.razao_social}</p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Endereço
                </p>
                <p className="text-sm text-slate-800">
                  {cliente.rua}, {cliente.numero}, {cliente.bairro} -{" "}
                  {cliente.cidade}/{cliente.estado}, {cliente.pais}
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
                  Entrada
                </p>
                <p className="text-sm text-slate-800">{pedido.entrada}%</p>
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
                <p className="text-sm text-slate-800 font-semibold">
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
                      <td className="px-4 py-4 font-medium">
                        {formatCurrency(item.valor_unitario * item.quantidade)}
                      </td>
                    </tr>
                  ))}

                  <tr className="border-t border-slate-300 bg-slate-50">
                    <td colSpan="4" className="px-4 py-4 text-right font-bold">
                      Total
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900">
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
