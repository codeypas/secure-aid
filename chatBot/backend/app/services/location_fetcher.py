from geopy.geocoders import Nominatim
geolocator = Nominatim(user_agent="disaster_management_app")

def get_location(address: str) -> tuple:
    location = geolocator.geocode(address)
    if location:
        return (location.latitude, location.longitude)
    else:
        return None