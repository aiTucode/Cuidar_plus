const BASE_URL = "http://127.0.0.1:8000";

export async function cadastrarPaciente(dadosPaciente) {
  const resposta = await fetch(`${BASE_URL}/pacientes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosPaciente),
  });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.detail || "Erro ao cadastrar paciente.");
  return dados;
}

export async function buscarPaciente(id) {
  const resposta = await fetch(`${BASE_URL}/pacientes/${id}`);
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.detail || "Erro ao buscar paciente.");
  return dados;
}

export async function login({ cpf, senha }) {
  const resposta = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpf, senha }),
  });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.detail || "CPF ou senha incorretos.");
  return dados;
}

export async function enviarRelatorio(relatorio) {
  const resposta = await fetch(`${BASE_URL}/relatorios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(relatorio),
  });
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.detail || "Erro ao enviar relatório.");
  return dados;
}

export async function buscarRelatorios() {
  const resposta = await fetch(`${BASE_URL}/relatorios`);
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.detail || "Erro ao buscar relatórios.");
  return dados;
}

export async function buscarRelatoriosPaciente(pacienteId) {
  const resposta = await fetch(`${BASE_URL}/relatorios/${pacienteId}`);
  const dados = await resposta.json();
  if (!resposta.ok) throw new Error(dados.detail || "Erro ao buscar relatórios.");
  return dados;
}