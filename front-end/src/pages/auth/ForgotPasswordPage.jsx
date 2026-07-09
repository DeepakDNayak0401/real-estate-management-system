import { Link } from 'react-router-dom'
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm.jsx'

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/nestify-logo.png" alt="Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-gray-900">Nestify</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Forgot your password?</h1>
          <p className="mt-1 text-sm text-gray-500">No worries, we'll help you reset it</p>
        </div>

        {/* Forgot Password Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}