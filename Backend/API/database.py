import aiomysql
from dotenv import load_dotenv
import os

load_dotenv(".env")

db_host = os.getenv("DB_HOST")
db_port = int(os.getenv("DB_PORT"))
db_user = os.getenv("DB_USER")
db_password = os.getenv("DB_PASSWORD")
db_name = os.getenv("DB_NAME")


async def get_db_pool(app):
    if not hasattr(app.state, "db_pool"): 
        app.state.db_pool = await aiomysql.create_pool(
            host=db_host,  
            port=db_port, 
            user=db_user, 
            password=db_password,  
            db=db_name, 
            autocommit=True 
        )
    return app.state.db_pool