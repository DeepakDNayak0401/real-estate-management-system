import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../api/auth.api.js'
import { useToast } from '../../hooks/useToast.js'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'

export default function ForgotPasswordForm() {
  const toast = useToast()

  const [form, setForm] = useState({ email: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
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
      await forgotPassword({ email: form.email })
      setSent(true)
      toast.success('Password reset link sent to your email.')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send reset email.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Check Your Email</h3>
        <p className="text-sm text-gray-600">
          We've sent a password reset link to <strong>{form.email}</strong>. The link will expire in 15 minutes.
        </p>
        <Link to="/login" className="btn-primary inline-block">
          Back to Sign In
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <p className="text-sm text-blue-800">
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </p>
      </div>

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={handleChange}
        error={errors.email}
        autoComplete="email"
      />

      <Button type="submit" loading={loading} className="w-full">
        Send Reset Link
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