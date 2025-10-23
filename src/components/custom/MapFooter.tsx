"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon, Marker as LeafletMarker } from "leaflet";
import { useEffect, useRef } from "react";

const mapPinSVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="red" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M21 10.344C21 18 12 22 12 22S3 18 3 10.344a9 9 0 0 1 18 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
`;
const mapPinIcon = new Icon({
  iconUrl: `data:image/svg+xml;utf8,${encodeURIComponent(mapPinSVG)}`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

const MAP_CENTER: [number, number] = [47.0193, 28.8356];

export default function PopupWithMarker() {
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    function tryOpenPopup() {
      if (markerRef.current) {
        markerRef.current.openPopup();
      } else {
        timeout = setTimeout(tryOpenPopup, 100);
      }
    }
    tryOpenPopup();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="h-[300px] w-full rounded-lg overflow-hidden shadow">
      <MapContainer
        center={MAP_CENTER}
        zoom={18}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={MAP_CENTER} icon={mapPinIcon} ref={markerRef}>
          <Popup>
            <div className="min-w-[120px] max-w-[260px]">
              <h4 className="text-lg font-bold mb-1 leading-tight">
                Phonetics Learning Center
              </h4>
              <p className="text-base font-medium">
                Strada Vasile Alecsandri 105,
                <br />
                Chișinău
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
