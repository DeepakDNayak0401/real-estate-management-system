import { Link } from 'react-router-dom'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/nestify-logo.png" alt="Logo" className="h-8 w-8" />
              <span className="text-lg font-bold text-white">Nestify</span>
            </div>
            <p className="text-sm leading-relaxed">
              Your trusted platform for finding the perfect property. Buy, sell, or rent with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/properties" className="text-sm hover:text-white transition-colors">Properties</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h4 className="text-white font-semibold mb-4">Property Types</h4>
            <ul className="space-y-2">
              <li><Link to="/properties?propertyType=apartment" className="text-sm hover:text-white transition-colors">Apartments</Link></li>
              <li><Link to="/properties?propertyType=villa" className="text-sm hover:text-white transition-colors">Villas</Link></li>
              <li><Link to="/properties?propertyType=house" className="text-sm hover:text-white transition-colors">Houses</Link></li>
              <li><Link to="/properties?propertyType=plot" className="text-sm hover:text-white transition-colors">Plots</Link></li>
              <li><Link to="/properties?propertyType=commercial" className="text-sm hover:text-white transition-colors">Commercial</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">India</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">info@Nestify.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            &copy; {currentYear} Nestify. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/contact" className="text-sm hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="text-sm hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}