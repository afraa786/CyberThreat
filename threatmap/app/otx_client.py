import httpx
from app.config import settings

BASE_URL = "https://otx.alienvault.com/api/v1"

async def get_ip_threat(ip: str):
    url = f"{BASE_URL}/indicators/IPv4/{ip}/general"
    headers = {"X-OTX-API-KEY": settings.OTX_API_KEY}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

async def get_domain_threat(domain: str):
    url = f"{BASE_URL}/indicators/domain/{domain}/general"
    headers = {"X-OTX-API-KEY": settings.OTX_API_KEY}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        response.raise_for_status()
        return response.json()

async def get_latest_pulses(limit: int = 10):
    """Fetch latest threat pulses (for threat map)"""
    url = f"{BASE_URL}/pulses/subscribed"
    headers = {"X-OTX-API-KEY": settings.OTX_API_KEY}
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers, params={"limit": limit})
        response.raise_for_status()
        return response.json()
