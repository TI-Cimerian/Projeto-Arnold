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

      onClose();
    } catch (error) {
      toast.error(error?.response?.data?.error || "Erro ao cadastrar cliente");
    }
  }
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center ">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      <div className="relative z-10 w-full max-w-7xl rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-900 uppercase">
            Cadastrar cliente
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-gray-500 transition hover:bg-gray-100 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              Dados do cliente
            </h3>

            <div className="mt-3 max-h-auto space-y-3 overflow-y-auto">
              <form onSubmit={createCliente}>
                <div className="rounded-2xl border border-slate-200 bg-white p-4 ">
                  <div className=" grid gap-3 text-sm md:grid-cols-3">
                    <div className="space-y-1">
                      <label className="text-s text-slate-600">
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
                      <label className="text-s text-slate-600">
                        Tipo de cliente
                      </label>
                      <Select
                        options={options}
                        placeholder={"Selecione"}
                        styles={styles}
                        value={options.find(
                          (option) => option.value === formData.tipoCliente,
                        )}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tipoCliente: e.value,
                          }))
                        }
                      />
                    </div>
                    {formData.tipoCliente === "PJ" ? (
                      <>
                        <div className="space-y-1">
                          <label className="text-s text-slate-600">
                            Razão social
                          </label>
                          <input
                            type="text"
                            required={formData.tipoCliente == "PJ"}
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
                          <label className="text-s text-slate-600">CNPJ</label>
                          <input
                            value={formData.cnpj}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                cnpj: e.target.value,
                              }))
                            }
                            type="text"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                            placeholder="Número de série"
                          />
                        </div>
                      </>
                    ) : (
                      ""
                    )}

                    <div className="space-y-1">
                      <label className="text-s text-slate-600">CPF</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Número de série"
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
                      <label className="text-s text-slate-600">E-mail</label>
                      <input
                        type="email"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Número de série"
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
                      <label className="text-s text-slate-600">Telefone</label>
                      <input
                        type="number"
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
                      <label className="text-s text-slate-600">Rua</label>
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
                      <label className="text-s text-slate-600">Bairro</label>
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
                      <label className="text-s text-slate-600">Número</label>
                      <input
                        type="number"
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
                      <label className="text-s text-slate-600">Cidade</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Número de série"
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
                      <label className="text-s text-slate-600">Estado</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Número de série"
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
                      <label className="text-s text-slate-600">País</label>
                      <input
                        type="text"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/20 transition focus:ring-2"
                        placeholder="Número de série"
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
                <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                  <button
                    onClick={onClose}
                    className="rounded-xl border px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800"
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
