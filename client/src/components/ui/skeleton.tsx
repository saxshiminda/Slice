interface Props {
  className?: string;
}

export function Skeleton({ className = '' }: Props) {
  return <div className={`animate-pulse bg-espresso/8 ${className}`} aria-hidden="true" />;
}
