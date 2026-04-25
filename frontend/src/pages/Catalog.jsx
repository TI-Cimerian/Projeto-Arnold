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

  const fetchClientes = async () => {
    const response = await api.get("/clientes");
    setClientes(response.data);
  };

  useEffect(() => {
    fetchClientes();

    const atualizarClientes = () => {
      fetchClientes();
    };

    window.addEventListener("clienteCriado", atualizarClientes);

    return () => {
      window.removeEventListener("clienteCriado", atualizarClientes);
    };
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
  }

  function selectCategoria(opcao) {
    setCategoria(opcao);
    setCurrentPage(1);
  }

  function selectsubCategoria(opcao) {
    setsubCategoria(opcao);
    setCurrentPage(1);
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
      default:
        return categoria || "";
    }
  };

  return (
    <>
      <ModalOrcamento
        show={isModalOpen}
        onClose={() => setModalOpen(false)}
        carrinho={carrinho}
        subTotal={subTotal}
        clientes={clientes}
        limparCarrinho={() => setCarrinho([])}
      />

      <div className="mx-auto mb-28 mt-6 w-full max-w-7xl space-y-6 px-3 sm:px-4 lg:mb-24 lg:mt-9 lg:space-y-10 lg:px-6">
        <section className="overflow-hidden rounded-3xl border bg-gradient-to-r from-black via-black to-neutral-800 text-white shadow-sm">
          <div className="grid gap-8 p-5 sm:p-8 md:grid-cols-2 md:p-10">
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-200">
                Catálogo Cimerian
              </p>

              <h1 className="text-2xl font-semibold leading-tight sm:text-3xl md:text-4xl">
                Equipamentos de alta performance
              </h1>

              <p className="text-sm text-gray-200 sm:text-base">
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
                      <span className="font-semibold text-white/80">
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

        <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="min-w-0 space-y-4">
            <div className="space-y-4 rounded-2xl border bg-white p-3 shadow-sm sm:p-4">
              <div className="relative w-full">
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
                  placeholder="Buscar equipamentos"
                  className="w-full rounded-full border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm text-gray-700 shadow-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="space-y-2">
                <p className="px-1 text-xs uppercase tracking-wide text-gray-400">
                  Categorias
                </p>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => selectCategoria("todas")}
                    className={
                      categoria === "todas"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Todas
                  </button>

                  <button
                    onClick={() => selectCategoria("articulados")}
                    className={
                      categoria === "articulados"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Articulados
                  </button>

                  <button
                    onClick={() => selectCategoria("bateria-de-pesos")}
                    className={
                      categoria === "bateria-de-pesos"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Bateria de pesos
                  </button>

                  <button
                    onClick={() => selectCategoria("linha-cardio")}
                    className={
                      categoria === "linha-cardio"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Cardio
                  </button>

                  <button
                    onClick={() => selectCategoria("bancos")}
                    className={
                      categoria === "bancos"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Bancos
                  </button>

                  <button
                    onClick={() => selectCategoria("acessórios")}
                    className={
                      categoria === "acessórios"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Acessórios
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="px-1 text-xs uppercase tracking-wide text-gray-400">
                  Subcategorias
                </p>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  <button
                    onClick={() => selectsubCategoria("todas")}
                    className={
                      subCategoria === "todas"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Todas
                  </button>

                  <button
                    onClick={() => selectsubCategoria("peito")}
                    className={
                      subCategoria === "peito"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Peito
                  </button>

                  <button
                    onClick={() => selectsubCategoria("costas")}
                    className={
                      subCategoria === "costas"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Costas
                  </button>

                  <button
                    onClick={() => selectsubCategoria("ombros")}
                    className={
                      subCategoria === "ombros"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Ombros
                  </button>

                  <button
                    onClick={() => selectsubCategoria("pernas")}
                    className={
                      subCategoria === "pernas"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Pernas
                  </button>

                  <button
                    onClick={() => selectsubCategoria("glúteos")}
                    className={
                      subCategoria === "glúteos"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Glúteos
                  </button>

                  <button
                    onClick={() => selectsubCategoria("braços")}
                    className={
                      subCategoria === "braços"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Braços
                  </button>

                  <button
                    onClick={() => selectsubCategoria("core")}
                    className={
                      subCategoria === "core"
                        ? "whitespace-nowrap rounded-full border border-black bg-black px-4 py-2 text-sm text-white transition"
                        : "whitespace-nowrap rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-700 transition hover:border-black/40 hover:text-black"
                    }
                  >
                    Core
                  </button>
                </div>
              </div>
            </div>

            <div className="grid max-h-none grid-cols-1 gap-3 overflow-visible sm:grid-cols-2 md:grid-cols-3 lg:max-h-[800px] lg:overflow-y-auto lg:pr-1">
              {maquinas.map((maquina) => (
                <div
                  key={maquina.id}
                  className="group flex min-w-0 flex-col rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-52 overflow-hidden rounded-t-2xl sm:h-56">
                    <img
                      src={`/maquinas/${maquina.id}.jpg`}
                      alt={maquina.nome}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    <div className="absolute right-2 top-2 max-w-[calc(100%-1rem)] rounded-full bg-white/90 px-3 py-1 text-[10px] font-semibold text-black sm:right-3 sm:top-3 sm:text-xs">
                      {formatarCategoria(maquina.categoria)}
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 p-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-sm uppercase text-gray-900">
                        {maquina.nome}
                      </h3>

                      <p className="text-[11px] uppercase tracking-wide text-gray-500">
                        {maquina.sub_categoria}
                      </p>

                      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                        {maquina.valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </div>
                    </div>

                    <div className="mt-auto flex flex-col gap-2">
                      <NavLink
                        to={`maquina/${maquina.id}`}
                        target="_blank"
                        className="text-center text-sm font-medium text-black underline-offset-4 hover:underline"
                      >
                        Ver detalhes
                      </NavLink>

                      <button
                        onClick={() => addiItensToCart(maquina)}
                        className="w-full rounded-xl border px-4 py-2 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
                      >
                        Adicionar ao carrinho
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden space-y-4 rounded-2xl border bg-white p-4 shadow-sm lg:sticky lg:top-6 lg:block lg:self-start">
            <div className="flex items-center justify-between">
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
                  onClick={clearCartItens}
                  className="text-xs font-semibold text-red-600 hover:text-red-700"
                >
                  Limpar
                </button>
              ) : (
                <div />
              )}
            </div>

            <div className="mt-3 max-h-[55vh] space-y-3 overflow-y-auto pr-1">
              {carrinho.map((item) => (
                <div key={item.id}>
                  <div className="flex gap-3 rounded-xl border p-3">
                    <img
                      className="h-28 w-28 rounded-lg object-cover xl:h-36 xl:w-36"
                      src={`/maquinas/${item.id}.jpg`}
                      alt={item.nome}
                    />

                    <div className="min-w-0 flex-1 space-y-1 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <div className="mt-1 min-w-0">
                          <p className="text-[11px] uppercase tracking-wide text-gray-400">
                            ID: {item.id}
                          </p>

                          <p className="break-words font-semibold uppercase text-gray-900">
                            {item.nome}
                          </p>

                          <p className="text-xs text-gray-500">
                            {formatarCategoria(item.categoria)}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-2 shrink-0 text-xs font-semibold text-red-600 hover:text-red-700"
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
                            onClick={() => removeItensFromCart(item.id)}
                            className="px-2 text-lg leading-none text-gray-600 transition hover:text-black"
                          >
                            -
                          </button>

                          <span className="w-6 text-center text-sm font-semibold text-gray-900">
                            {item.quantidade}
                          </span>

                          <button
                            onClick={() => addiItensToCart(item)}
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

              <div className="flex items-center justify-between gap-3 text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="text-right">
                  {subTotal.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>

            {carrinho.length > 0 ? (
              <button
                onClick={() => setModalOpen(true)}
                className="mt-5 w-full rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Gerar orçamento
              </button>
            ) : (
              <div />
            )}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white p-3 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wide text-gray-400">
              Carrinho
            </p>

            <p className="truncate text-sm font-semibold text-gray-900">
              {carrinho.length} item(ns) ·{" "}
              {subTotal.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>

          <button
            type="button"
            disabled={carrinho.length === 0}
            onClick={() => setModalOpen(true)}
            className="shrink-0 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Orçamento
          </button>
        </div>
      </div>
    </>
  );
}

export default Catalog;
