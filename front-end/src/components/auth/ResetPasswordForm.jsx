import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { resetPassword } from '../../api/auth.api.js'
import { useToast } from '../../hooks/useToast.js'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'

export default function ResetPasswordForm() {
  const { token } = useParams()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters'
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      await resetPassword(token, { newPassword: form.newPassword })
      toast.success('Password reset successfully! You can now log in.')
      navigate('/login')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password. The link may have expired.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="New Password"
        name="newPassword"
        type="password"
        placeholder="Minimum 6 characters"
        value={form.newPassword}
        onChange={handleChange}
        error={errors.newPassword}
        autoComplete="new-password"
      />

      <Input
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        placeholder="Re-enter your new password"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <Button type="submit" loading={loading} className="w-full">
        Reset Password
      </Button>

      <p className="text-center text-sm text-gray-600">
        Remember your password?{' '}
        <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  )
}