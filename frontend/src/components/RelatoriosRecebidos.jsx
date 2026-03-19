import { useState, useEffect } from "react";
import { buscarRelatorios } from "../services/api";

function RelatoriosRecebidos({ setTela }) {
  const [relatorios, setRelatorios] = useState([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");
  const [relatorioSelecionado, setRelatorioSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const dados = await buscarRelatorios();
        setRelatorios(dados);
      } catch (e) {
        setErro("Erro ao carregar relatórios.");
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  const statusUnicos = [...new Set(relatorios.map((r) => r.status).filter(Boolean))];

  const relatoriosFiltrados = relatorios.filter((r) => {
    const nomeCombina = (r.nome_paciente || "").toLowerCase().includes(filtroNome.toLowerCase());
    const statusCombina = filtroStatus ? r.status === filtroStatus : true;
    return nomeCombina && statusCombina;
  });

  function classStatus(status) {
    if (!status) return "";
    return status.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function formatarData(dataISO) {
    if (!dataISO) return "";
    return new Date(dataISO).toLocaleDateString("pt-BR");
  }

  function gerarSemana(dataEnvio) {
    const base = dataEnvio ? new Date(dataEnvio) : new Date();
    const semana = [];
    for (let i = 0; i < 7; i++) {
      const data = new Date(base);
      data.setDate(base.getDate() - base.getDay() + i);
      semana.push(data.toLocaleDateString("pt-BR"));
    }
    return semana;
  }

  if (loading) return <p>Carregando relatórios...</p>;
  if (erro) return <p className="mensagem-erro">{erro}</p>;

  if (relatorioSelecionado) {
    const semana = gerarSemana(relatorioSelecionado.data_envio);

    return (
      <>
        <h2>Relatório Individual</h2>
        <div className="cardRelatorioDetalhado">
          <div className="topoRelatorio">
            <h3>{relatorioSelecionado.nome_paciente || `Paciente #${relatorioSelecionado.paciente_id}`}</h3>
            <div className="infoTopoRelatorio">
              <span className="dataRelatorio">{formatarData(relatorioSelecionado.data_envio)}</span>
            </div>
          </div>

          <p><strong>Como está:</strong> {relatorioSelecionado.como_se_sente}</p>
          <p><strong>Hidratação:</strong> {relatorioSelecionado.copos_agua} copos</p>
          <p><strong>Observação:</strong> {relatorioSelecionado.observacao || "—"}</p>

          <div style={{ marginTop: "16px" }}>
            <p style={{ textAlign: "left", marginBottom: "10px" }}>
              <strong>Medicações:</strong>
            </p>

            {relatorioSelecionado.medicacoes && relatorioSelecionado.medicacoes.length > 0 ? (
              relatorioSelecionado.medicacoes.map((med, i) => {
                const diasTomados = med.dias_tomados || [];
                const diasNaoTomados = semana.filter((d) => !diasTomados.includes(d));

                return (
                  <div key={i} className="medicacaoItem">
                    <p className="medNome">{med.nome.toUpperCase()}</p>

                    {/* Contagem */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "10px", flexWrap: "wrap" }}>
                      <span style={{
                        background: "#e8f7ed", color: "#1f8a4c",
                        padding: "4px 10px", borderRadius: "8px",
                        fontSize: "13px", fontWeight: "700"
                      }}>
                        ✅ Tomou: {diasTomados.length} dia{diasTomados.length !== 1 ? "s" : ""}
                      </span>
                      <span style={{
                        background: "#ffe6e6", color: "#c0392b",
                        padding: "4px 10px", borderRadius: "8px",
                        fontSize: "13px", fontWeight: "700"
                      }}>
                        ❌ Não tomou: {diasNaoTomados.length} dia{diasNaoTomados.length !== 1 ? "s" : ""}
                      </span>
                    </div>

                    {/* Dias da semana */}
                    {semana.map((dia, j) => {
                      const tomou = diasTomados.includes(dia);
                      return (
                        <div key={j} style={{
                          display: "flex", alignItems: "center", gap: "8px",
                          marginTop: "6px", fontSize: "13px", fontWeight: "600",
                          color: tomou ? "#1f8a4c" : "#c0392b",
                        }}>
                          <span>{tomou ? "✅" : "❌"}</span>
                          <span>{dia}</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              <p style={{ textAlign: "left", fontSize: "13px", color: "#8aa596" }}>
                Nenhuma medicação informada
              </p>
            )}
          </div>
        </div>

        <button type="button" onClick={() => setRelatorioSelecionado(null)}>
          Voltar para lista
        </button>
      </>
    );
  }

  return (
    <>
      <h2>Relatórios Recebidos</h2>

      <div className="filtroRelatorio">
        <label htmlFor="filtroNome">Buscar por nome</label>
        <input
          id="filtroNome"
          type="text"
          placeholder="Digite o nome do paciente"
          value={filtroNome}
          onChange={(e) => setFiltroNome(e.target.value)}
        />
        {statusUnicos.length > 0 && (
          <>
            <label htmlFor="filtroStatus">Filtrar por status</label>
            <select
              id="filtroStatus"
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
            >
              <option value="">Todos os status</option>
              {statusUnicos.map((status, i) => (
                <option key={i} value={status}>{status}</option>
              ))}
            </select>
          </>
        )}
      </div>

      <div className="listaRelatorios">
        {relatoriosFiltrados.length === 0 ? (
          <p>Nenhum relatório encontrado.</p>
        ) : (
          relatoriosFiltrados.map((relatorio) => (
            <div
              className="cardRelatorio"
              key={relatorio.id}
              onClick={() => setRelatorioSelecionado(relatorio)}
            >
              <div className="topoRelatorio">
                <h3>{relatorio.nome_paciente || `Paciente #${relatorio.paciente_id}`}</h3>
                <div className="infoTopoRelatorio">
                  <span className="dataRelatorio">{formatarData(relatorio.data_envio)}</span>
                </div>
              </div>
              <p><strong>Como está:</strong> {relatorio.como_se_sente}</p>
              <p><strong>Hidratação:</strong> {relatorio.copos_agua} copos</p>
              <p><strong>Medicações:</strong> {relatorio.medicacoes ? relatorio.medicacoes.map((m) => m.nome).join(", ") : "Nenhuma"}</p>
              <p><strong>Observação:</strong> {relatorio.observacao || "—"}</p>
            </div>
          ))
        )}
      </div>

      <button type="button" onClick={() => setTela("home")}>
        Voltar
      </button>
    </>
  );
}

export default RelatoriosRecebidos;