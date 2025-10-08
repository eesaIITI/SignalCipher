export function Loader({ label = "Loading..." }) {
  return (
    <div className="inline-flex items-center gap-2" role="status" aria-live="polite" aria-label={label}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
      <span className="text-sm text-primary-foreground/80">{label}</span>
    </div>
  )
}

export default Loader
