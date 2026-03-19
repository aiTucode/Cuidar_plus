import logo from "../assets/logo.png";

function Home({ setTela }) {
  return (
    <>
      <img src={logo} alt="Cuidar+" className="logo" />
      <p>Sistema De Acompanhamento</p>

      <div className="buttons">
        <button onClick={() => setTela("login")}>Entrar</button>
        <button onClick={() => setTela("cadastro")}>Cadastrar</button>
      </div>
    </>
  );
}

export default Home;