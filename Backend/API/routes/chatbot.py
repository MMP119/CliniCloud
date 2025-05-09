import os
import boto3
from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel

router = APIRouter()

# Inicializa el cliente de Lex V2
lex = boto3.client(
    "lexv2-runtime",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
)

class ChatRequest(BaseModel):
    session_id: str
    text: str

@router.post("/api/chat")
async def chat_endpoint(req: Request):
    # 1) Parseamos y validamos el body
    body = await req.json()
    try:
        payload = ChatRequest(**body)
    except Exception:
        raise HTTPException(400, "Body inválido. Debe ser { session_id, text }")

    # 2) Llamamos a Lex
    try:
        resp = lex.recognize_text(
            botId=os.getenv("LEX_BOT_ID"),
            botAliasId=os.getenv("LEX_ALIAS_ID"),
            localeId=os.getenv("LEX_LOCALE", "es_419"),
            sessionId=payload.session_id,
            text=payload.text
        )
    except Exception as e:
        print(f"Error al llamar a Lex: {e}")
        raise HTTPException(500, f"Error en Lex: {e}")

    # 3) Extraemos los mensajes
    messages = [
        {"contentType": m["contentType"], "content": m["content"]}
        for m in resp.get("messages", [])
    ]

    # Si no hay mensajes, respondemos con un mensaje por defecto
    if not messages:
        messages = [{"contentType": "PlainText", "content": "No se pudo procesar la solicitud."}]

    return {"messages": messages}
