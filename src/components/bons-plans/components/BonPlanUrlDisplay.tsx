
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { getFullUrl } from "../utils/urlUtils"

interface BonPlanUrlDisplayProps {
  url: string | null
}

export function BonPlanUrlDisplay({ url }: BonPlanUrlDisplayProps) {
  const fullUrl = getFullUrl(url)

  if (!fullUrl) {
    return (
      <span className="text-sm text-muted-foreground">Aucune URL</span>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
        {fullUrl}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => window.open(fullUrl, '_blank')}
        className="h-6 w-6 p-0"
      >
        <ExternalLink className="h-3 w-3" />
      </Button>
    </div>
  )
}
