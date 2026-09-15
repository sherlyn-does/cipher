import { OrbitCarousel, type CarouselImage } from '../orbit-carousel'

const CARDS: CarouselImage[] = [
  { src: '/carousel/slot-1.png', alt: 'Leadership portrait placeholder 1', caption: '01' },
  { src: '/carousel/slot-2.png', alt: 'Leadership portrait placeholder 2', caption: '02' },
  { src: '/carousel/slot-3.png', alt: 'Leadership portrait placeholder 3', caption: '03' },
  { src: '/carousel/slot-4.png', alt: 'Leadership portrait placeholder 4', caption: '04' },
  { src: '/carousel/slot-5.png', alt: 'Leadership portrait placeholder 5', caption: '05' },
  { src: '/carousel/slot-6.png', alt: 'Leadership portrait placeholder 6', caption: '06' },
]

export function Leadership() {
  return (
    <section
      id="leadership"
      className="relative border-t border-[var(--border)]"
    >
      <OrbitCarousel
        images={CARDS}
        eyebrow="governance"
        title="Leadership Structure"
        description="Drag to explore the collective. Select a card to expand it."
      />
    </section>
  )
}
