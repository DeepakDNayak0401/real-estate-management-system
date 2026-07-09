import PropertyCard from './PropertyCard.jsx'

/**
 * Horizontal scrollable row of similar property cards.
 * Shown at the bottom of PropertyDetailsPage.
 */
export default function SimilarProperties({ properties = [] }) {
  if (!properties || properties.length === 0) return null

  return (
    <section className="mt-12">
      <h2 className="section-title">Similar Properties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>
    </section>
  )
}