from math import radians, sin, cos, asin, sqrt
from typing import List, Dict, Any, Type, Optional
from flask_sqlalchemy import SQLAlchemy
from app.services.location_fetcher import get_location

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    d_lat = radians(lat2 - lat1)
    d_lon = radians(lon2 - lon1)
    lat1  = radians(lat1)
    lat2  = radians(lat2)
    a = sin(d_lat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(d_lon / 2) ** 2
    c = 2 * asin(sqrt(a))
    return R * c

def users_within_radius(
    db: SQLAlchemy,
    location_addr: bool,
    address: Optional[str],
    lat: Optional[float],
    lon: Optional[float],
    radius_km: float,
    user_model: Type[Any],
) -> List[Dict[str, Any]]:
    if location_addr:
        if not address:
            raise ValueError("Address is required when location_addr is True.")
        target: Optional[tuple] = get_location(address)
        if target is None:
            raise ValueError("Unable to geocode the supplied address.")
        tgt_lat, tgt_lon = target
    else:
        if lat is None or lon is None:
            raise ValueError("Latitude and longitude are required when location_addr is False.")
        tgt_lat, tgt_lon = lat, lon

    # Bounding‑box pre‑filter ------------------------------------------------
    DEG_KM = 111.32
    delta_lat = radius_km / DEG_KM
    delta_lon = radius_km / (DEG_KM * cos(radians(tgt_lat)))

    prelim_q = (
        db.session.query(user_model)
        .filter(user_model.lat.between(tgt_lat - delta_lat, tgt_lat + delta_lat))
        .filter(user_model.lon.between(tgt_lon - delta_lon, tgt_lon + delta_lon))
        .filter(user_model.role != "admin")
    )

    # Exact Haversine filter -------------------------------------------------
    matches: List[Dict[str, Any]] = []
    for user in prelim_q:
        if user.lat is None or user.lon is None:
            continue
        dist = haversine_km(tgt_lat, tgt_lon, user.lat, user.lon)
        if dist <= radius_km:
            matches.append({"user": user, "distance_km": round(dist, 2)})

    return sorted(matches, key=lambda x: x["distance_km"])