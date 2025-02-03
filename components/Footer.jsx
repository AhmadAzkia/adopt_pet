"use client";
import { useEffect, useState } from "react";

export default function Footer() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  return (
    <footer className="bg-primary py-4 font-poppins">
      <div className="container mx-auto px-4">
        <p className="text-sm text-white text-center">
          &copy; {new Date().getFullYear()} Adopt Pet App. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
