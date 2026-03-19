import { useState } from "react";
import { login } from "../services/api";

function Login({ setTela, setUsuario }) {
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(false);

  function formatarCpf(valor) {
    valor = valor.replace(/\D/g, "");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
    valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return valor;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMensagem({ texto: "", tipo: "" });

    if (cpf.replace(/\D/g, "").length !== 11) {
      setMensagem({ texto: "CPF inválido. Digite os 11 dígitos.", tipo: "erro" });
      return;
    }
    if (!senha.trim()) {
      setMensagem({ texto: "Informe a senha.", tipo: "erro" });
      return;
    }

    setLoading(true);
    try {
      const resposta = await login({ cpf: cpf.replace(/\D/g, ""), senha });
      setUsuario(resposta);
      if (resposta.tipo === "admin") {
        setTela("relatoriosRecebidos");
      } else {
        setTela("relatorioPaciente");
      }
    } catch (error) {
      setMensagem({ texto: error.message || "CPF ou senha incorretos.", tipo: "erro" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h2>Entrar</h2>
      <form className="form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="CPF"
          maxLength="14"
          value={cpf}
          onChange={(e) => setCpf(formatarCpf(e.target.value))}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <button type="button" onClick={() => setTela("home")}>
          Voltar
        </button>
        {mensagem.texto && (
          <p className={mensagem.tipo === "erro" ? "mensagem-erro" : "mensagem-sucesso"}>
            {mensagem.texto}
          </p>
        )}
      </form>
    </>
  );
}

export default Login;