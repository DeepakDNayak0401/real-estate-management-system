import { useState, useEffect } from 'react'
import { getPendingSellers, approveSeller } from '../../api/admin.api.js'
import { useToast } from '../../hooks/useToast.js'
import SellerApprovalCard from '../../components/admin/SellerApprovalCard.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

/**
 * Admin page for approving pending seller accounts.
 * Each card has an approve button that calls the backend.
 */
export default function AdminSellerApprovalsPage() {
  const toast = useToast()

  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)
  const [approvingId, setApprovingId] = useState(null)

  useEffect(() => {
    let isActive = true

    getPendingSellers()
      .then((res) => {
        if (!isActive) return
        setSellers(res.data.pendingSellers || [])
      })
      .catch(() => {
        if (!isActive) return
        toast.error('Failed to load pending seller requests')
      })
      .finally(() => {
        if (!isActive) return
        setLoading(false)
      })

    return () => {
      isActive = false
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Approve a seller
  const handleApprove = async (sellerId) => {
    setApprovingId(sellerId)
    try {
      await approveSeller(sellerId)
      // Remove from list
      setSellers((prev) => prev.filter((s) => s._id !== sellerId))
      toast.success('Seller approved successfully!')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to approve seller'
      toast.error(message)
    } finally {
      setApprovingId(null)
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title mb-1">Seller Approvals</h1>
        <p className="text-gray-500">
          {loading
            ? 'Loading...'
            : `${sellers.length} pending approval${sellers.length === 1 ? '' : 's'}`
          }
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading pending sellers..." />
      ) : sellers.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
          title="All caught up!"
          description="There are no pending seller approval requests at the moment."
        />
      ) : (
        <div className="space-y-3 max-w-3xl">
          {sellers.map((seller) => (
            <SellerApprovalCard
              key={seller._id}
              seller={seller}
              onApprove={handleApprove}
              loading={approvingId === seller._id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
