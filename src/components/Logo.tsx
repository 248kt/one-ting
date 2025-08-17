export default function Logo({ size = 20 }:{size?:number}){
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" className="mr-2 text-neutral-900 dark:text-neutral-100">
      <circle cx="12" cy="12" r="10" className="opacity-25 dark:opacity-20" fill="currentColor" />
      <path d="M12 5v8l5 3" stroke="currentColor" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}