import re
import json

# Carrega o dicionário exportado do Colab
with open("modelo_cuidar.json", "r", encoding="utf-8") as f:
    modelo = json.load(f)

DICIONARIO = modelo["dicionario"]
AMPLIFICADORES = modelo["amplificadores"]
LIMIARES = modelo["limiares"]


def normalizar_texto(texto):
    texto = texto.lower().strip()
    texto = re.sub(r'[^a-z0-9 ]', ' ', texto)
    texto = re.sub(r'\s+', ' ', texto)
    return texto


def tem_amplificador_proximo(texto, posicao, janela=3):
    palavras = texto.split()
    inicio = max(0, posicao - janela)
    fim = min(len(palavras), posicao + janela)
    trecho = ' '.join(palavras[inicio:fim])
    return any(amp in trecho for amp in AMPLIFICADORES)


def analisar_risco(como_se_sente, observacao=""):
    texto = f"{como_se_sente} {observacao}".strip()
    texto_normalizado = normalizar_texto(texto)
    pontuacao = 0
    texto_restante = texto_normalizado

    for expressao, peso in sorted(DICIONARIO.items(), key=lambda x: len(x[0]), reverse=True):
        expressao_norm = normalizar_texto(expressao)
        if expressao_norm in texto_restante:
            posicao = len(texto_restante[:texto_restante.find(expressao_norm)].split())
            if peso > 0 and tem_amplificador_proximo(texto_normalizado, posicao):
                peso_final = peso + 1
            else:
                peso_final = peso
            pontuacao += peso_final
            texto_restante = texto_restante.replace(expressao_norm, ' ')

    if pontuacao <= LIMIARES["baixo"]:
        return "BAIXO"
    elif pontuacao <= LIMIARES["medio"]:
        return "MEDIO"
    else:
        return "ALTO"