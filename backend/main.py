import json
import bcrypt
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from database import SessionLocal, engine, Base
from models import Paciente, Admin, Relatorio
from schemas import (
    PacienteCreate, PacienteResponse,
    RelatorioCreate, RelatorioResponse,
    LoginRequest, LoginResponse,
)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cuidar+ API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def hash_senha(senha: str) -> str:
    return bcrypt.hashpw(senha.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verificar_senha(senha: str, hash: str) -> bool:
    return bcrypt.checkpw(senha.encode("utf-8"), hash.encode("utf-8"))


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Troque os CPFs e senhas antes de usar em produção
ADMINS_FIXOS = [
    {"nome": "Túlio",      "cargo": "ACS",        "cpf": "00000000001", "senha": "admin123"},
    {"nome": "Enfermeira", "cargo": "Enfermeira",  "cpf": "00000000002", "senha": "admin123"},
    {"nome": "Médica",     "cargo": "Médica",      "cpf": "00000000003", "senha": "admin123"},
    {"nome": "Técnica",    "cargo": "Técnica",     "cpf": "00000000004", "senha": "admin123"},
]


@app.on_event("startup")
def criar_admins_fixos():
    db = SessionLocal()
    try:
        for admin_data in ADMINS_FIXOS:
            existe = db.query(Admin).filter(Admin.cpf == admin_data["cpf"]).first()
            if not existe:
                db.add(Admin(
                    nome=admin_data["nome"],
                    cargo=admin_data["cargo"],
                    cpf=admin_data["cpf"],
                    senha_hash=hash_senha(admin_data["senha"]),
                ))
        db.commit()
    finally:
        db.close()


def serializar_medicacoes(medicacoes):
    if not medicacoes:
        return None
    return json.dumps([m.model_dump() for m in medicacoes], ensure_ascii=False)


def desserializar_medicacoes(texto):
    if not texto:
        return None
    return json.loads(texto)


def relatorio_para_response(relatorio):
    return {
        "id": relatorio.id,
        "como_se_sente": relatorio.como_se_sente,
        "copos_agua": relatorio.copos_agua,
        "medicacoes": desserializar_medicacoes(relatorio.medicacoes),
        "observacao": relatorio.observacao,
        "status": relatorio.status,
        "data_envio": relatorio.data_envio,
        "paciente_id": relatorio.paciente_id,
        "nome_paciente": relatorio.paciente.nome if relatorio.paciente else None,
    }


@app.get("/")
def rota_inicial():
    return {"mensagem": "Backend do Cuidar+ funcionando"}


@app.post("/auth/login", response_model=LoginResponse)
def login(dados: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.cpf == dados.cpf).first()
    if admin:
        if not verificar_senha(dados.senha, admin.senha_hash):
            raise HTTPException(status_code=401, detail="CPF ou senha incorretos.")
        return {"tipo": "admin", "id": admin.id, "nome": admin.nome, "cargo": admin.cargo}

    paciente = db.query(Paciente).filter(Paciente.cpf == dados.cpf).first()
    if paciente:
        if not verificar_senha(dados.senha, paciente.senha_hash):
            raise HTTPException(status_code=401, detail="CPF ou senha incorretos.")
        return {"tipo": "paciente", "id": paciente.id, "nome": paciente.nome, "cargo": None}

    raise HTTPException(status_code=401, detail="CPF ou senha incorretos.")


@app.post("/pacientes", response_model=PacienteResponse)
def criar_paciente(paciente: PacienteCreate, db: Session = Depends(get_db)):
    if db.query(Paciente).filter(Paciente.cpf == paciente.cpf).first():
        raise HTTPException(status_code=400, detail="CPF já cadastrado.")
    dados = paciente.model_dump()
    senha_plain = dados.pop("senha")
    novo_paciente = Paciente(**dados, senha_hash=hash_senha(senha_plain))
    db.add(novo_paciente)
    db.commit()
    db.refresh(novo_paciente)
    return novo_paciente


@app.get("/pacientes", response_model=list[PacienteResponse])
def listar_pacientes(db: Session = Depends(get_db)):
    return db.query(Paciente).all()


@app.get("/pacientes/{paciente_id}", response_model=PacienteResponse)
def buscar_paciente(paciente_id: int, db: Session = Depends(get_db)):
    paciente = db.query(Paciente).filter(Paciente.id == paciente_id).first()
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado.")
    return paciente


@app.post("/relatorios", response_model=RelatorioResponse)
def criar_relatorio(relatorio: RelatorioCreate, db: Session = Depends(get_db)):
    if not db.query(Paciente).filter(Paciente.id == relatorio.paciente_id).first():
        raise HTTPException(status_code=404, detail="Paciente não encontrado.")
    dados = relatorio.model_dump()
    dados["medicacoes"] = serializar_medicacoes(relatorio.medicacoes)
    novo_relatorio = Relatorio(**dados)
    db.add(novo_relatorio)
    db.commit()
    db.refresh(novo_relatorio)
    return relatorio_para_response(novo_relatorio)


@app.get("/relatorios", response_model=list[RelatorioResponse])
def listar_relatorios(db: Session = Depends(get_db)):
    return [relatorio_para_response(r) for r in db.query(Relatorio).all()]


@app.get("/relatorios/paciente/{paciente_id}", response_model=list[RelatorioResponse])
def relatorios_por_paciente(paciente_id: int, db: Session = Depends(get_db)):
    relatorios = db.query(Relatorio).filter(Relatorio.paciente_id == paciente_id).all()
    return [relatorio_para_response(r) for r in relatorios]


@app.patch("/relatorios/{relatorio_id}/status")
def atualizar_status(relatorio_id: int, body: dict, db: Session = Depends(get_db)):
    relatorio = db.query(Relatorio).filter(Relatorio.id == relatorio_id).first()
    if not relatorio:
        raise HTTPException(status_code=404, detail="Relatório não encontrado.")
    relatorio.status = body.get("status")
    db.commit()
    return {"mensagem": "Status atualizado."}