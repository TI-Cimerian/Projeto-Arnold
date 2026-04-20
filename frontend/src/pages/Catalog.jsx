import { useEffect, useState } from "react";
import api from "../../api/api";
import ModalOrcamento from "../components/common/ModalOrcamento";
import { NavLink } from "react-router-dom";

function Catalog() {
  const [clientes, setClientes] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [categoria, setCategoria] = useState("todas");
  const [subCategoria, setsubCategoria] = useState("todas");
  const [limit, setLimit] = useState(200);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchMaquinas = async () => {
      const response = await api.get("/maquinas", {
        params: {
          page: currentPage,
          limit,
          searchTerm,
          opcaoCategoria: categoria,
          opcaoSubCategoria: subCategoria,
        },
      });

      const maquinasFormatadas = response.data.map((maquina) => ({
        ...maquina,
        valor: Number(maquina.valor),
      }));

      setMaquinas(maquinasFormatadas);
    };

    fetchMaquinas();
  }, [categoria, subCategoria, currentPage, limit, searchTerm]);

  useEffect(() => {
    const fetchClientes = async () => {
      const response = await api.get("/clientes");
      setClientes(response);
    };

    fetchClientes();
  }, []);

  const subTotal = carrinho.reduce(
    (total, item) => total + item.quantidade * item.valor,
    0,
  );

  function addiItensToCart(item) {
    if (!item) return;

    setCarrinho((prev) => {
      const itemExistente = prev.find((produto) => produto.id === item.id);

      if (itemExistente) {
        return prev.map((produto) =>
          produto.id === item.id
            ? { ...produto, quantidade: produto.quantidade + 1 }
            : produto,
        );
      }
      return [...prev, { ...item, quantidade: 1 }];
    });
  }

  function removeItensFromCart(id) {
    setCarrinho((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantidade: item.quantidade - 1 } : item,
        )
        .filter((item) => item.quantidade > 0),
    );
  }
  function removeItem(id) {
    setCarrinho((prev) => prev.filter((item) => item.id !== id));
  }
  function clearCartItens() {
    setCarrinho([]);
    setDesconto(0);
  }

  function selectCategoria(opcao) {
    setCategoria(opcao);
  }
  function selectsubCategoria(opcao) {
    setsubCategoria(opcao);
  }

  const formatarCategoria = (categoria) => {
    switch (categoria) {
      case "articulados":
        return "ARTICULADOS";
      case "linha-cardio":
        return "CARDIO";
      case "bateria-de-pesos":
        return "BATERIA DE PESOS";
      case "bancos":
        return "BANCOS";
      case "acessórios":
        return "ACESSÓRIOS";
    }
  };
  return (
    <>
      <ModalOrcamento
        show={isModalOpen}
        onClose={() => setModalOpen(false)}
        carrinho={carrinho}
        subTotal={subTotal}
        clientes={clientes.data}
        limparCarrinho={() => setCarrinho([])}
      />
      <div className="mt-20 mb-24 space-y-10 max-w-7xl mx-auto">
        {/* SEÇÃO CENTRAL */}
        <section className="overflow-hidden rounded-3xl border bg-gradient-to-r from-black via-black to-neutral-800 text-white shadow-sm">
          <div className="hidden md:grid gap-8 p-6 sm:p-8 md:grid-cols-2 md:p-10">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-200">
                Catálogo Cimerian
              </p>
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                Equipamentos de alta performance
              </h1>
              <p className="text-gray-200">
                O futuro das academias que querem crescer está aqui.
              </p>
            </div>
            <div className="hidden items-center justify-end md:flex">
              <div className="relative h-full w-full max-w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div className="text-sm text-white/80">Carrinho rápido</div>
                <div className="mt-3 space-y-3 text-sm text-white">
                  <div className="rounded-xl bg-white/10 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/80">Itens</span>
                      <span className="font-semibold">{carrinho.length}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-white/80 font-semibold">
                        Orçamento sob consulta
                      </span>
                    </div>
                  </div>
                </div>
                <div className="absolute -right-6 bottom-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO DAS MÁQUINAS */}
        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <div className="flex justify-around md:flex-col md:justify-normal md:space-y-3">
              <div className="relative mt-16 lg:mt-0 w-full min-w-[280px] max-w-[280px] lg:max-w-[360px] hidden lg:flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                >
                  <path d="m21 21-4.34-4.34"></path>
                  <circle cx="11" cy="11" r="8"></circle>
                </svg>
                <input
                  type="text"
                  name=""
                  placeholder="Buscar equipamentos"
                  id=""
                  className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="flex flex-col relative w-fit space-y-2">
                <div className="flex flex-row items-center cursor-pointer">
                  <p className="px-1 text-[0.9rem] md:text-xs uppercase tracking-wide text-gray-400">
                    Categorias
                  </p>
                </div>
              </div>
              <div
                className="
                               hidden flex
                               flex-col md:flex-row absolute md:static top-full left-0 md:top-0
                             bg-white z-[999] md:z-0 border-[1px] md:border-none p-3 md:p-0 rounded-xl border-black 
                               md:flex items-center gap-2 overflow-x-auto mt-2 md:mt-0 -m-3 md:-m-0 "
              >
                <button
                  onClick={() => selectCategoria("todas")}
                  className={
                    categoria === "todas"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Todas
                </button>
                <button
                  onClick={() => selectCategoria("articulados")}
                  className={
                    categoria === "articulados"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Articulados
                </button>
                <button
                  onClick={() => selectCategoria("bateria-de-pesos")}
                  className={
                    categoria === "bateria-de-pesos"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Bateria de pesos
                </button>
                <button
                  onClick={() => selectCategoria("linha-cardio")}
                  className={
                    categoria === "linha-cardio"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Cardio
                </button>
                <button
                  onClick={() => selectCategoria("bancos")}
                  className={
                    categoria === "bancos"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Bancos
                </button>
                <button
                  onClick={() => selectCategoria("acessórios")}
                  className={
                    categoria === "acessórios"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Acessórios
                </button>
              </div>
              <div className="flex flex-col relative w-fit space-y-2">
                <div className="flex flex-row items-center cursor-pointer">
                  <p className="px-1 text-[0.9rem] md:text-xs uppercase tracking-wide text-gray-400">
                    Subcategorias
                  </p>
                </div>
              </div>
              <div
                className="
                               hidden flex
                               flex-col md:flex-row absolute md:static top-full left-0 md:top-0
                             bg-white z-[999] md:z-0 border-[1px] md:border-none p-3 md:p-0 rounded-xl border-black 
                               md:flex items-center gap-2 overflow-x-auto mt-2 md:mt-0 -m-3 md:-m-0 "
              >
                <button
                  onClick={() => selectsubCategoria("todas")}
                  className={
                    subCategoria === "todas"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Todas
                </button>
                <button
                  onClick={() => selectsubCategoria("peito")}
                  className={
                    subCategoria === "peito"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Peito
                </button>
                <button
                  onClick={() => selectsubCategoria("costas")}
                  className={
                    subCategoria === "costas"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Costas
                </button>

                <button
                  onClick={() => selectsubCategoria("ombros")}
                  className={
                    subCategoria === "ombros"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Ombros
                </button>
                <button
                  onClick={() => selectsubCategoria("pernas")}
                  className={
                    subCategoria === "pernas"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Pernas
                </button>
                <button
                  onClick={() => selectsubCategoria("glúteos")}
                  className={
                    subCategoria === "glúteos"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Glúteos
                </button>
                <button
                  onClick={() => selectsubCategoria("braços")}
                  className={
                    subCategoria === "braços"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Braços
                </button>
                <button
                  onClick={() => selectsubCategoria("core")}
                  className={
                    subCategoria === "core"
                      ? "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-black bg-black text-white"
                      : "whitespace-nowrap rounded-full border px-4 py-2 text-sm transition border-gray-200 text-gray-700 hover:border-black/40 hover:text-black"
                  }
                >
                  Core
                </button>
              </div>
            </div>

            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 relative overflow-y-auto ">
              {maquinas.map((maquina) => (
                <div
                  key={maquina.id}
                  className="group w-43 h-80 sm:w-auto flex sm:h-full flex-col rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md relative"
                >
                  <div className="relative h-56  overflow-hidden rounded-t-2xl ">
                    <img
                      src={`/maquinas/${maquina.id}.jpg`}
                      alt={maquina.nome}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black">
                      {formatarCategoria(maquina.categoria)}
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm text-gray-900 uppercase">
                          {maquina.nome}
                        </h3>
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                          {maquina.sub_categoria}
                        </p>
                        <div className="hidden sm:flex text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                          {maquina.valor.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto flex flex-col items-center gap-2">
                      <NavLink
                        to={`maquina/${maquina.id}`}
                        target="_blank"
                        className="text-sm font-medium text-black underline-offset-4 hover:underline"
                      >
                        Ver detalhes
                      </NavLink>

                      <button
                        onClick={() => {
                          addiItensToCart(maquina);
                        }}
                        className="mb-1 rounded-xl border px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                      >
                        Adicionar ao carrinho
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block space-y-4 rounded-2xl border bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:self-start">
            <div className="flex items-center justify-between lg:cursor-default">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-400">
                  Carrinho
                </p>
                <h2 className="text-xl font-semibold text-gray-900">
                  Resumo dos produtos
                </h2>
              </div>
              {carrinho.length > 0 ? (
                <button
                  onClick={() => {
                    clearCartItens();
                  }}
                  className="text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Limpar
                </button>
              ) : (
                <div />
              )}
            </div>
            <div className="mt-3 max-h-screen space-y-3 overflow-y-auto">
              {carrinho.map((item) => (
                <div key={item.id}>
                  <div className="flex gap-3 rounded-xl border p-3">
                    <img
                      className="h-36 w-36 rounded-lg object-cover"
                      src={`/maquinas/${item.id}.jpg`}
                      alt=""
                    />
                    <div className="flex-1 space-y-1 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="mt-1">
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            ID: {item.id}
                          </p>
                          <p className="font-semibold text-gray-900 uppercase">
                            {item.nome}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatarCategoria(item.categoria)}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            removeItem(item.id);
                          }}
                          className="text-xs mt-2 font-semibold text-red-600 hover:text-red-700"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-lg border px-2 py-1">
                          <button
                            onClick={() => {
                              removeItensFromCart(item.id);
                            }}
                            className="px-2 text-lg leading-none text-gray-600 transition hover:text-black"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-gray-900">
                            {item.quantidade}
                          </span>
                          <button
                            onClick={() => {
                              addiItensToCart(item);
                            }}
                            className="px-2 text-lg leading-none text-gray-600 transition hover:text-black"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {carrinho.length < 1 ? (
              <div className="rounded-xl border border-dashed p-4 text-sm text-gray-500">
                Adicione produtos para montar o orçamento
              </div>
            ) : (
              <div />
            )}

            <div className="space-y-3 rounded-xl bg-gray-50 p-3">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Itens</span>
                <span>{carrinho.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>
                  {subTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
              {carrinho.length > 0 ? (
                <>
                  {/* <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Desconto %</span>
                    <input
                      className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-right text-sm font-semibold text-gray-700 shadow-sm outline-none transition "
                      type="number"
                      onChange={(e) => setDesconto(Number(e.target.value))}
                    ></input>
                  </div> */}
                  {/* <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Prazo (dias)</span>
                    <input
                      className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-right text-sm font-semibold text-gray-700 shadow-sm outline-none transition "
                      type="number"
                      onChange={(e) => setPrazo(Number(e.target.value))}
                    ></input>
                  </div> */}
                  {/* <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Total</span>
                    <span>
                      {total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </div> */}
                </>
              ) : (
                <div />
              )}
            </div>
            {carrinho.length > 0 ? (
              <button
                onClick={() => setModalOpen(true)}
                className="w-full rounded-xl px-4 py-3 text-sm mt-5 font-semibold text-white transition bg-black hover:bg-neutral-800"
              >
                Gerar orçamento
              </button>
            ) : (
              <div />
            )}
          </div>
        </section>
      </div>
    </>
  );
}

export default Catalog;
