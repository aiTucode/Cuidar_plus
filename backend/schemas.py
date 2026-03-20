from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class MedicacaoItem(BaseModel):
    nome: str
    dias_tomados: List[str] = []


class PacienteCreate(BaseModel):
    nome: str
    data_nascimento: str
    endereco: str
    numero: str
    telefone: str
    cpf: str
    senha: str
    responsavel: Optional[str] = None
    doencas_cronicas: Optional[str] = None


class PacienteResponse(BaseModel):
    id: int
    nome: str
    data_nascimento: str
    endereco: str
    numero: str
    telefone: str
    cpf: str
    responsavel: Optional[str] = None
    doencas_cronicas: Optional[str] = None

    class Config:
        from_attributes = True


class RelatorioCreate(BaseModel):
    como_se_sente: str
    copos_agua: int
    medicacoes: Optional[List[MedicacaoItem]] = None
    observacao: Optional[str] = None
    status: Optional[str] = "Estável"
    paciente_id: int


class RelatorioResponse(BaseModel):
    id: int
    como_se_sente: str
    copos_agua: int
    medicacoes: Optional[List[MedicacaoItem]] = None
    observacao: Optional[str] = None
    status: Optional[str] = None
    data_envio: datetime
    paciente_id: int
    nome_paciente: Optional[str] = None

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    cpf: str
    senha: str


class LoginResponse(BaseModel):
    tipo: str
    id: int
    nome: str
    cargo: Optional[str] = None