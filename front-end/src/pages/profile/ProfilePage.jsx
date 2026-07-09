import { useState, useEffect, useRef } from 'react'
import { getUserProfile, updateUserProfile } from '../../api/user.api.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { getInitials, formatDate, capitalize } from '../../utils/helpers.js'
import Input from '../../components/common/Input.jsx'
import Textarea from '../../components/common/Textarea.jsx'
import Button from '../../components/common/Button.jsx'
import Badge from '../../components/common/Badge.jsx'
import Loader from '../../components/common/Loader.jsx'

/**
 * Profile page for all authenticated users.
 * Shows user info with toggle to edit mode.
 * Supports profile picture upload and removal.
 * Shows seller-pending banner if applicable.
 */
export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const fileInputRef = useRef(null)

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  // Edit form state
  const [form, setForm] = useState({
    name: '',
    phone: '',
    address: '',
  })
  const [profilePicPreview, setProfilePicPreview] = useState(null)
  const [profilePicFile, setProfilePicFile] = useState(null)
  const [removeProfilePic, setRemoveProfilePic] = useState(false)
  const [errors, setErrors] = useState({})

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await getUserProfile()
        const userData = res.data.user
        setProfile(userData)
        setForm({
          name: userData.name || '',
          phone: userData.phone || '',
          address: userData.address || '',
        })
      } catch  {
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle edit toggle
  const handleEditToggle = () => {
    if (editing) {
      // Cancel — reset form
      setForm({
        name: profile?.name || '',
        phone: profile?.phone || '',
        address: profile?.address || '',
      })
      setProfilePicPreview(null)
      setProfilePicFile(null)
      setRemoveProfilePic(false)
      setErrors({})
    }
    setEditing(!editing)
  }

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Handle profile picture selection
  const handlePicSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB')
      return
    }

    setProfilePicFile(file)
    setProfilePicPreview(URL.createObjectURL(file))
    setRemoveProfilePic(false)
  }

  // Handle remove profile picture
  const handleRemovePic = () => {
    setProfilePicFile(null)
    setProfilePicPreview(null)
    setRemoveProfilePic(true)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // Validate form
  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Save profile
  const handleSave = async () => {
    if (!validate()) return

    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('name', form.name.trim())
      if (form.phone.trim()) formData.append('phone', form.phone.trim())
      if (form.address.trim()) formData.append('address', form.address.trim())
      if (removeProfilePic) formData.append('removeProfilePic', 'true')
      if (profilePicFile) formData.append('profilePic', profilePicFile)

      const res = await updateUserProfile(formData)
      const updatedUser = res.data.user

      setProfile(updatedUser)
      // Update auth context
      updateUser(updatedUser)
      setEditing(false)
      setProfilePicFile(null)
      setProfilePicPreview(null)
      setRemoveProfilePic(false)
      toast.success('Profile updated successfully')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader message="Loading profile..." />
  }

    if (!profile && !loading) {
    return (
      <div className="page-container">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load profile</h2>
          <p className="text-gray-500 mb-6">Please try refreshing the page or sign in again.</p>
          <button onClick={() => window.location.reload()} className="btn-primary">Refresh</button>
        </div>
      </div>
    )
  }

  // Determine what image to show
  const displayPic = profilePicPreview || (removeProfilePic ? null : profile?.profilePic)

  return (
    <div className="page-container">
      {/* Seller Pending Banner */}
      {user?.isSellerPending && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Seller Account Pending Approval</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Your seller account is currently awaiting admin approval. You'll be able to list properties once approved.
              You can still update your profile in the meantime.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="page-title mb-1">My Profile</h1>
            <p className="text-gray-500">Manage your account information</p>
          </div>
          <Button
            variant={editing ? 'secondary' : 'primary'}
            onClick={handleEditToggle}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Profile Picture Section */}
          <div className="bg-gray-50 px-6 py-8 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                {displayPic ? (
                  <img
                    src={displayPic}
                    alt={profile.name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-md">
                    {getInitials(profile.name)}
                  </div>
                )}

                {/* Edit overlay */}
                {editing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePicSelect}
                  className="hidden"
                />
              </div>

              {/* Pic actions */}
              {editing && (
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="text-xs py-1.5 px-3"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {displayPic ? 'Change Photo' : 'Upload Photo'}
                  </Button>
                  {profile?.profilePic && (
                    <button
                      type="button"
                      onClick={handleRemovePic}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove Photo
                    </button>
                  )}
                  <p className="text-xs text-gray-400">JPG, PNG. Max 5MB.</p>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info Section */}
          <div className="p-6">
            {editing ? (
              /* ===== EDIT MODE ===== */
              <form onSubmit={(e) => { e.preventDefault(); handleSave() }} className="space-y-5">
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <Input
                  label="Email"
                  type="email"
                  value={profile?.email || ''}
                  disabled
                  helperText="Email cannot be changed"
                />
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
                <Textarea
                  label="Address"
                  name="address"
                  placeholder="Your address (optional)"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                />

                <div className="flex gap-3 pt-2">
                  <Button type="submit" loading={saving}>
                    Save Changes
                  </Button>
                  <Button type="button" variant="secondary" onClick={handleEditToggle}>
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              /* ===== VIEW MODE ===== */
              <div className="space-y-5">
                <InfoRow label="Full Name" value={profile?.name} />
                <InfoRow label="Email" value={profile?.email} />
                <InfoRow label="Phone" value={profile?.phone || 'Not provided'} />
                <InfoRow label="Address" value={profile?.address || 'Not provided'} />
                <InfoRow
                  label="Role"
                  value={
                    <span className="flex items-center gap-2">
                      <Badge
                        variant={
                          profile?.role === 'admin' ? 'red' :
                          profile?.role === 'seller' ? 'blue' : 'teal'
                        }
                      >
                        {capitalize(profile?.role)}
                      </Badge>
                      {profile?.role === 'seller' && (
                        profile?.isApproved
                          ? <Badge variant="green">Approved</Badge>
                          : <Badge variant="amber">Pending Approval</Badge>
                      )}
                    </span>
                  }
                />
                <InfoRow label="Verified" value={profile?.isVerified ? 'Yes' : 'No'} />
                <InfoRow label="Member Since" value={formatDate(profile?.createdAt)} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Simple label-value row for the profile view mode.
 */
function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-0 py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-gray-500 sm:w-40 flex-shrink-0">{label}</span>
      <span className="text-sm text-gray-900">{value}</span>
    </div>
  )
}