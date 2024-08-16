import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ position, name, address, city }) => {
  // Personnaliser l'icône du marqueur
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "/images/marker-icon-2x.png",
      iconUrl: "/images/marker-icon.png",
      shadowUrl: "/images/marker-shadow.png",
    });
  }, []);

  // Fonction pour recentrer la carte et ajuster le zoom
  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={16} // Zoom plus proche pour centrer directement sur l'emplacement
      style={{ height: "400px", width: "100%" }}
    >
      <ChangeView center={position} zoom={16} /> {/* Récentre la carte */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          {name}
          <br />
          {address}, {city}
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
