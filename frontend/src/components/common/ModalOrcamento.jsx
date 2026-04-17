import { useEffect, useState } from "react";
import Select from "react-select";
import api from "../../../api/api";
import { toast } from "react-toastify";

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
        num_parcelas: parcelas,
        valor_parcelas: valorParcelas,
      });
      toast.success("Pedido registrado com sucesso");
      setClienteSelecionado(null);
      setVendedor(null);
      setEntrada(null);
      setParcelas(null);
      setTipoPagamento(null);
      setObservacao(null);
      onClose();
      limparCarrinho();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Erro ao cadastrar cliente");
    }
  };
  const total = subTotal - subTotal * (desconto / 100);

  const valorEntrada = total * (entrada / 100);

  const valorParcelas = (total - valorEntrada) / parcelas;

  if (!show) return null;
  const options = clientes.map((m) => ({
    value: m.id,
    label: `${m.nome} ${" "} - ${" "} ${m.email} `,
  }));
  const optionsVendedor = [
    { value: "Benedito Salles", label: "Benedito Salles" },
    { value: "Jhonatan Barbosa", label: "Jhonatan Barbosa" },
    { value: "Dayane Geocondo", label: "Dayane Geocondo" },
    { value: "João Henrique", label: "João Henrique" },
    { value: "Murilo Mansano", label: "Murilo Mansano" },
    { value: "Fábio Furtado", label: "Fábio Furtado" },
    { value: "Gabriel Wesley", label: "Gabriel Wesley" },
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
      height: "2.5rem", // h-10
      borderRadius: "0.75rem", // rounded-xl
      borderColor: "#E2E8F0", // slate-200
      backgroundColor: "#FFFFFF", // bg-white
      fontSize: "0.875rem", // text-sm
      outline: "none",
      transition: "all 0.2s ease",
      boxShadow: state.isFocused
        ? "0 0 0 2px rgba(59, 130, 246, 0.2)" // ring-brand/20 + focus:ring-2
        : "none",
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
              <div className="mt-3 max-h-72 space-y-3">
                <div className="space-y-1"></div>
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
                className="w-full rounded-xl border h-10 border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                placeholder="Descrição"
                value={parcelas}
                onChange={(e) => setParcelas(e.target.value)}
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
              <span> Subtotal</span>
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
                {" "}
                <input
                  className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-right text-sm font-semibold text-gray-700 shadow-sm outline-none transition "
                  type="number"
                  value={desconto}
                  onChange={(e) => setDesconto(Number(e.target.value))}
                ></input>{" "}
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
                {parcelas || 1}x de{" "}
                {valorParcelas?.toLocaleString("pt-BR") || total}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
              <span>Prazo</span>
              <span>
                <input
                  className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-right text-sm font-semibold text-gray-700 shadow-sm outline-none transition "
                  type="number"
                  value={prazo}
                  onChange={(e) => setPrazo(Number(e.target.value))}
                ></input>{" "}
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
