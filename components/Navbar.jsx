"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import DataImage from "@/assets/data";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-blue-100"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={DataImage.kujing3 || "/placeholder.svg"}
              alt="Adopt Pet"
              width={40}
              height={40}
              priority={true}
              className="transition-transform duration-300 hover:scale-110"
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {[
              { name: "Beranda", id: "/" },
              { name: "Layanan", id: "#layanan" },
              { name: "Daftar Pet", id: "#daftar-pet" },
              { name: "Kontak Kami", id: "#kontak-kami" },
            ].map((item) => (
              <Link
                href={item.id}
                key={item.id}
                className="text-gray-700 hover:text-blue-700 transition-colors duration-300 font-medium relative group"
              >
                {item.name}
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-700 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            ))}
          </div>

          {/* User Profile Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-700 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-blue-700/20"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 border-2 border-blue-700 text-blue-700 rounded-xl hover:bg-blue-700 hover:text-white transition-all duration-300 shadow-lg shadow-blue-700/20"
              >
                Daftar
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-blue-100 transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-blue-700" />
              ) : (
                <Menu className="w-6 h-6 text-blue-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-100">
            {[
              { name: "Beranda", id: "/" },
              { name: "Layanan", id: "#layanan" },
              { name: "Daftar Pet", id: "#daftar-pet" },
              { name: "Kontak Kami", id: "#kontak-kami" },
            ].map((item) => (
              <Link
                href={item.id}
                key={item.id}
                className="block w-full text-left py-2 px-4 text-gray-700 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors duration-300"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}