"use client";

import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  InfoWindowF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Navigation2 } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "8px",
  border: "2px solid #e0e0e0",
};

export function MapView({ pets }) {
  const [selectedPet, setSelectedPet] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [locationFetched, setLocationFetched] = useState(false); // State untuk memeriksa apakah lokasi pengguna sudah diambil
  const center = { lat: -6.9175, lng: 107.6191 }; // Bandung center

  // Mendapatkan lokasi pengguna
  const getUserLocation = useCallback(async (e) => {
    e.preventDefault(); // Mencegah form submit dan refresh halaman
    if (navigator.geolocation) {
      // Tampilkan loading saat mengambil lokasi
      Swal.fire({
        title: "Mengambil Lokasi Anda",
        text: "Mohon tunggu sebentar...",
        icon: "info",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Menunggu lokasi pengguna dari geolocation API
      try {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setLocationFetched(true); // Lokasi berhasil diambil

            // Menambahkan delay 1 detik sebelum menutup SweetAlert
            setTimeout(() => {
              Swal.close(); // Menutup SweetAlert setelah sedikit jeda
            }, 1000); // Delay 1 detik
          },
          (error) => {
            console.error("Error getting location:", error);
            Swal.close();
            Swal.fire({
              icon: "error",
              title: "Lokasi Tidak Ditemukan",
              text: "Mohon aktifkan lokasi Anda terlebih dahulu.",
            });
          }
        );
      } catch (err) {
        console.error("Error getting location:", err);
        Swal.close();
        Swal.fire({
          icon: "error",
          title: "Geolocation Tidak Didukung",
          text: "Browser Anda tidak mendukung geolocation.",
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Geolocation Tidak Didukung",
        text: "Browser Anda tidak mendukung geolocation.",
      });
    }
  }, []);

  // Menghitung rute saat memilih pet
  const calculateRoute = useCallback(
    async (pet) => {
      if (!userLocation) {
        Swal.fire({
          icon: "warning",
          title: "Aktifkan Lokasi",
          text: "Mohon aktifkan lokasi Anda terlebih dahulu.",
        });
        return;
      }

      const directionsService = new google.maps.DirectionsService();

      try {
        const result = await directionsService.route({
          origin: userLocation,
          destination: {
            lat: Number(pet.latitude),
            lng: Number(pet.longitude),
          },
          travelMode: google.maps.TravelMode.DRIVING,
        });

        setDirections(result);
        // Mendapatkan jarak dalam kilometer
        const distanceInMeters = result.routes[0].legs[0].distance.value;
        const distanceInKm = (distanceInMeters / 1000).toFixed(1);
        setDistance(distanceInKm);
      } catch (error) {
        console.error("Error calculating route:", error);
        Swal.fire({
          icon: "error",
          title: "Gagal Menghitung Rute",
          text: "Terdapat kesalahan dalam menghitung rute.",
        });
      }
    },
    [userLocation]
  );

  const customMarkerIcon = {
    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
    fillColor: "#1e40af",
    fillOpacity: 1,
    strokeWeight: 1,
    strokeColor: "#ffffff",
    scale: 1.5,
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <div className="space-y-4">
        <div className="flex justify-end">
          <button
            onClick={getUserLocation}
            className="flex items-center gap-2 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
          >
            <Navigation2 className="w-4 h-4" />
            Gunakan Lokasi Saya
          </button>
        </div>

        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          options={{
            styles: [
              {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
              },
            ],
          }}
        >
          {/* Marker Lokasi Pengguna */}
          {userLocation && (
            <MarkerF
              position={userLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4CAF50",
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: "#ffffff",
              }}
            />
          )}

          {/* Pet markers */}
          {pets?.map((pet) => {
            if (pet.latitude && pet.longitude) {
              return (
                <MarkerF
                  key={pet.id}
                  position={{
                    lat: Number.parseFloat(pet.latitude),
                    lng: Number.parseFloat(pet.longitude),
                  }}
                  icon={customMarkerIcon}
                  onClick={() => {
                    setSelectedPet(pet);
                    calculateRoute(pet);
                  }}
                />
              );
            }
            return null;
          })}

          {/* Info window untuk pet yang dipilih */}
          {selectedPet && locationFetched && (
            <InfoWindowF
              position={{
                lat: Number.parseFloat(selectedPet.latitude),
                lng: Number.parseFloat(selectedPet.longitude),
              }}
              onCloseClick={() => {
                setSelectedPet(null);
                setDirections(null);
                setDistance(null);
              }}
            >
              <div className="p-3 max-w-[250px]">
                <div className="w-full h-24 relative mb-2">
                  <img
                    src={selectedPet.image || "/placeholder.svg"}
                    alt={selectedPet.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-bold text-lg mb-1">{selectedPet.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  Ras: {selectedPet.breed}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  Lokasi: {selectedPet.location}
                </p>
                {distance && (
                  <p className="text-sm font-semibold text-[#1e40af] mb-2">
                    Jarak: {distance} km dari lokasi Anda
                  </p>
                )}
                <div className="flex gap-2">
                  <a
                    href={`/pet-list/${selectedPet.type}s/${selectedPet.id}`}
                    className="flex-1 px-3 py-2 bg-[#1e40af] text-white text-center rounded-lg text-sm hover:bg-[#1e3a8a] transition-colors"
                  >
                    Lihat Detail
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPet.latitude},${selectedPet.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 border border-[#1e40af] text-[#1e40af] text-center rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  >
                    Rute
                  </a>
                </div>
              </div>
            </InfoWindowF>
          )}

          {/* Tampilkan rute jika tersedia */}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
}
