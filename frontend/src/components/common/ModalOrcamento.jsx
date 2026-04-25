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
  const [acrescimo, setAcrescimo] = useState(0);
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

  const valorDesconto = subTotal * (Number(desconto) / 100);
  const valorComDesconto = subTotal - valorDesconto;
  const valorAcrescimo = valorComDesconto * (Number(acrescimo) / 100);
  const total = valorComDesconto + valorAcrescimo;
  const valorEntrada = total * (Number(entrada) / 100);
  const valorParcelas = (total - valorEntrada) / Number(parcelas || 1);

  const criarPedido = async () => {
    try {
      const response = await api.post("pedidos/create", {
        cliente: clienteSelecionado?.value,
        valorBruto: subTotal,
        valorLiquido: total,
        desconto,
        vendedor: vendedor?.value,
        maquinas: carrinho,
        observacao,
        prazo,
        tipo_pagamento: tipoPagamento?.value,
        entrada,
        num_parcelas: tipoPagamento?.value === "À vista" ? 1 : parcelas,
        valor_parcelas:
          tipoPagamento?.value === "À vista" ? total : valorParcelas,
        acrescimo,
      });

      toast.success("Pedido registrado com sucesso");

      setClienteSelecionado(null);
      setVendedor(null);
      setEntrada(0);
      setParcelas(1);
      setTipoPagamento(null);
      setObservacao("");
      setDesconto(0);
      setPrazo(0);
      setAcrescimo(0);

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
      minHeight: "2.5rem",
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

    valueContainer: (base) => ({
      ...base,
      padding: "0 0.75rem",
    }),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),

    indicatorsContainer: (base) => ({
      ...base,
      minHeight: "2.5rem",
    }),

    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#F3F4F6" : "#FFFFFF",
      color: "#111827",
      "&:active": {
        backgroundColor: "#E5E7EB",
      },
    }),

    menu: (base) => ({
      ...base,
      zIndex: 99999,
    }),
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-6">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-10 my-4 flex max-h-[calc(100vh-2rem)] w-full max-w-7xl flex-col rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b pb-3">
          <h2 className="text-base font-semibold text-gray-900 sm:text-xl">
            Gerar orçamento
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-3 py-1 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-4 overflow-y-auto px-1 pr-1">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Produtos selecionados
            </h3>

            <div className="mt-3 max-h-72 space-y-3 overflow-y-auto pr-1 sm:max-h-96">
              {carrinho.length > 0 ? (
                carrinho.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center"
                  >
                    <img
                      src={`/maquinas/${item.id}.jpg`}
                      alt={item.nome}
                      className="h-20 w-full rounded-lg object-cover sm:h-16 sm:w-16"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="break-words font-semibold uppercase text-gray-900">
                        {item.nome}
                      </p>

                      <p className="text-sm text-gray-500">
                        Quantidade: {item.quantidade}
                      </p>
                    </div>

                    <div className="text-left text-sm font-semibold text-gray-700 sm:text-right">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Cliente
              </h3>

              <div className="mt-3 space-y-3">
                <Select
                  options={options}
                  placeholder="Selecione o cliente"
                  required
                  styles={styles}
                  value={options.find(
                    (option) => option.value === clienteSelecionado?.value,
                  )}
                  onChange={(e) => setClienteSelecionado(e)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Vendedor
              </h3>

              <div className="mt-3 space-y-3">
                <Select
                  options={optionsVendedor}
                  placeholder="Selecione o vendedor"
                  required
                  styles={styles}
                  value={optionsVendedor.find(
                    (option) => option.value === vendedor?.value,
                  )}
                  onChange={(e) => setVendedor(e)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Tipo de pagamento
              </h3>

              <div className="mt-3 space-y-3">
                <Select
                  options={optionsPagamento}
                  placeholder="Selecione o pagamento"
                  required
                  styles={styles}
                  value={optionsPagamento.find(
                    (option) => option.value === tipoPagamento?.value,
                  )}
                  onChange={(e) => setTipoPagamento(e)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Percentual de entrada
              </h3>

              <div className="mt-3 space-y-3">
                <input
                  type="number"
                  min={0}
                  value={entrada}
                  onChange={(e) => setEntrada(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                  placeholder="Percentual de entrada"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Acréscimo
              </h3>

              <div className="mt-3 space-y-3">
                <input
                  type="number"
                  min={0}
                  value={acrescimo}
                  onChange={(e) => setAcrescimo(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                  placeholder="Percentual de acréscimo"
                />
              </div>
            </div>

            <div className="w-full space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Número de parcelas
              </h3>

              <input
                type="number"
                min={1}
                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="Número de parcelas"
                value={tipoPagamento?.value === "À vista" ? 1 : parcelas}
                disabled={tipoPagamento?.value === "À vista"}
                onChange={(e) => setParcelas(Number(e.target.value))}
              />
            </div>

            <div className="w-full space-y-3 sm:col-span-2 lg:col-span-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                Observações
              </h3>

              <textarea
                className="min-h-[80px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                placeholder="Descrição"
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 p-4">
            <div className="flex items-center justify-between gap-4 text-sm text-gray-600">
              <span>Subtotal</span>
              <span className="text-right">
                {subTotal.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4 text-sm text-gray-600">
              <span>Desconto</span>

              <span className="flex items-center gap-1">
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
                />
                %
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4 text-sm text-gray-600">
              <span>Entrada</span>

              <span className="text-right">
                {valorEntrada.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>

            <div className="mt-2 flex items-center justify-between gap-4 text-sm text-gray-600">
              <span>Parcelas</span>

              <span className="text-right">
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

            <div className="mt-2 flex items-center justify-between gap-4 text-sm text-gray-600">
              <span>Prazo</span>

              <span className="flex items-center gap-1">
                <input
                  className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-right text-sm font-semibold text-gray-700 shadow-sm outline-none transition"
                  type="number"
                  value={prazo}
                  onChange={(e) => setPrazo(Number(e.target.value))}
                />
                dias
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between gap-4 border-t pt-3 text-base font-semibold text-gray-900">
              <span>Total</span>

              <span className="text-right">
                {total.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t pt-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:w-auto"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={criarPedido}
            className="w-full rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:w-auto"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
