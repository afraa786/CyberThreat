import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    OTX_API_KEY: str = os.getenv("OTX_API_KEY", "")

settings = Settings()
