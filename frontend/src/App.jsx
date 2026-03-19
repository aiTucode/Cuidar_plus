import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";

import Home from "./components/Home";
import Cadastro from "./components/Cadastro";
import Login from "./components/Login";
import RelatorioPaciente from "./components/RelatorioPaciente";
import RelatoriosRecebidos from "./components/RelatoriosRecebidos";

const TELAS_SEM_CABECALHO = ["home", "cadastro", "login"];

function App() {
  const [tela, setTela] = useState("home");
  const [usuario, setUsuario] = useState(null);

  function handleLogout() {
    setUsuario(null);
    setTela("home");
  }

  return (
    <div className="container">
      <AnimatePresence mode="wait">
        <motion.div
          key={tela}
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
        >
          {usuario && !TELAS_SEM_CABECALHO.includes(tela) && (
            <div className="usuarioLogado">
              <span>👤 {usuario.nome}{usuario.cargo ? ` — ${usuario.cargo}` : ""}</span>
              <button type="button" className="btnLogout" onClick={handleLogout}>
                Sair
              </button>
            </div>
          )}

          {tela === "home" && <Home setTela={setTela} />}
          {tela === "cadastro" && <Cadastro setTela={setTela} />}
          {tela === "login" && <Login setTela={setTela} setUsuario={setUsuario} />}

          {tela === "relatorioPaciente" && usuario?.tipo === "paciente" && (
            <RelatorioPaciente
              setTela={setTela}
              pacienteId={usuario.id}
              medicacoesFixas={usuario.medicacoes_fixas || []}
            />
          )}
          {tela === "relatorioPaciente" && usuario?.tipo !== "paciente" && (
            <p className="mensagem-erro">Acesso restrito a pacientes.</p>
          )}

          {tela === "relatoriosRecebidos" && usuario?.tipo === "admin" && (
            <RelatoriosRecebidos setTela={setTela} />
          )}
          {tela === "relatoriosRecebidos" && usuario?.tipo !== "admin" && (
            <p className="mensagem-erro">Acesso restrito a administradores.</p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;