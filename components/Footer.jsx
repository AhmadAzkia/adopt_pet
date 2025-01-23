export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-800 to-blue-700 py-4 font-poppins">
      <div className="container mx-auto px-4">
        <p className="text-sm text-blue-200 text-center">
          &copy; {currentYear} Adopt Pet App. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}