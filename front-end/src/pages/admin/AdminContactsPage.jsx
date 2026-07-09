import { useState, useEffect } from 'react'
// ✅ FIX: Import getAllContacts from contact.api.js instead of admin.api.js
import { getAllContacts } from '../../api/contact.api.js' 
import { useToast } from '../../hooks/useToast.js'
import { formatDate, getInitials, capitalize } from '../../utils/helpers.js'
import Badge from '../../components/common/Badge.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

/**
 * Admin page showing all contact form submissions.
 * Read-only view of name, email, phone, role, message, and date.
 */
export default function AdminContactsPage() {
  const toast = useToast()
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true)
      try {
        const res = await getAllContacts()
        setContacts(res.data.contacts || [])
      } catch {
        toast.error('Failed to load contact messages')
      } finally {
        setLoading(false)
      }
    }
    fetchContacts()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title mb-1">Contact Messages</h1>
        <p className="text-gray-500">
          {loading
            ? 'Loading...'
            : `${contacts.length} message${contacts.length === 1 ? '' : 's'} received`
          }
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading contact messages..." />
      ) : contacts.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          title="No messages yet"
          description="Messages submitted through the contact form will appear here."
        />
      ) : (
        <div className="space-y-3 max-w-4xl">
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {getInitials(contact.name)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
                    <Badge variant={contact.role === 'seller' ? 'blue' : 'teal'}>
                      {capitalize(contact.role)}
                    </Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3 flex-wrap">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {contact.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(contact.createdAt)}
                    </span>
                  </div>

                  {/* Message */}
                  <div className="bg-gray-50 rounded-lg px-3 py-2.5">
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {contact.message}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}