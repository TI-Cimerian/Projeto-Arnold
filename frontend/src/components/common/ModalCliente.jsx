import { useEffect, useState } from "react";
import Select from "react-select";
import api from "../../../api/api";
import { toast } from "react-toastify";

export default function ModalCliente({ show, onClose, onClienteCriado }) {
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

  const [formData, setFormData] = useState({
    nomeCompleto: "",
    tipoCliente: "",
    razaoSocial: "",
    cnpj: "",
    cpf: "",
    email: "",
    telefone: "",
    rua: "",
    bairro: "",
    numero: "",
    cidade: "",
    estado: "",
    pais: "",
  });

  if (!show) return null;

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
      height: "2.5rem",
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

  const options = [
    { value: "PF", label: "Pessoa Física" },
    { value: "PJ", label: "Pessoa Jurídica" },
  ];

  async function createCliente(e) {
    e.preventDefault();

    try {
      const response = await api.post("clientes/create", formData);
      console.log(response);

      toast.success("Cliente registrado com sucesso");

      window.dispatchEvent(new Event("clienteCriado"));

      if (onClienteCriado) {
        onClienteCriado(response.data);
      }

      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Erro ao cadastrar cliente");
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto p-3 sm:items-center sm:p-6">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-10 my-4 w-full max-w-7xl rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between gap-3 border-b pb-3">
          <h2 className="text-base font-semibold uppercase text-gray-900 sm:text-xl">
            Cadastrar cliente
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg px-3 py-1 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Dados do cliente
            </h3>

            <div className="mt-3 max-h-[calc(100vh-220px)] space-y-3 overflow-y-auto pr-1 sm:max-h-[calc(100vh-240px)]">
              <form onSubmit={createCliente}>
                <div className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
                  <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">
                        Nome completo
                      </label>

                      <input
                        type="text"
                        required
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Nome completo"
                        value={formData.nomeCompleto}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            nomeCompleto: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">
                        Tipo de cliente
                      </label>

                      <Select
                        options={options}
                        placeholder="Selecione"
                        styles={styles}
                        value={options.find(
                          (option) => option.value === formData.tipoCliente,
                        )}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tipoCliente: e?.value || "",
                          }))
                        }
                      />
                    </div>

                    {formData.tipoCliente === "PJ" && (
                      <>
                        <div className="space-y-1">
                          <label className="text-sm text-slate-600">
                            Razão social
                          </label>

                          <input
                            type="text"
                            required={formData.tipoCliente === "PJ"}
                            value={formData.razaoSocial}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                razaoSocial: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                            placeholder="Razão social"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm text-slate-600">CNPJ</label>

                          <input
                            type="text"
                            value={formData.cnpj}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                cnpj: e.target.value,
                              }))
                            }
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                            placeholder="CNPJ"
                          />
                        </div>
                      </>
                    )}

                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">CPF</label>

                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="CPF"
                        value={formData.cpf}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cpf: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">E-mail</label>

                      <input
                        type="email"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="E-mail"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">Telefone</label>

                      <input
                        type="text"
                        inputMode="numeric"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Telefone"
                        required
                        value={formData.telefone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            telefone: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">Rua</label>

                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Rua"
                        value={formData.rua}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            rua: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">Bairro</label>

                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Bairro"
                        value={formData.bairro}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            bairro: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">Número</label>

                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Número"
                        value={formData.numero}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            numero: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">Cidade</label>

                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Cidade"
                        value={formData.cidade}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            cidade: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">Estado</label>

                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Estado"
                        value={formData.estado}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            estado: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm text-slate-600">País</label>

                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="País"
                        value={formData.pais}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pais: e.target.value,
                          }))
                        }
                      />
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
                    type="submit"
                    className="w-full rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 sm:w-auto"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
