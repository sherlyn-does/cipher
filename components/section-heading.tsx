import { ScrambleText } from './scramble-text'

interface SectionHeadingProps {
  label: string
  title: string
  className?: string
}

export function SectionHeading({
  label,
  title,
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.35em] text-[var(--matrix)]">
        <span className="text-glow">//</span>
        <span>{label}</span>
      </div>
      <ScrambleText
        as="h2"
        text={title}
        className="font-display text-3xl leading-tight text-foreground text-glow sm:text-4xl md:text-5xl"
      />
    </div>
  )
}
