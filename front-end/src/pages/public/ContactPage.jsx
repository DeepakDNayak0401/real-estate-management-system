import { useState } from 'react'
import { createContact } from '../../api/contact.api.js'
import { useToast } from '../../hooks/useToast.js'
import Input from '../../components/common/Input.jsx'
import Select from '../../components/common/Select.jsx'
import Textarea from '../../components/common/Textarea.jsx'
import Button from '../../components/common/Button.jsx'
import { CONTACT_ROLES } from '../../utils/constants.js'

/**
 * Public contact page with a form and company info.
 * Calls POST /api/contact/ on submission.
 */
export default function ContactPage() {
  const toast = useToast()

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Enter a valid email address'
    }
    if (!form.role) newErrors.role = 'Please select your role'
    if (!form.message.trim()) newErrors.message = 'Message is required'
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
      await createContact({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        role: form.role,
        message: form.message.trim(),
      })
      setSent(true)
      toast.success('Message sent successfully! We\'ll get back to you soon.')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message. Please try again.'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const roleOptions = CONTACT_ROLES.map((r) => ({
    value: r,
    label: r.charAt(0).toUpperCase() + r.slice(1),
  }))

  // Success state
  if (sent) {
    return (
      <div className="page-container">
        <div className="max-w-lg mx-auto text-center py-16">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Message Sent!</h1>
          <p className="text-gray-500 mb-8">
            Thank you for reaching out, {form.name}. We've received your message and will respond to <strong>{form.email}</strong> as soon as possible.
          </p>
          <button
            onClick={() => {
              setSent(false)
              setForm({ name: '', email: '', phone: '', role: '', message: '' })
            }}
            className="btn-primary"
          >
            Send Another Message
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="page-title mb-2">Contact Us</h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Have a question or need help? Fill out the form below and our team will get back to you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-6xl mx-auto">
        {/* Contact Form */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  error={errors.email}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={handleChange}
                />
                <Select
                  label="I am a"
                  name="role"
                  options={roleOptions}
                  placeholder="Select role"
                  value={form.role}
                  onChange={handleChange}
                  error={errors.role}
                />
              </div>

              <Textarea
                label="Message"
                name="message"
                placeholder="Tell us how we can help you..."
                value={form.message}
                onChange={handleChange}
                error={errors.message}
                rows={6}
              />

              <Button type="submit" loading={loading} className="w-full sm:w-auto">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Contact Info Sidebar */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Get in Touch</h3>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Location</p>
                  <p className="text-sm text-gray-500 mt-0.5">India</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Email</p>
                  <p className="text-sm text-gray-500 mt-0.5">info@Nestify.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Business Hours</p>
                  <p className="text-sm text-gray-500 mt-0.5">Mon - Sat: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ-style help */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Questions</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900">How do I list my property?</p>
                <p className="text-sm text-gray-500 mt-1">
                  Register as a seller, get approved by admin, then navigate to Seller Dashboard → Add Property.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Is there a listing fee?</p>
                <p className="text-sm text-gray-500 mt-1">
                  Contact us directly for information about pricing and plans.
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">How long does seller approval take?</p>
                <p className="text-sm text-gray-500 mt-1">
                  Seller accounts are typically approved within 24-48 hours after verification.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}