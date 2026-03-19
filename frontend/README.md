<div align="center">

<img src="https://img.shields.io/badge/status-em%20desenvolvimento-yellow?style=for-the-badge" />
<img src="https://img.shields.io/badge/python-3.11+-blue?style=for-the-badge&logo=python&logoColor=white" />
<img src="https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
<img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
<img src="https://img.shields.io/badge/Vite-5+-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
<img src="https://img.shields.io/badge/licença-MIT-green?style=for-the-badge" />

# 💙 Cuidar+

### Tecnologia e cuidado a serviço da saúde pública

*Um sistema web desenvolvido por um Agente Comunitário de Saúde para aproximar pacientes do SUS das informações que precisam — de forma simples, acolhedora e acessível.*

</div>

---

## 📖 Sobre o projeto

O **Cuidar+** nasceu da experiência prática de **3 anos como Agente Comunitário de Saúde**. Na rotina do SUS, ficou clara a necessidade de uma ferramenta que permitisse aos pacientes registrarem e acompanharem suas próprias informações de saúde de forma autônoma e intuitiva.

Mais do que um sistema técnico, o Cuidar+ é uma ponte entre a tecnologia e o cuidado humano — com uma interface pensada para ser acolhedora, acessível e fácil de usar, especialmente para pessoas que precisam de acompanhamento contínuo.

> 💡 *"Criado por quem conhece a realidade dos pacientes do SUS por dentro."*

---

## ✨ Funcionalidades atuais

| Funcionalidade | Status |
|---|---|
| 🎨 Interface visual e intuitiva | ✅ Disponível |
| 🔐 Tela de Login | ✅ Disponível |
| 👤 Cadastro de pacientes | ✅ Disponível |
| 🏠 Tela Home | ✅ Disponível |
| 📋 Relatório do paciente | ✅ Disponível |
| 📥 Relatórios recebidos | ✅ Disponível |
| 🗄️ Banco de dados SQLite | ✅ Disponível |
| 🔗 Integração front-end / back-end | ✅ Disponível |
| 💧 Área de hidratação | ✅ Disponível |
| 💊 Área de medicações | ✅ Disponível |

---

## 🚀 Melhorias planejadas

- [ ] 📊 Análise preditiva de saúde
- [ ] 📱 Responsividade para dispositivos móveis
- [ ] 📅 Histórico completo do paciente
- [ ] 🔔 Alertas e lembretes visuais
- [ ] 🎞️ Animações interativas na interface
- [ ] ☁️ Deploy em produção

---

## 🛠️ Tecnologias utilizadas

### Front-end
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

### Back-end
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)

---

## 📂 Estrutura do projeto

```
cuidar-plus/
├── backend/                    # API com FastAPI + Python
│   ├── main.py                 # Entrada da aplicação
│   ├── database.py             # Configuração do banco de dados
│   ├── models.py               # Modelos de dados
│   ├── schemas.py              # Schemas de validação (Pydantic)
│   ├── cuidar.db               # Banco de dados SQLite
│   └── venv/                   # Ambiente virtual Python
│
├── frontend/                   # Aplicação React + Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── Cadastro.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── RelatorioPaciente.jsx
│   │   │   └── RelatoriosRecebidos.jsx
│   │   ├── services/           # Integração com a API
│   │   ├── assets/             # Imagens e recursos estáticos
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
└── README.md
```

---

## ⚙️ Como executar o projeto

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Python](https://www.python.org/) (versão 3.11 ou superior)
- [Git](https://git-scm.com/)

---

### 1. Clonar o repositório

```bash
git clone https://github.com/SEU_USUARIO/cuidar-plus.git
cd cuidar-plus
```

---

### 2. Executar o back-end

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

A API estará disponível em: `http://localhost:8000`  
Documentação automática: `http://localhost:8000/docs`

---

### 3. Executar o front-end

```bash
cd frontend
npm install
npm run dev
```

A aplicação estará disponível em: `http://localhost:5173`

---

## 👨‍💻 Autor

Desenvolvido com 💙 por um estudante de **Inteligência Artificial Aplicada — PUC PR** e **Agente Comunitário de Saúde**.

A combinação dessas duas realidades é o que torna o Cuidar+ um projeto único: tecnologia desenvolvida por quem vive o problema.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

⭐ Se este projeto te inspirou, deixa uma estrela no repositório!

</div>