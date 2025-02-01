import { useState } from "react";

export function useUserLocation() {
  const [userLocation, setUserLocation] = useState(null);

  const showUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Tidak dapat mengakses lokasi Anda. Pastikan izin diberikan.");
        }
      );
    } else {
      alert("Geolocation tidak didukung oleh browser Anda.");
    }
  };

  const mapUrl = userLocation
    ? `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${userLocation.latitude},${userLocation.longitude}&zoom=15`
    : `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=Bandung,Indonesia&zoom=12`;

  return {
    userLocation,
    showUserLocation,
    mapUrl,
  };
}
