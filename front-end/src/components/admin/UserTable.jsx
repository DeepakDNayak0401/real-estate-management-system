import { formatDate, getInitials, capitalize } from '../../utils/helpers.js'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'

/**
 * Admin table displaying all users with role badges,
 * status indicators, and block/delete actions.
 */
export default function UserTable({
  users = [],
  onBlockToggle,
  onDelete,
  blockLoadingId = null,
  deleteLoadingId = null,
}) {
  if (users.length === 0) return null

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge variant="red">Admin</Badge>
      case 'seller':
        return <Badge variant="blue">Seller</Badge>
      case 'buyer':
        return <Badge variant="teal">Buyer</Badge>
      default:
        return <Badge variant="gray">{capitalize(role)}</Badge>
    }
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="table-header">User</th>
            <th className="table-header">Role</th>
            <th className="table-header hidden sm:table-cell">Verified</th>
            <th className="table-header hidden md:table-cell">Approved</th>
            <th className="table-header hidden lg:table-cell">Joined</th>
            <th className="table-header">Status</th>
            <th className="table-header text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user._id} className="hover:bg-gray-50 transition-colors">
              {/* User Info */}
              <td className="table-cell">
                <div className="flex items-center gap-3">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[180px]">
                      {user.email}
                    </p>
                  </div>
                </div>
              </td>

              {/* Role */}
              <td className="table-cell">{getRoleBadge(user.role)}</td>

              {/* Verified */}
              <td className="table-cell hidden sm:table-cell">
                {user.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-xs text-green-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Yes
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">No</span>
                )}
              </td>

              {/* Approved (relevant for sellers) */}
              <td className="table-cell hidden md:table-cell">
                {user.role === 'seller' ? (
                  user.isApproved ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green-700">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approved
                    </span>
                  ) : (
                    <Badge variant="amber">Pending</Badge>
                  )
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </td>

              {/* Joined Date */}
              <td className="table-cell hidden lg:table-cell text-sm text-gray-500">
                {formatDate(user.createdAt)}
              </td>

              {/* Status (Blocked / Active) */}
              <td className="table-cell">
                {user.isBlocked ? (
                  <Badge variant="red">Blocked</Badge>
                ) : (
                  <Badge variant="green">Active</Badge>
                )}
              </td>

              {/* Actions */}
              <td className="table-cell text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant={user.isBlocked ? 'primary' : 'secondary'}
                    className="text-xs py-1 px-2.5"
                    onClick={() => onBlockToggle(user._id)}
                    loading={blockLoadingId === user._id}
                  >
                    {user.isBlocked ? 'Unblock' : 'Block'}
                  </Button>
                  <Button
                    variant="danger"
                    className="text-xs py-1 px-2.5"
                    onClick={() => onDelete(user._id, user.name)}
                    loading={deleteLoadingId === user._id}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}