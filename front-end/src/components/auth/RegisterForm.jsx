import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import Input from '../common/Input.jsx'
import Select from '../common/Select.jsx'
import Button from '../common/Button.jsx'
import { USER_ROLES } from '../../utils/constants.js'

export default function RegisterForm() {
  const { register } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!form.password) {
      newErrors.password = 'Password is required'
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    if (!form.role) {
      newErrors.role = 'Please select a role'
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
      const registerData = { ...form }
      delete registerData.confirmPassword
      await register(registerData)
      localStorage.setItem('verifyEmail', form.email)
      toast.success('Registration successful! Please verify your email.')
      navigate('/verify-email')
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = USER_ROLES.map((r) => ({
    value: r,
    label: r.charAt(0).toUpperCase() + r.slice(1),
  }))

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        label="Full Name"
        name="name"
        type="text"
        placeholder="John Doe"
        value={form.name}
        onChange={handleChange}
        error={errors.name}
        autoComplete="name"
      />

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
        label="Password"
        name="password"
        type="password"
        placeholder="Minimum 6 characters"
        value={form.password}
        onChange={handleChange}
        error={errors.password}
        autoComplete="new-password"
      />

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Re-enter your password"
        value={form.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      <Select
        label="I want to"
        name="role"
        options={roleOptions}
        placeholder="Select your role"
        value={form.role}
        onChange={handleChange}
        error={errors.role}
      />

      {form.role === 'seller' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Seller accounts require admin approval before you can list properties. You'll be notified once approved.
          </p>
        </div>
      )}

      <Button type="submit" loading={loading} className="w-full">
        Create Account
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
          Sign in
        </Link>
      </p>
    </form>
  )
}