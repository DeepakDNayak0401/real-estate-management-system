import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { getInitials } from '../../utils/helpers.js'

export default function Sidebar({ onClose }) {
  // ✅ Get unread count from context
  const { user, isSellerPending, unreadMessagesCount } = useAuth()

  const getMenuItems = () => {
    const commonItems = [
      { to: '/profile', label: 'My Profile', icon: ProfileIcon },
      { to: '/wishlist', label: 'Wishlist', icon: HeartIcon },
      { 
        to: '/chats', 
        label: 'Messages', 
        icon: ChatIcon,
        badge: unreadMessagesCount > 0 ? unreadMessagesCount : null // ✅ Attach badge data
      },
    ]

    if (user?.role === 'admin') {
      return [
        { section: 'Admin' },
        { to: '/admin/dashboard', label: 'Dashboard', icon: DashboardIcon },
        { to: '/admin/users', label: 'Users', icon: UsersIcon },
        { to: '/admin/properties', label: 'Properties', icon: HomeIcon },
        { to: '/admin/inquiries', label: 'Inquiries', icon: InboxIcon },
        { to: '/admin/contacts', label: 'Contacts', icon: MailIcon },
        { to: '/admin/seller-approvals', label: 'Seller Approvals', icon: ShieldIcon },
        { section: 'Account' },
        ...commonItems,
      ]
    }

    if (user?.role === 'seller' && user?.isApproved) {
      return [
        { section: 'Seller' },
        { to: '/seller/dashboard', label: 'Dashboard', icon: DashboardIcon },
        { to: '/seller/properties', label: 'My Properties', icon: HomeIcon },
        { to: '/seller/add-property', label: 'Add Property', icon: PlusIcon },
        { to: '/seller/inquiries', label: 'Inquiries', icon: InboxIcon },
        { section: 'Account' },
        ...commonItems,
      ]
    }

    return [{ section: 'Account' }, ...commonItems]
  }

  const menuItems = getMenuItems()

  return (
    <aside className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 flex-shrink-0">
        <NavLink to="/" className="flex items-center gap-2" onClick={onClose}>
          <img src="/nestify-logo.png" alt="Logo" className="h-7 w-7" />
          <span className="text-base font-bold text-gray-900">Nestify</span>
        </NavLink>
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100"
          aria-label="Close sidebar"
        >
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          {user?.profilePic ? (
            <img src={user.profilePic} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">
              {getInitials(user?.name)}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-gray-500 capitalize">{user?.role}</span>
              {isSellerPending && (
                <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Pending</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin">
        {menuItems.map((item, idx) => {
          if (item.section) {
            return (
              <p key={`section-${idx}`} className="px-3 mt-6 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider first:mt-0">
                {item.section}
              </p>
            )
          }

          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 mb-0.5 ${
                  isActive
                    ? 'bg-teal-50 text-teal-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
              
              {/* ✅ Catchy Unread Badge */}
              {item.badge && (
                <span className="ml-auto inline-flex items-center justify-center bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] shadow-sm animate-pulse">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Unapproved Seller Banner */}
      {isSellerPending && (
        <div className="px-4 py-3 mx-3 mb-4 bg-amber-50 border border-amber-200 rounded-lg flex-shrink-0">
          <p className="text-xs font-medium text-amber-800">
            Your seller account is pending admin approval.
          </p>
        </div>
      )}
    </aside>
  )
}

/* ---- Icons ---- */
function ProfileIcon(p) { return (<svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>) }
function HeartIcon(p) { return (<svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>) }
function ChatIcon(p) { return (<svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>) }
function DashboardIcon(p) { return (<svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>) }
function UsersIcon(p) { return (<svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>) }
function HomeIcon(p) { return (<svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>) }
function InboxIcon(p) { return (<svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>) }
function MailIcon(p) { return (<svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>) }
function ShieldIcon(p) { return (<svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>) }
function PlusIcon(p) { return (<svg {...p} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>) }