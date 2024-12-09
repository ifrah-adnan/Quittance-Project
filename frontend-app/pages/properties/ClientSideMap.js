"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

const ClientSideMap = ({ position, name, address, city }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/images/marker-icon-2x.png",
          iconUrl: "/images/marker-icon.png",
          shadowUrl: "/images/marker-shadow.png",
        });
      });
    }
  }, []);

  useEffect(() => {
    if (map) {
      map.setView(position, 16);
    }
  }, [map, position]);

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <MapContainer
      center={position}
      zoom={16}
      style={{ height: "400px", width: "100%" }}
      whenCreated={setMap}
    >
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

export default ClientSideMap;
