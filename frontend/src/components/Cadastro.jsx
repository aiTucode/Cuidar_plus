import { useState } from "react";
import { cadastrarPaciente } from "../services/api";

const DOENCAS_FIXAS = ["Diabetes", "Hipertensão", "Asma", "Cardiopatia"];

function Cadastro({ setTela }) {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [temResponsavel, setTemResponsavel] = useState(null);
  const [nomeResponsavel, setNomeResponsavel] = useState("");
  const [doencasSelecionadas, setDoencasSelecionadas] = useState([]);
  const [outrasDoencas, setOutrasDoencas] = useState(false);
  const [qualDoenca, setQualDoenca] = useState("");
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(false);

  function toggleDoenca(doenca) {
    setDoencasSelecionadas((prev) =>
      prev.includes(doenca) ? prev.filter((d) => d !== doenca) : [...prev, doenca]
    );
  }

  function formatarCpf(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
  }

  function validar() {
    if (!nome.trim()) return "Informe o nome completo.";
    if (!dataNascimento) return "Informe a data de nascimento.";
    if (!endereco.trim()) return "Informe o endereço.";
    if (!numero) return "Informe o número da casa.";
    if (!telefone.trim()) return "Informe o telefone.";
    if (cpf.replace(/\D/g, "").length !== 11) return "CPF inválido.";
    if (senha.length < 6) return "A senha deve ter pelo menos 6 caracteres.";
    if (senha !== confirmarSenha) return "As senhas não coincidem.";
    if (temResponsavel === null) return "Informe se possui responsável.";
    if (temResponsavel && !nomeResponsavel.trim()) return "Informe o nome do responsável.";
    if (outrasDoencas && !qualDoenca.trim()) return "Informe qual outra doença.";
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

    const todasDoencas = [
      ...doencasSelecionadas,
      ...(outrasDoencas && qualDoenca ? [qualDoenca] : []),
    ];

    const dadosPaciente = {
      nome,
      data_nascimento: dataNascimento,
      endereco,
      numero,
      telefone,
      cpf: cpf.replace(/\D/g, ""),
      senha,
      responsavel: temResponsavel ? nomeResponsavel : null,
      doencas_cronicas: todasDoencas.length > 0 ? todasDoencas.join(", ") : null,
    };

    setLoading(true);
    try {
      await cadastrarPaciente(dadosPaciente);
      setMensagem({ texto: "✅ Paciente cadastrado com sucesso!", tipo: "sucesso" });
      setNome(""); setDataNascimento(""); setEndereco(""); setNumero("");
      setTelefone(""); setCpf(""); setSenha(""); setConfirmarSenha("");
      setTemResponsavel(null); setNomeResponsavel("");
      setDoencasSelecionadas([]); setOutrasDoencas(false); setQualDoenca("");
    } catch (error) {
      setMensagem({ texto: error.message || "Erro ao cadastrar.", tipo: "erro" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2>Cadastro de Paciente</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome completo" value={nome} onChange={(e) => setNome(e.target.value)} />
        <input type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} />
        <input type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
        <input type="number" placeholder="Número da casa" value={numero} onChange={(e) => setNumero(e.target.value)} />
        <input type="tel" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <input type="text" placeholder="CPF" maxLength="14" value={cpf} onChange={(e) => setCpf(formatarCpf(e.target.value))} />
        <input type="password" placeholder="Senha (mínimo 6 caracteres)" value={senha} onChange={(e) => setSenha(e.target.value)} />
        <input type="password" placeholder="Confirmar senha" value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)} />

        <div className="section">
          <p>Possui responsável?<br /><br />*Preenchimento Obrigatório*</p>
          <label>
            <input type="radio" name="responsavel" checked={temResponsavel === true} onChange={() => setTemResponsavel(true)} />
            Sim
          </label>
          <label>
            <input type="radio" name="responsavel" checked={temResponsavel === false} onChange={() => setTemResponsavel(false)} />
            Não
          </label>
        </div>

        {temResponsavel && (
          <input type="text" placeholder="Nome do responsável" value={nomeResponsavel} onChange={(e) => setNomeResponsavel(e.target.value)} />
        )}

        <div className="section">
          <p>Doenças crônicas</p>
          {DOENCAS_FIXAS.map((doenca) => (
            <label key={doenca}>
              <input type="checkbox" checked={doencasSelecionadas.includes(doenca)} onChange={() => toggleDoenca(doenca)} />
              {doenca}
            </label>
          ))}
          <label>
            <input type="checkbox" checked={outrasDoencas} onChange={(e) => { setOutrasDoencas(e.target.checked); if (!e.target.checked) setQualDoenca(""); }} />
            Outras
          </label>
          {outrasDoencas && (
            <input type="text" placeholder="Qual doença?" value={qualDoenca} onChange={(e) => setQualDoenca(e.target.value)} />
          )}
        </div>

        <button type="submit" disabled={loading}>{loading ? "Cadastrando..." : "Cadastrar Paciente"}</button>
        <button type="button" onClick={() => setTela("home")}>Voltar</button>

        {mensagem.texto && (
          <p className={mensagem.tipo === "erro" ? "mensagem-erro" : "mensagem-sucesso"}>
            {mensagem.texto}
          </p>
        )}
      </form>
    </>
  );
}

export default Cadastro;