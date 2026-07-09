import { Link } from 'react-router-dom'
import ResetPasswordForm from '../../components/auth/ResetPasswordForm.jsx'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/nestify-logo.png" alt="Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-gray-900">Nestify</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Reset your password</h1>
          <p className="mt-1 text-sm text-gray-500">Enter your new password below</p>
        </div>

        {/* Reset Password Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}