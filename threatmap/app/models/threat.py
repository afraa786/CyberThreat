from pydantic import BaseModel
from typing import Optional, List

class ThreatIndicator(BaseModel):
    indicator: str
    type: str
    result: dict

class ThreatPulse(BaseModel):
    id: str
    name: str
    description: Optional[str]
    tags: List[str] = []
    adversary: Optional[str]
