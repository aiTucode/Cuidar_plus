from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    data_nascimento = Column(String, nullable=False)
    endereco = Column(String, nullable=False)
    numero = Column(String, nullable=False)
    telefone = Column(String, nullable=False)
    cpf = Column(String, unique=True, nullable=False)
    senha_hash = Column(String, nullable=False)  # Nunca armazenamos a senha em texto puro
    responsavel = Column(String, nullable=True)
    doencas_cronicas = Column(String, nullable=True)

    relatorios = relationship("Relatorio", back_populates="paciente")


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    cargo = Column(String, nullable=False)
    cpf = Column(String, unique=True, nullable=False)
    senha_hash = Column(String, nullable=False)


class Relatorio(Base):
    __tablename__ = "relatorios"

    id = Column(Integer, primary_key=True, index=True)
    como_se_sente = Column(String, nullable=False)
    copos_agua = Column(Integer, nullable=False)
    medicacoes = Column(Text, nullable=True)  # Salvo como JSON string — SQLite não suporta listas
    observacao = Column(Text, nullable=True)
    status = Column(String, nullable=True, default="Estável")
    data_envio = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)
    paciente = relationship("Paciente", back_populates="relatorios")