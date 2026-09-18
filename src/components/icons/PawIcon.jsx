export default function PawIcon({ className = 'h-12 w-12', color = 'var(--color-pink-500)' }) {
  return (
    <svg viewBox="0 0 48 46" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="24" cy="33" rx="10.5" ry="8.5" fill={color} />
      <ellipse cx="9.5" cy="19.5" rx="4.5" ry="5.8" fill={color} />
      <ellipse cx="19" cy="14.2" rx="4.5" ry="6" fill={color} />
      <ellipse cx="29.5" cy="15" rx="4.2" ry="5.7" fill={color} />
      <ellipse cx="36.5" cy="21.5" rx="4" ry="5.4" fill={color} />
    </svg>
  )
}
