import { useState, useEffect } from 'react'
import { getAllUsers, blockUser, deleteUser } from '../../api/admin.api.js'
import { useToast } from '../../hooks/useToast.js'
import UserTable from '../../components/admin/UserTable.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import Loader from '../../components/common/Loader.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'

/**
 * Admin page for managing all users.
 * Supports blocking/unblocking and deleting users with confirmation.
 */
export default function AdminUsersPage() {
  const toast = useToast()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  // Loading states per action
  const [blockLoadingId, setBlockLoadingId] = useState(null)
  const [deleteLoadingId, setDeleteLoadingId] = useState(null)

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deletingUser, setDeletingUser] = useState(null) // { id, name }

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const res = await getAllUsers()
        setUsers(res.data.users || [])
      } catch  {
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Block / Unblock toggle
  const handleBlockToggle = async (userId) => {
    setBlockLoadingId(userId)
    try {
      const res = await blockUser(userId)
      const { isBlocked, message } = res.data

      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBlocked } : u))
      )
      toast.success(message)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user status'
      toast.error(message)
    } finally {
      setBlockLoadingId(null)
    }
  }

  // Open delete dialog
  const handleDeleteClick = (userId, userName) => {
    setDeletingUser({ id: userId, name: userName })
    setDeleteDialogOpen(true)
  }

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingUser) return
    setDeleteLoadingId(deletingUser.id)
    try {
      await deleteUser(deletingUser.id)
      setUsers((prev) => prev.filter((u) => u._id !== deletingUser.id))
      toast.success('User deleted successfully')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete user'
      toast.error(message)
    } finally {
      setDeleteLoadingId(null)
      setDeleteDialogOpen(false)
      setDeletingUser(null)
    }
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-6">
        <h1 className="page-title mb-1">Manage Users</h1>
        <p className="text-gray-500">
          {loading ? 'Loading...' : `${users.length} registered users`}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <Loader message="Loading users..." />
      ) : users.length === 0 ? (
        <EmptyState
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          title="No users found"
          description="There are no registered users on the platform yet."
        />
      ) : (
        <UserTable
          users={users}
          onBlockToggle={handleBlockToggle}
          onDelete={handleDeleteClick}
          blockLoadingId={blockLoadingId}
          deleteLoadingId={deleteLoadingId}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false)
          setDeletingUser(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={
          deletingUser
            ? `Are you sure you want to delete "${deletingUser.name}"? This will also remove all associated data (properties, inquiries, wishlist, etc.). This action cannot be undone.`
            : 'Are you sure you want to delete this user?'
        }
        confirmLabel="Delete User"
        variant="danger"
        loading={!!deleteLoadingId}
      />
    </div>
  )
}