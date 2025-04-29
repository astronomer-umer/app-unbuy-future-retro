export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-wrap justify-between items-center">
        <p className="text-sm">&copy; 2025 unBuy. All rights reserved.</p>
        <nav className="flex gap-4 text-sm">
          <a href="/privacy" className="hover:underline">
            Privacy Policy
          </a>
          <a href="/tos" className="hover:underline">
            Terms of Service
          </a>
          <a href="/cookie-policy" className="hover:underline">
            Cookie Policy
          </a>
          <a href="/about" className="hover:underline">
            About Us
          </a>
          <a href="/help" className="hover:underline">Help Center
          </a>
        </nav>
      </div>
    </footer>
  )
}
