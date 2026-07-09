import { useState, useEffect } from 'react'
import { getAllInquiries } from '../../api/admin.api.js'
import { markInquiryAsRead } from '../../api/inquiry.api.js'
import { useToast } from '../../hooks/useToast.js'
import InquiryCard from '../../components/inquiry/InquiryCard.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

/**
 * Admin page showing ALL inquiries across the platform.
 * Read-only view (mark-as-read updates the shared inquiry document).
 */
export default function AdminInquiriesPage() {
  const toast = useToast()
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  
  // ✅ FIX: Removed markingId and setMarkingId entirely to clear the VSCode warning

  // Fetch all inquiries on mount
  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true)
      try {
        const res = await getAllInquiries()
        setInquiries(res.data.inquiries || [])
      } catch{
        toast.error('Failed to load inquiries')
      } finally {
        setLoading(false)
      }
    }
    fetchInquiries()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ Mark inquiry as read
  const handleMarkRead = async (inquiryId) => {
    // ✅ FIX: Removed setMarkingId(inquiryId)
    try {
      await markInquiryAsRead(inquiryId)
      setInquiries((prev) =>
        prev.map((inq) =>
          inq._id === inquiryId ? { ...inq, isRead: true } : inq
        )
      )
      toast.success('Marked as read')
    } catch  {
      toast.error('Failed to mark as read')
    }
    // ✅ FIX: Removed setMarkingId(null)
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title mb-1">All Inquiries</h1>
        <p className="text-gray-500">
          {loading
            ? 'Loading...'
            : `${inquiries.length} total inquir${inquiries.length === 1 ? 'y' : 'ies'}`}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading inquiries..." />
      ) : inquiries.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          }
          title="No inquiries yet"
          description="No inquiries have been sent on the platform yet."
        />
      ) : (
        <div className="space-y-3 max-w-4xl">
          {inquiries.map((inquiry) => (
            <InquiryCard
              key={inquiry._id}
              inquiry={inquiry}
              showPropertyLink={true}
              onMarkRead={handleMarkRead} // Pass the handler so the button works
            />
          ))}
        </div>
      )}
    </div>
  )
}