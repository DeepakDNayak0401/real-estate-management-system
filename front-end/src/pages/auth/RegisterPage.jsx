import { Link } from 'react-router-dom'
import RegisterForm from '../../components/auth/RegisterForm.jsx'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/nestify-logo.png" alt="Logo" className="h-10 w-10" />
            <span className="text-2xl font-bold text-gray-900">Nestify</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Create an account</h1>
          <p className="mt-1 text-sm text-gray-500">Join Nestify today</p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}