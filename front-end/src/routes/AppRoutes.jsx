import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

// Layouts
import PublicLayout from '../components/layout/PublicLayout.jsx'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'

// Lazy-loaded pages — public
const HomePage = React.lazy(() => import('../pages/public/HomePage.jsx'))
const PropertiesPage = React.lazy(() => import('../pages/public/PropertiesPage.jsx'))
const PropertyDetailsPage = React.lazy(() => import('../pages/public/PropertyDetailsPage.jsx'))
const ContactPage = React.lazy(() => import('../pages/public/ContactPage.jsx'))
const NotFoundPage = React.lazy(() => import('../pages/public/NotFoundPage.jsx'))

// Lazy-loaded pages — auth
const LoginPage = React.lazy(() => import('../pages/auth/LoginPage.jsx'))
const RegisterPage = React.lazy(() => import('../pages/auth/RegisterPage.jsx'))
const VerifyEmailPage = React.lazy(() => import('../pages/auth/VerifyEmailPage.jsx'))
const ForgotPasswordPage = React.lazy(() => import('../pages/auth/ForgotPasswordPage.jsx'))
const ResetPasswordPage = React.lazy(() => import('../pages/auth/ResetPasswordPage.jsx'))

// Lazy-loaded pages — profile
const ProfilePage = React.lazy(() => import('../pages/profile/ProfilePage.jsx'))

// Lazy-loaded pages — buyer
const WishlistPage = React.lazy(() => import('../pages/buyer/WishlistPage.jsx'))
const ChatsPage = React.lazy(() => import('../pages/buyer/ChatsPage.jsx'))

// Lazy-loaded pages — seller
const SellerDashboardPage = React.lazy(() => import('../pages/seller/SellerDashboardPage.jsx'))
const MyPropertiesPage = React.lazy(() => import('../pages/seller/MyPropertiesPage.jsx'))
const AddPropertyPage = React.lazy(() => import('../pages/seller/AddPropertyPage.jsx'))
const EditPropertyPage = React.lazy(() => import('../pages/seller/EditPropertyPage.jsx'))
const SellerInquiriesPage = React.lazy(() => import('../pages/seller/SellerInquiriesPage.jsx'))

// Lazy-loaded pages — admin
const AdminDashboardPage = React.lazy(() => import('../pages/admin/AdminDashboardPage.jsx'))
const AdminUsersPage = React.lazy(() => import('../pages/admin/AdminUsersPage.jsx'))
const AdminPropertiesPage = React.lazy(() => import('../pages/admin/AdminPropertiesPage.jsx'))
const AdminInquiriesPage = React.lazy(() => import('../pages/admin/AdminInquiriesPage.jsx'))
const AdminContactsPage = React.lazy(() => import('../pages/admin/AdminContactsPage.jsx'))
const AdminSellerApprovalsPage = React.lazy(() => import('../pages/admin/AdminSellerApprovalsPage.jsx'))

/** Full-page loading spinner for Suspense fallback */
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-200 border-t-teal-600"></div>
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    </div>
  )
}

/** Redirects authenticated users away from auth pages */
function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <PageLoader />
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

/** Protects routes that require authentication */
function ProtectedRoute({ children, roles }) {
  const { user, loading, isSellerPending } = useAuth()
  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  // Sellers who are not approved can only access profile
  if (isSellerPending && roles?.includes('seller')) {
    return <Navigate to="/profile" replace />
  }
  return children
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ===== PUBLIC ROUTES ===== */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/property/:id" element={<PropertyDetailsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>

        {/* ===== AUTH ROUTES ===== */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <GuestRoute>
              <VerifyEmailPage />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <GuestRoute>
              <ResetPasswordPage />
            </GuestRoute>
          }
        />

        {/* ===== PROTECTED ROUTES (Any authenticated user) ===== */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <WishlistPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ChatsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chats/:chatId"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ChatsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ===== SELLER ROUTES ===== */}
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute roles={['seller']}>
              <DashboardLayout>
                <SellerDashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/properties"
          element={
            <ProtectedRoute roles={['seller']}>
              <DashboardLayout>
                <MyPropertiesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/add-property"
          element={
            <ProtectedRoute roles={['seller']}>
              <DashboardLayout>
                <AddPropertyPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/edit-property/:id"
          element={
            <ProtectedRoute roles={['seller']}>
              <DashboardLayout>
                <EditPropertyPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/inquiries"
          element={
            <ProtectedRoute roles={['seller']}>
              <DashboardLayout>
                <SellerInquiriesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ===== ADMIN ROUTES ===== */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout>
                <AdminDashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout>
                <AdminUsersPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/properties"
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout>
                <AdminPropertiesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/inquiries"
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout>
                <AdminInquiriesPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout>
                <AdminContactsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/seller-approvals"
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout>
                <AdminSellerApprovalsPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />

        {/* ===== 404 ===== */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}