import type { Database } from "@/integrations/supabase/types"

export type NewsletterSubscription = Database["public"]["Tables"]["newsletter_subscriptions"]["Row"]

export type NewsletterSubscriptionInsert = Database["public"]["Tables"]["newsletter_subscriptions"]["Insert"]

export type NewsletterSubscriptionUpdate = Database["public"]["Tables"]["newsletter_subscriptions"]["Update"]

export interface NewsletterStats {
  totalSubscribers: number
  monthlyGrowth: number
  recentSubscriptions: number
  growthPercentage: number
}

export interface UseNewsletterActionsReturn {
  subscriptions: NewsletterSubscription[]
  stats: NewsletterStats | null
  loading: boolean
  error: string | null
  deleteSubscription: (id: string) => Promise<void>
  refreshData: () => void
}