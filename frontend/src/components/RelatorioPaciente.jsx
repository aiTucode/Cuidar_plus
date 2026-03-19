import { useState } from "react";
import { enviarRelatorio } from "../services/api";

function RelatorioPaciente({ setTela, pacienteId }) {
  const [comoSeSente, setComoSeSente] = useState("");
  const [coposAgua, setCoposAgua] = useState("");
  const [observacao, setObservacao] = useState("");
  const [medicacaoInput, setMedicacaoInput] = useState("");
  const [medicacoes, setMedicacoes] = useState([]);
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(false);

  function gerarSemana() {
    const hoje = new Date();
    const semana = [];
    for (let i = 0; i < 7; i++) {
      const data = new Date();
      data.setDate(hoje.getDate() - hoje.getDay() + i);
      semana.push(data.toLocaleDateString("pt-BR"));
    }
    return semana;
  }

  const semanaAtual = gerarSemana();

  function adicionarMedicacao() {
    if (medicacaoInput.trim() === "") return;
    setMedicacoes([...medicacoes, { nome: medicacaoInput, dias: [] }]);
    setMedicacaoInput("");
  }

  function removerMedicacao(index) {
    setMedicacoes(medicacoes.filter((_, i) => i !== index));
  }

  function toggleDia(medIndex, dia) {
    setMedicacoes((prev) =>
      prev.map((med, i) => {
        if (i !== medIndex) return med;
        const dias = med.dias.includes(dia)
          ? med.dias.filter((d) => d !== dia)
          : [...med.dias, dia];
        return { ...med, dias };
      })
    );
  }

  function validar() {
    if (!comoSeSente.trim()) return "Informe como está se sentindo.";
    if (!coposAgua || Number(coposAgua) < 0) return "Informe a quantidade de copos de água.";
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem({ texto: "", tipo: "" });

    const erro = validar();
    if (erro) {
      setMensagem({ texto: erro, tipo: "erro" });
      return;
    }

    setLoading(true);
    try {
      await enviarRelatorio({
        como_se_sente: comoSeSente,
        copos_agua: Number(coposAgua),
        medicacoes: medicacoes.map((m) => ({ nome: m.nome, dias_tomados: m.dias })),
        observacao,
        paciente_id: pacienteId,
      });
      setMensagem({ texto: "✅ Relatório enviado com sucesso!", tipo: "sucesso" });
      setComoSeSente(""); setCoposAgua(""); setObservacao(""); setMedicacoes([]);
    } catch (error) {
      setMensagem({ texto: error.message || "Erro ao enviar relatório.", tipo: "erro" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2>Relatório Semanal</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Como está se sentindo hoje?" value={comoSeSente} onChange={(e) => setComoSeSente(e.target.value)} />

        <div className="section">
          <p>Hidratação</p>
          <label>Quantos copos de água (350ml) você tomou hoje?</label>
          <input type="number" placeholder="Ex: 4" min="0" value={coposAgua} onChange={(e) => setCoposAgua(e.target.value)} />
        </div>

        <div className="section">
          <p>Medicações</p>
          <div className="addMedicacao">
            <input
              type="text"
              placeholder="Adicionar medicação"
              value={medicacaoInput}
              onChange={(e) => setMedicacaoInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); adicionarMedicacao(); } }}
            />
            <button type="button" onClick={adicionarMedicacao}>Adicionar</button>
          </div>

          {medicacoes.map((med, index) => (
            <div className="medicacaoItem" key={index}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p className="medNome">{med.nome.toUpperCase()}</p>
                <button
                  type="button"
                  onClick={() => removerMedicacao(index)}
                  style={{ width: "auto", padding: "4px 10px", fontSize: "12px", background: "#ffe6e6", color: "#c0392b", border: "1px solid #f5c6c6", borderRadius: "8px" }}
                >
                  Remover
                </button>
              </div>
              {semanaAtual.map((dia, i) => (
                <label key={i} className="diaMedicacao">
                  <input type="checkbox" checked={med.dias.includes(dia)} onChange={() => toggleDia(index, dia)} />
                  {dia}
                </label>
              ))}
            </div>
          ))}
        </div>

        <textarea placeholder="Observações (sintomas, dor, tontura, etc)" rows="4" value={observacao} onChange={(e) => setObservacao(e.target.value)} />

        <button type="submit" disabled={loading}>{loading ? "Enviando..." : "Enviar Relatório"}</button>
        <button type="button" onClick={() => setTela("home")}>Voltar</button>

        {mensagem.texto && (
          <p className={mensagem.tipo === "erro" ? "mensagem-erro" : "mensagem-sucesso"}>{mensagem.texto}</p>
        )}
      </form>
    </>
  );
}

export default RelatorioPaciente;