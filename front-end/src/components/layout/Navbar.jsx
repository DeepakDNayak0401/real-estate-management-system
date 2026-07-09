import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { getInitials } from '../../utils/helpers.js'

export default function Navbar() {
  const { user, isAuthenticated, logout, isSellerPending } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setProfileDropdownOpen(false)
    setMobileMenuOpen(false)
    navigate('/')
  }

  const closeMobile = () => setMobileMenuOpen(false)

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-teal-600 border-b-2 border-teal-600 pb-1'
        : 'text-gray-600 hover:text-teal-600'
    }`

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" onClick={closeMobile}>
            <img src="/nestify-logo.png" alt="Logo" className="h-8 w-8" />
            <span className="text-lg font-bold text-gray-900">Nestify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/properties" className={navLinkClass}>
              Properties
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Seller pending warning */}
                {isSellerPending && (
                  <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                    Pending Approval
                  </span>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {user?.profilePic ? (
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-medium">
                        {getInitials(user?.name)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                      {user?.name}
                    </span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <>
                      {/* Click-away backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                          <span className="inline-block mt-1 text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded capitalize">
                            {user?.role}
                          </span>
                        </div>

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/wishlist"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Wishlist
                        </Link>
                        <Link
                          to="/chats"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Messages
                        </Link>

                        {user?.role === 'seller' && user?.isApproved && (
                          <Link
                            to="/seller/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Seller Dashboard
                          </Link>
                        )}

                        {user?.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Admin Dashboard
                          </Link>
                        )}

                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-600 hover:text-teal-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary text-sm py-2 px-4"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-3 space-y-2">
            <NavLink
              to="/"
              onClick={closeMobile}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
              end
            >
              Home
            </NavLink>
            <NavLink
              to="/properties"
              onClick={closeMobile}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              Properties
            </NavLink>
            <NavLink
              to="/contact"
              onClick={closeMobile}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm font-medium ${
                  isActive ? 'bg-teal-50 text-teal-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              Contact
            </NavLink>
          </div>

          {isAuthenticated ? (
            <div className="px-4 py-3 border-t border-gray-200 space-y-1">
              <div className="flex items-center gap-3 px-3 py-2">
                {user?.profilePic ? (
                  <img src={user.profilePic} alt={user.name} className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-medium">
                    {getInitials(user?.name)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
              </div>
              {isSellerPending && (
                <p className="px-3 text-xs font-medium text-amber-600">⏳ Awaiting admin approval</p>
              )}
              <Link to="/profile" onClick={closeMobile} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">My Profile</Link>
              <Link to="/wishlist" onClick={closeMobile} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Wishlist</Link>
              <Link to="/chats" onClick={closeMobile} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Messages</Link>
              {user?.role === 'seller' && user?.isApproved && (
                <Link to="/seller/dashboard" onClick={closeMobile} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Seller Dashboard</Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin/dashboard" onClick={closeMobile} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">Admin Dashboard</Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 border-t border-gray-200 flex gap-3">
              <Link to="/login" onClick={closeMobile} className="flex-1 text-center btn-secondary text-sm py-2">
                Sign In
              </Link>
              <Link to="/register" onClick={closeMobile} className="flex-1 text-center btn-primary text-sm py-2">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}