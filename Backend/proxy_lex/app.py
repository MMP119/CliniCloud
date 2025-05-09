# lambda-chat-proxy/app.py
import os, json
import boto3

lex = boto3.client(
    "lexv2-runtime",
    region_name=os.environ["MY_AWS_REGION"]
)

def lambda_handler(event, context):
    # Leer body
    body = json.loads(event.get("body","{}"))
    session = body.get("session_id")
    text    = body.get("text")
    if not session or not text:
        return {
            "statusCode": 400,
            "body": json.dumps({"error":"Falta session_id o text"})
        }

    # Llamar a Lex
    resp = lex.recognize_text(
        botId=os.environ["LEX_BOT_ID"],
        botAliasId=os.environ["LEX_ALIAS_ID"],
        localeId=os.environ.get("LEX_LOCALE","es_ES"),
        sessionId=session,
        text=text
    )

    # Extraer mensajes
    messages = [
      {"contentType": m["contentType"], "content": m["content"]}
      for m in resp.get("messages",[])
    ]

    return {
      "statusCode": 200,
      "headers": {
        "Content-Type":                "application/json",
        "Access-Control-Allow-Origin": "*",         # o tu dominio
        "Access-Control-Allow-Methods":"OPTIONS,POST",
        "Access-Control-Allow-Headers":"Content-Type"
      },
      "body": json.dumps({"messages":messages})
    }