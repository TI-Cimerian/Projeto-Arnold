import { useEffect, useState } from "react";
import Select from "react-select";
import api from "../../../api/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ModalOrcamento({
  show,
  onClose,
  carrinho,
  subTotal,
  clientes,
  limparCarrinho,
}) {
  const [clienteSelecionado, setClienteSelecionado] = useState();
  const [observacao, setObservacao] = useState("");
  const [tipoPagamento, setTipoPagamento] = useState();
  const [parcelas, setParcelas] = useState(1);
  const [entrada, setEntrada] = useState(0);
  const [vendedor, setVendedor] = useState();
  const [desconto, setDesconto] = useState(0);
  const [prazo, setPrazo] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (show) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [show]);

  useEffect(() => {
    if (tipoPagamento?.value === "À vista") {
      setParcelas(1);
    }
  }, [tipoPagamento]);

  const total = subTotal - subTotal * (desconto / 100);
  const valorEntrada = total * (Number(entrada) / 100);
  const valorParcelas = (total - valorEntrada) / Number(parcelas || 1);

  const criarPedido = async () => {
    try {
      const response = await api.post("pedidos/create", {
        cliente: clienteSelecionado?.value,
        valorBruto: subTotal,
        valorLiquido: total,
        desconto: desconto,
        vendedor: vendedor?.value,
        maquinas: carrinho,
        observacao: observacao,
        prazo: prazo,
        tipo_pagamento: tipoPagamento?.value,
        entrada: entrada,
        num_parcelas: tipoPagamento?.value === "À vista" ? 1 : parcelas,
        valor_parcelas:
          tipoPagamento?.value === "À vista" ? total : valorParcelas,
      });

      toast.success("Pedido registrado com sucesso");
      setClienteSelecionado(null);
      setVendedor(null);
      setEntrada(0);
      setParcelas(1);
      setTipoPagamento(null);
      setObservacao("");
      onClose();
      limparCarrinho();
      navigate(`pedidos/${response.data.pedido.id}`);
    } catch (error) {
      toast.error(error?.response?.data?.error || "Erro ao cadastrar cliente");
    }
  };

  if (!show) return null;

  const options = clientes.map((m) => ({
    value: m.id,
    label: `${m.nome} - ${m.email}`,
  }));

  const optionsVendedor = [
    { value: "Benedito Salles", label: "Benedito Salles" },
    { value: "Jhonatan Barbosa", label: "Jhonatan Barbosa" },
    { value: "Dayane Geocondo", label: "Dayane Geocondo" },
    { value: "João Henrique", label: "João Henrique" },
    { value: "Murilo Mansano", label: "Murilo Mansano" },
    { value: "Fábio Furtado", label: "Fábio Furtado" },
    { value: "Gabriel Wesley", label: "Gabriel Wesley" },
    { value: "Vitor Hugo da Rocha", label: "Vitor Hugo da Rocha" },
    { value: "Fernando Nascimento", label: "Fernando Nascimento" },
    { value: "Keren de Oliveira", label: "Keren de Oliveira" },
  ];

  const optionsPagamento = [
    { value: "À vista", label: "À vista" },
    { value: "Parcelamento", label: "Parcelamento" },
    { value: "Financiamento", label: "Financiamento" },
  ];

  const styles = {
    control: (base, state) => ({
      ...base,
      width: "100%",
      height: "2.5rem",
      borderRadius: "0.75rem",
      borderColor: "#E2E8F0",
      backgroundColor: "#FFFFFF",
      fontSize: "0.875rem",
      outline: "none",
      transition: "all 0.2s ease",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.2)" : "none",
      "&:hover": {
        borderColor: "#E2E8F0",
      },
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#F3F4F6" : "#FFFFFF",
      color: "#111827",
      "&:active": {
        backgroundColor: "#E5E7EB",
      },
    }),
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center ">
      <div className="absolute inset-0 bg-black/60 " onClick={onClose} />

      <div className="relative z-10 w-full max-w-7xl rounded-2xl bg-white p-6 shadow-2xl max-h-screen">
        <div className="flex items-center justify-between border-b pb-3 ">
          <h2 className="text-xl font-semibold text-gray-900">
            Gerar orçamento
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4 overflow-y-auto max-h-[500px] px-1">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Produtos selecionados
            </h3>

            <div className="mt-3 max-h-96 space-y-3 overflow-y-auto">
              {carrinho.length > 0 ? (
                carrinho.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border p-3"
                  >
                    <img
                      src={`/maquinas/${item.id}.jpg`}
                      alt={item.nome}
                      className="h-16 w-16 rounded-lg object-cover"
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 uppercase">
                        {item.nome}
                      </p>
                      <p className="text-sm text-gray-500">
                        Quantidade: {item.quantidade}
                      </p>
                    </div>

                    <div className="text-sm font-semibold text-gray-700">
                      {(item.valor * item.quantidade).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  Nenhum item no carrinho.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Cliente
              </h3>
              <div className="mt-3 max-h-72 space-y-3">
                <div className="space-y-1">
                  <Select
                    options={options}
                    placeholder={"Selecione o cliente"}
                    required
                    styles={styles}
                    value={options.find(
                      (option) => option.value === clienteSelecionado?.id,
                    )}
                    onChange={(e) => {
                      setClienteSelecionado(e);
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Vendedor
              </h3>
              <div className="mt-3 max-h-72 space-y-3">
                <div className="space-y-1">
                  <Select
                    options={optionsVendedor}
                    placeholder={"Selecione o cliente"}
                    required
                    styles={styles}
                    value={optionsVendedor.find(
                      (option) => option.value === vendedor?.value,
                    )}
                    onChange={(e) => {
                      setVendedor(e);
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Tipo de pagamento
              </h3>
              <div className="mt-3 max-h-72 space-y-3">
                <div className="space-y-1">
                  <Select
                    options={optionsPagamento}
                    placeholder={"Selecione o cliente"}
                    required
                    styles={styles}
                    value={optionsPagamento.find(
                      (option) => option.value === tipoPagamento?.value,
                    )}
                    onChange={(e) => {
                      setTipoPagamento(e);
                    }}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Percentual de entrada
              </h3>
              <div className="mt-3 max-h-72 space-y-3">
                <div className="space-y-1">
                  <input
                    type="text"
                    value={entrada}
                    onChange={(e) => setEntrada(e.target.value)}
                    className="w-full rounded-xl border h-10 border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                    placeholder="Razão social"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1 w-full">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Número de parcelas
              </h3>
              <input
                type="number"
                min={1}
                className="w-full rounded-xl border h-10 border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Descrição"
                value={tipoPagamento?.value === "À vista" ? 1 : parcelas}
                disabled={tipoPagamento?.value === "À vista"}
                onChange={(e) => setParcelas(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2 w-full">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Observações
              </h3>
              <textarea
                className="w-full rounded-xl border border-slate-200 bg-white px-3 min-h-[50px] max-h-[100px] py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                placeholder="Descrição"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Subtotal</span>
              <span>
                {subTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>Desconto</span>
              <span>
                <input
                  className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-right text-sm font-semibold text-gray-700 shadow-sm outline-none transition"
                  type="number"
                  min="0"
                  max="100"
                  value={desconto}
                  onChange={(e) => {
                    const valor = Number(e.target.value);
                    setDesconto(Math.min(100, Math.max(0, valor)));
                  }}
                />{" "}
                %
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>Entrada</span>
              <span>
                {valorEntrada.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>Parcelas</span>
              <span>
                {tipoPagamento?.value === "À vista" ? 1 : parcelas || 1}x de{" "}
                {(tipoPagamento?.value === "À vista"
                  ? total
                  : valorParcelas
                ).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>Prazo</span>
              <span>
                <input
                  className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-right text-sm font-semibold text-gray-700 shadow-sm outline-none transition"
                  type="number"
                  value={prazo}
                  onChange={(e) => setPrazo(Number(e.target.value))}
                />{" "}
                dias
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between border-t pt-3 text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onClose}
            className="rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            onClick={() => criarPedido()}
            className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
