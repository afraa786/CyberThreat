from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import threats

app = FastAPI(title="CyberThreat Intelligence API")

# ✅ Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include your router
app.include_router(threats.router)

@app.get("/")
def root():
    return {"message": "CyberThreat API is running 🚀"}
