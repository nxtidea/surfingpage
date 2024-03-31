import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"

export function SkeletonCard() {
  return (
    <div className="flex flex-col h-screen w-3/5 items-center">
      <div className="w-full min-h-16" />
      <Skeleton className="mb-8 w-full min-h-8" />
      <Skeleton className="my-8 w-full min-h-40" />
      <Separator />
      <Skeleton className="my-8 w-full min-h-40" />
    </div>
  )
}
