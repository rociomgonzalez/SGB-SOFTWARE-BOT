import os
from dotenv import load_dotenv

from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters
)

from responses import responder

load_dotenv()

async def inicio(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["modulo_actual"] = None

    respuesta, modulo = responder("hola")

    await update.message.reply_text(respuesta)


async def ayuda(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data["modulo_actual"] = None

    respuesta, modulo = responder("ayuda")

    await update.message.reply_text(respuesta)


async def recibir_mensaje(
    update: Update,
    context: ContextTypes.DEFAULT_TYPE
):
    texto = update.message.text

    modulo_actual = context.user_data.get("modulo_actual")

    respuesta, nuevo_modulo = responder(texto, modulo_actual)

    context.user_data["modulo_actual"] = nuevo_modulo

    await update.message.reply_text(respuesta)


def main():
    token = os.getenv("TELEGRAM_TOKEN") 

    if not token:
        print("ERROR: No se encontró el token de Telegram.")
        return

    aplicacion = Application.builder().token(token).build()

    aplicacion.add_handler(CommandHandler("start", inicio))
    aplicacion.add_handler(CommandHandler("ayuda", ayuda))
    aplicacion.add_handler(CommandHandler("menu", ayuda))

    aplicacion.add_handler(
        MessageHandler(
            filters.TEXT & ~filters.COMMAND,
            recibir_mensaje
        )
    )

    print("Asistente Virtual SGB iniciado correctamente.")

    aplicacion.run_polling()


if __name__ == "__main__":
    main()
