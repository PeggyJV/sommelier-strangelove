import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabasePubKey = process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY ?? ""

type SupabaseClientLike = {
  from: (
    tableName: string
  ) => { insert: (options: Record<string, unknown>) => unknown }
}

class SupabaseNoop {
  from(_tableName: string) {
    return {
      insert: function (_options: Record<string, unknown>) {
        return null
      },
    }
  }
}

// Create a single supabase client for interacting with your database
const enabled = supabaseUrl.length > 0 && supabasePubKey.length > 0

let supabase: SupabaseClientLike = new SupabaseNoop()
if (enabled) {
  supabase = createClient(
    supabaseUrl,
    supabasePubKey
  ) as unknown as SupabaseClientLike
}

export async function insertEvent(options: {
  event: string
  address: string
  cellar?: string
  transaction_hash?: string
}) {
  if (!enabled) return

  const { event, address } = options
  const user_agent = window.navigator.userAgent

  // Only handle non-deposit analytics in Supabase going forward.
  switch (event) {
    case "wallet.connect-succeeded": {
      await supabase
        .from("event_connect")
        .insert({ address, user_agent })
      break
    }
    default: {
      // No-op for deposit-related events; attribution now uses Vercel KV
      return
    }
  }
}
