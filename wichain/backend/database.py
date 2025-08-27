from sqlalchemy.exc import IntegrityError

def save_network(session, network_data):
    try:
        session.add(network_data)
        session.commit()
    except IntegrityError:
        session.rollback()
        # Agar BSSID pehle se hai to update kar
        existing = session.query(WifiNetwork).filter_by(bssid=network_data.bssid).first()
        if existing:
            existing.signal_strength = network_data.signal_strength
            existing.timestamp = network_data.timestamp
            existing.is_spoof = network_data.is_spoof
            existing.vendor = network_data.vendor
            existing.features = network_data.features
            session.commit()
