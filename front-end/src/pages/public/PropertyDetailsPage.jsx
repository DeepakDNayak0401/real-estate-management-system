import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPropertyDetails } from '../../api/property.api.js'
import { addToWishlist, removeFromWishlist, getWishlist } from '../../api/wishlist.api.js'
import { sendInquiry } from '../../api/inquiry.api.js'
import { createOrGetChat } from '../../api/chat.api.js'
import { useAuth } from '../../hooks/useAuth.js'
import { useToast } from '../../hooks/useToast.js'
import { formatPrice, formatLabel, getInitials } from '../../utils/helpers.js'
import ImageSlider from '../../components/common/ImageSlider.jsx'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import Textarea from '../../components/common/Textarea.jsx'
import Modal from '../../components/common/Modal.jsx'
import Loader from '../../components/common/Loader.jsx'
import SimilarProperties from '../../components/property/SimilarProperties.jsx'

export default function PropertyDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const toast = useToast()
  
  const [property, setProperty] = useState(null)
  const [similarProperties, setSimilarProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistLoading, setWishlistLoading] = useState(false)
  
  // Inquiry modal
  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inquiryMessage, setInquiryMessage] = useState('')
  const [inquiryLoading, setInquiryLoading] = useState(false)
  
  // Chat loading
  const [chatLoading, setChatLoading] = useState(false)

  // Fetch property details
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true)
      try {
        const res = await getPropertyDetails(id)
        setProperty(res.data.property)
        setSimilarProperties(res.data.similarProperties || [])
      } catch {
        toast.error('Failed to load property details')
        navigate('/properties', { replace: true })
      } finally {
        setLoading(false)
      }
    }
    fetchProperty()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ FIX 4: Check wishlist status correctly by comparing stringified IDs
  useEffect(() => {
    if (isAuthenticated && property) {
      const checkWishlist = async () => {
        try {
          const res = await getWishlist()
          const wishlistData = res.data.wishlist
          if (wishlistData?.property) {
            // wishlistData.property contains populated objects, not raw IDs.
            const isSaved = wishlistData.property.some(
              (p) => p._id.toString() === property._id.toString()
            )
            setIsWishlisted(isSaved)
          } else {
            setIsWishlisted(false)
          }
        } catch {
          // Silently fail — wishlist check is non-critical
        }
      }
      checkWishlist()
    }
  }, [isAuthenticated, property]) // eslint-disable-line react-hooks/exhaustive-deps

  // Toggle wishlist
  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to add properties to your wishlist')
      navigate('/login')
      return
    }
    setWishlistLoading(true)
    try {
      if (isWishlisted) {
        await removeFromWishlist(property._id)
        setIsWishlisted(false)
        toast.success('Removed from wishlist')
      } else {
        await addToWishlist(property._id)
        setIsWishlisted(true)
        toast.success('Added to wishlist')
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update wishlist'
      toast.error(message)
    } finally {
      setWishlistLoading(false)
    }
  }

  // Send inquiry
  const handleSendInquiry = async () => {
    if (!inquiryMessage.trim()) {
      toast.error('Please enter a message')
      return
    }
    setInquiryLoading(true)
    try {
      await sendInquiry({
        propertyId: property._id,
        message: inquiryMessage.trim(),
      })
      toast.success('Inquiry sent successfully!')
      setInquiryOpen(false)
      setInquiryMessage('')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send inquiry'
      toast.error(message)
    } finally {
      setInquiryLoading(false)
    }
  }

  // Start chat with seller
  const handleStartChat = async () => {
    if (!isAuthenticated) {
      toast.info('Please sign in to chat with the seller')
      navigate('/login')
      return
    }
    setChatLoading(true)
    try {
      const res = await createOrGetChat({
        propertyId: property._id,
        sellerId: property.seller._id,
      })
      navigate(`/chats/${res.data.chat._id}`)
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to start chat'
      toast.error(message)
    } finally {
      setChatLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <Loader message="Loading property details..." size="lg" />
      </div>
    )
  }

  if (!property) return null

  const isOwner = user && user.id === property.seller._id
  const location = [property.city, property.area, property.pincode].filter(Boolean).join(', ')

  return (
    <div className="page-container">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-teal-600">Home</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <Link to="/properties" className="hover:text-teal-600">Properties</Link>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-gray-900 font-medium line-clamp-1">{property.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== Left Column: Images + Details ===== */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Slider */}
          <ImageSlider images={property.images} alt={property.title} />

          {/* Title & Price */}
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge variant="blue">{formatLabel(property.propertyType)}</Badge>
                  {property.status === 'sold' && <Badge variant="red">Sold</Badge>}
                  {property.status === 'sale' && <Badge variant="green">For Sale</Badge>}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                  {property.title}
                </h1>
                <div className="flex items-center gap-1.5 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{location}</span>
                </div>
              </div>

              {/* Wishlist Button */}
              {!isOwner && (
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className="p-3 rounded-xl border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors flex-shrink-0"
                  title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <svg
                    className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
                    fill={isWishlisted ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              )}
            </div>
            <p className="text-3xl font-bold text-teal-700 mt-4">
              {formatPrice(property.price)}
            </p>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Property Details Grid */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {property.bhk && <DetailItem label="BHK" value={`${property.bhk} BHK`} icon="bed" />}
              {property.bathrooms && <DetailItem label="Bathrooms" value={`${property.bathrooms}`} icon="bath" />}
              {property.areaSize && <DetailItem label="Area" value={`${property.areaSize} sq ft`} icon="area" />}
              {property.furnishing && <DetailItem label="Furnishing" value={formatLabel(property.furnishing)} icon="furnish" />}
              <DetailItem label="Property Type" value={formatLabel(property.propertyType)} icon="type" />
              <DetailItem label="Status" value={formatLabel(property.status)} icon="status" />
              <DetailItem label="Views" value={`${property.views}`} icon="views" />
              <DetailItem label="Listed On" value={new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} icon="date" />
            </div>
          </div>

          {/* Amenities */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
              <div className="flex flex-wrap gap-2">
                {property.amenities.map((amenity, idx) => (
                  <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Similar Properties */}
          <SimilarProperties properties={similarProperties} />
        </div>

        {/* ===== Right Column: Seller Card + Actions ===== */}
        <div className="space-y-6">
          {/* Seller Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-20">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Listed By</h3>
            <div className="flex items-center gap-3 mb-4">
              {property.seller?.profilePic ? (
                <img src={property.seller.profilePic} alt={property.seller.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">
                  {getInitials(property.seller?.name)}
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{property.seller?.name}</p>
                <p className="text-sm text-gray-500">Seller</p>
              </div>
            </div>
            {property.seller?.phone && (
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {property.seller.phone}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {property.seller?.email}
            </div>

            {/* Action Buttons (only for non-owners) */}
            {!isOwner && (
              <div className="space-y-3">
                <Button onClick={handleStartChat} loading={chatLoading} className="w-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Chat with Seller
                </Button>
                <Button variant="secondary" onClick={() => setInquiryOpen(true)} className="w-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Send Inquiry
                </Button>
              </div>
            )}

            {/* Owner notice */}
            {isOwner && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <p className="text-sm text-blue-800">This is your property listing.</p>
                <Link to={`/seller/edit-property/${property._id}`} className="text-sm text-teal-600 hover:text-teal-700 font-medium mt-1 inline-block">
                  Edit Property →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Inquiry Modal ===== */}
      <Modal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} title="Send Inquiry" size="md">
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            You're inquiring about: <strong>{property.title}</strong>
          </p>
          <Textarea
            label="Your Message"
            name="inquiryMessage"
            placeholder="Hi, I'm interested in this property. Could you share more details?"
            value={inquiryMessage}
            onChange={(e) => setInquiryMessage(e.target.value)}
            rows={4}
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setInquiryOpen(false)}>Cancel</Button>
            <Button onClick={handleSendInquiry} loading={inquiryLoading}>Send Inquiry</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function DetailItem({ label, value, icon }) {
  const icons = {
    bed: (<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>),
    bath: (<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>),
    area: (<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>),
    furnish: (<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>),
    type: (<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>),
    status: (<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
    views: (<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>),
    date: (<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>),
  }
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
      <div className="flex-shrink-0 mt-0.5">{icons[icon] || icons.type}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}