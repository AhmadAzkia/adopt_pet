import Image from "next/image";
import { MapPin, MessageCircle } from "lucide-react";
import Swal from "sweetalert2";

// Fungsi untuk mengecek apakah pengguna sudah login menggunakan JWT
const isUserLoggedIn = () => {
  const token = localStorage.getItem("token"); // Mengambil token dari localStorage
  if (token) {
    try {
      // Decode token (hanya contoh, pastikan JWT Anda didecode dengan benar sesuai format)
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload && payload.id ? true : false;
    } catch (error) {
      return false;
    }
  }
  return false;
};

export function CatCard({ cat }) {
  const handleContactOwner = () => {
    // Jika belum login, tampilkan SweetAlert untuk login
    if (!isUserLoggedIn()) {
      Swal.fire({
        icon: "info",
        title: "Login Dulu!",
        text: "Anda harus login terlebih dahulu untuk menghubungi pemilik hewan.",
        confirmButtonText: "Login Sekarang",
        showCancelButton: true,
        cancelButtonText: "Batal",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login"; // Arahkan pengguna ke halaman login
        }
      });
      return;
    }

    if (!cat.user_phone) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Nomor WhatsApp pemilik tidak tersedia",
        confirmButtonText: "OK",
      });
      return;
    }

    // Format phone number
    let phoneNumber = cat.user_phone.replace(/\D/g, ""); // Remove non-digits

    // Ensure number starts with 62
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "62" + phoneNumber.slice(1);
    } else if (!phoneNumber.startsWith("62")) {
      phoneNumber = "62" + phoneNumber;
    }

    // Format message
    const message = `Halo, saya tertarik dengan kucing ${cat.name} yang Anda tawarkan untuk adopsi. Bisakah kita diskusikan lebih lanjut?`;

    // Create WhatsApp URL for mobile and web
    const whatsappUrlMobile = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    const whatsappUrlWeb = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Detect platform (mobile or desktop) and open WhatsApp directly
    const isMobile =
      window.navigator.userAgent.match(/Android/i) ||
      window.navigator.userAgent.match(/iPhone/i);

    if (isMobile) {
      // Mobile platform: open WhatsApp app directly
      window.location.href = whatsappUrlMobile;
    } else {
      // Desktop platform: fallback to WhatsApp web
      const newWindow = window.open(whatsappUrlWeb, "_blank");
      if (!newWindow) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Browser Anda tidak mendukung pembukaan WhatsApp secara otomatis. Silakan coba buka WhatsApp secara manual.",
        });
      }
    }
  };

  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="relative aspect-square">
        <Image
          src={cat.image || "/placeholder.svg"}
          alt={cat.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{cat.name}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {cat.location}
          </p>
          <p>Ras: {cat.breed}</p>
          <p>Usia: {cat.age} tahun</p>
          <p>Jenis Kelamin: {cat.gender === "male" ? "Jantan" : "Betina"}</p>
        </div>
      </div>
      <div className="p-4 pt-0 flex gap-3">
        <button
          onClick={handleContactOwner}
          className="flex-1 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:bg-[#128C7E] transition-colors text-center flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Hubungi via WhatsApp
        </button>
      </div>
    </div>
  );
}
