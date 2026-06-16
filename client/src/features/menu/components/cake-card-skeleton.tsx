import { Skeleton } from '@/components/ui';

export function CakeCardSkeleton() {
  return (
    <div className="flex flex-col h-full bg-cream overflow-hidden">
      <Skeleton className="h-60 flex-shrink-0" />
      <div className="p-5 lg:p-6 flex flex-col flex-1 gap-3">
        <div className="flex items-start justify-between gap-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-7 w-20 mt-2" />
      </div>
    </div>
  );
}
