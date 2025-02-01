import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

export function DogCard({ dog }) {
  return (
    <div className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white">
      <div className="relative aspect-square">
        <Image
          src={dog.image || "/placeholder.svg"}
          alt={dog.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{dog.name}</h3>
        <div className="space-y-1 text-sm text-gray-600">
          <p className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {dog.location}
          </p>
          <p>Ras: {dog.breed}</p>
          <p>Usia: {dog.age}</p>
          <p>Jenis Kelamin: {dog.gender}</p>
        </div>
      </div>
      <div className="p-4 pt-0 flex gap-3">
        <Link
          href={`/chat/${dog.owner_id}`}
          className="flex-1 px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors text-center"
        >
          Hubungi Pemilik
        </Link>
      </div>
    </div>
  );
}
