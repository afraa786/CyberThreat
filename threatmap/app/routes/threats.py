from fastapi import APIRouter, Query
from app.otx_client import get_ip_threat, get_domain_threat, get_latest_pulses

router = APIRouter(prefix="/threats", tags=["Threat Intelligence"])

@router.get("/ip/{ip}")
async def check_ip(ip: str):
    """Check if IP is malicious"""
    return await get_ip_threat(ip)

@router.get("/domain/{domain}")
async def check_domain(domain: str):
    """Check if Domain is malicious"""
    return await get_domain_threat(domain)

@router.get("/map")
async def live_threat_map(limit: int = Query(10, ge=1, le=50)):
    """Get latest threat pulses (for live threat map)"""
    return await get_latest_pulses(limit)
