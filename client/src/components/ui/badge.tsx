interface Props {
  label: string;
  className?: string;
}

export function Badge({ label, className = '' }: Props) {
  return (
    <span
      className={`inline-block px-2.5 py-0.5 text-xs font-sans font-medium tracking-wide uppercase ${className}`}
    >
      {label}
    </span>
  );
}
