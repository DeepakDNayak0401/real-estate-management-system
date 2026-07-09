import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { verifyEmail } from '../../api/auth.api.js'
import { useToast } from '../../hooks/useToast.js'
import Input from '../common/Input.jsx'
import Button from '../common/Button.jsx'

export default function VerifyEmailForm() {
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState(() => ({ email: localStorage.getItem('verifyEmail') || '', code: '' }))
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)


  const validate = () => {
    const newErrors = {}
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!form.code.trim()) {
      newErrors.code = 'Verification code is required'
    } else if (!/^\d{6}$/.test(form.code.trim())) {
      newErrors.code = 'Enter a valid 6-digit code'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    // Only allow digits for code
    if (name === 'code' && value && !/^\d*$/.test(value)) return
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
      await verifyEmail({ email: form.email, code: form.code.trim() })
      localStorage.removeItem('verifyEmail')
      toast.success('Email verified successfully! You can now log in.')
      navigate('/login')
    } catch (error) {
      const message = error.response?.data?.message || 'Verification failed. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
        <p className="text-sm text-blue-800">
          A 6-digit verification code was sent to your email. Please enter it below to verify your account.
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

      <Input
        label="Verification Code"
        name="code"
        type="text"
        placeholder="Enter 6-digit code"
        value={form.code}
        onChange={handleChange}
        error={errors.code}
        maxLength={6}
        autoComplete="one-time-code"
      />

      <Button type="submit" loading={loading} className="w-full">
        Verify Email
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already verified?{' '}
        <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  )
}