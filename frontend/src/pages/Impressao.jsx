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

function Impressao() {
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
        console.log(response.data);
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
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-wide">
          ORÇAMENTO #{pedido.id}
        </h2>
      </div>

      <section className="overflow-hidden border-l-2 border-[#0b527d]">
        <div className="bg-[#eeeeee] px-4 py-3 font-bold">DADOS DO CLIENTE</div>

        <div className="grid grid-cols-2 bg-[#eeeeee]">
          {cliente.tipo == "PJ" ? (
            <>
              <div className="px-3 py-1">
                <strong>Nome:</strong> {cliente.nome} {cliente.sobrenome}
              </div>
              <div className="px-3 py-1">
                <strong>Razão Social:</strong> {cliente.razaoSocial}
              </div>

              <div className="px-3 py-1">
                <strong>CNPJ:</strong> {cliente.cnpj}
              </div>

              <div className="px-3 py-1">
                <strong>Cidade - UF:</strong> {cliente.cidade} -{" "}
                {cliente.estado}
              </div>
              <div className="px-3 py-1">
                <strong>Telefone:</strong> {cliente.telefone}
              </div>

              <div className="px-3 py-1">
                <strong>E-mail:</strong> {cliente.email}
              </div>

              <div className="px-3 py-1">
                <strong>Endereço:</strong> {cliente.rua}, {cliente.numero},{" "}
                {cliente.bairro}
              </div>
            </>
          ) : (
            <>
              <div className="px-3 py-1">
                <strong>Nome:</strong> {cliente.nome} {cliente.sobrenome}
              </div>
              <div className="px-3 py-1">
                <strong>CPF:</strong> {formatCPF(cliente.cpf)}
              </div>

              <div className="px-3 py-1">
                <strong>Endereço:</strong> {cliente.rua}, {cliente.numero},{" "}
                {cliente.bairro}
              </div>
              <div className="px-3 py-1">
                <strong>Cidade - UF:</strong> {cliente.cidade} -{" "}
                {cliente.estado}
              </div>

              <div className="px-3 py-1">
                <strong>Telefone:</strong> {formatTelefone(cliente.telefone)}
              </div>

              <div className="px-3 py-1">
                <strong>E-mail:</strong> {cliente.email}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="overflow-hidden ">
        <div className="px-4 py-3 text-black font-bold">Produtos</div>
        <div className="overflow-x-auto rounded-md">
          <table className="w-full border-collapse text-sm">
            <tbody>
              <tr className="bg-[#343a40] text-white">
                <th className="p-3">Imagem</th>
                <th className="p-3">Quantidade</th>
                <th className="p-3">Preço Unit.</th>
                <th className="p-3">Total</th>
              </tr>
              {maquinas.map((produto) => (
                <React.Fragment key={produto.id}>
                  <tr>
                    <td className="border text-center align-middle">
                      <img
                        src={`/maquinas/${produto.id}.jpg`}
                        alt={produto.nome}
                        className="mx-auto h-[90px] w-[90px] object-contain"
                      />
                    </td>
                    <td className="border text-center align-middle">
                      {produto.quantidade}
                    </td>
                    <td className="border text-center align-middle">
                      {formatCurrency(produto.valor_unitario)}
                    </td>

                    <td className="border text-center align-middle">
                      {formatCurrency(produto.valor_total)}
                    </td>
                  </tr>

                  <tr>
                    <td
                      colSpan={5}
                      className="border px-4 py-2 text-left uppercase"
                    >
                      <p>
                        <strong>Item:</strong> {produto.nome}
                      </p>

                      <p className="mt-2">
                        <strong>Comprimento: </strong>
                        {Number(produto?.comprimento).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        <strong>| Altura: </strong>{" "}
                        {Number(produto?.altura).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        <strong>| Largura: </strong>{" "}
                        {Number(produto?.largura).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        <strong>| Peso: </strong>{" "}
                        {Number(produto?.peso).toLocaleString("pt-BR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        kg
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td colSpan={5} className=""></td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-[#eeeeee] p-4 text-center font-semibold">
                Valor Bruto
              </th>
              <th className="border border-gray-300 bg-[#eeeeee] p-4 text-center font-semibold">
                Desconto
              </th>
              <th className="border border-gray-300 bg-[#eeeeee] p-4 text-center font-semibold">
                Valor de desconto
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border border-gray-300 p-4 text-center">
                {formatCurrency(pedido.valor_bruto)}
              </td>
              <td className="border border-gray-300 p-4 text-center">
                {pedido.desconto} %
              </td>
              <td className="border border-gray-300 p-4 text-center">
                {formatCurrency(pedido.valor_bruto - pedido.valor_liquido)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end bg-[#eeeeee] p-4 text-lg font-bold">
          Valor Total:{" "}
          <span className="ml-2">{formatCurrency(pedido.valor_liquido)}</span>
        </div>
      </section>
      <div>
        <div className="bg-[#dddddd] border-b-2 border-[#0b527d] px-4 py-3 font-bold">
          Condições de Pagamento
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-[#eeeeee] p-4 text-center font-semibold">
                Tipo de pagamento
              </th>
              <th className="border border-gray-300 bg-[#eeeeee] p-4 text-center font-semibold">
                Entrada
              </th>
              <th className="border border-gray-300 bg-[#eeeeee] p-4 text-center font-semibold">
                Valor de entrada
              </th>
              <th className="border border-gray-300 bg-[#eeeeee] p-4 text-center font-semibold">
                Parcelas
              </th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border border-gray-300 p-4 text-center">
                {pedido.tipo_pagamento}
              </td>
              <td className="border border-gray-300 p-4 text-center">
                {pedido.entrada} %
              </td>
              <td className="border border-gray-300 p-4 text-center">
                {formatCurrency(pedido.valor_liquido * (pedido.entrada / 100))}
              </td>
              <td className="border border-gray-300 p-4 text-center">
                {pedido.num_parcelas}x de{" "}
                {formatCurrency(pedido.valor_parcelas)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <section className="overflow-hidden rounded-md border border-gray-200">
        <div className="bg-[#dddddd] border-b-2 border-[#0b527d] px-4 py-3 font-bold">
          Prazo de entrega
        </div>
        <div className="p-4">{pedido.prazo} dias</div>
      </section>

      <section className="overflow-hidden rounded-md border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-[140px_1fr]">
          <div className="border-b md:border-b-0 md:border-r p-3 font-bold">
            Emitida por:
          </div>
          <div className="p-3">{pedido.vendedor}</div>
        </div>
      </section>
    </div>
  );
}

export default Impressao;
