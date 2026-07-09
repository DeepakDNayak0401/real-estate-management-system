/** Property type options — matches backend property.model.js enum */
export const PROPERTY_TYPES = [
    'flat',
    'apartment',
    'villa',
    'house',
    'studio',
    'penthouse',
    'office',
    'townhouse',
    'plot',
    'commercial',
]

/** Furnishing options — matches backend property.model.js enum */
export const FURNISHING_OPTIONS = [
    'furnished',
    'semi-furnished',
    'unfurnished',
]

/** Property status options — matches backend property.model.js enum */
export const PROPERTY_STATUS = [
    'sale',
    'sold',
]

/** BHK options for filtering */
export const BHK_OPTIONS = ['1', '2', '3', '4', '5+']

/** User roles — matches backend user.model.js enum */
export const USER_ROLES = ['buyer', 'seller']

/** Sort options for property listing */
export const SORT_OPTIONS = [
    { value: 'latest', label: 'Latest First' },
    { value: 'priceLow', label: 'Price: Low to High' },
    { value: 'priceHigh', label: 'Price: High to Low' },
]

/** Common amenities that users can select */
export const COMMON_AMENITIES = [
    'Parking',
    'Swimming Pool',
    'Gym',
    'Lift',
    'Power Backup',
    'Security',
    'Garden',
    'Balcony',
    'AC',
    'WiFi',
    'Clubhouse',
    'Jogging Track',
    'Children Play Area',
    'Water Supply',
    'Gas Pipeline',
    'Intercom',
    'Vastu Compliant',
    'Pet Friendly',
]

/** Contact form role options */
export const CONTACT_ROLES = ['buyer', 'seller']

/** Items per page for paginated views (if needed) */
export const ITEMS_PER_PAGE = 10

/** Toast auto-dismiss duration in milliseconds */
export const TOAST_DURATION = 3000