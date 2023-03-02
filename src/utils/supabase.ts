import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabasePubKey = process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY ?? ""

class SupabaseNoop {
  async from(tableName: string) {
    return { insert: function (options: any) {} }
  }
}

// Create a single supabase client for interacting with your database
const enabled = supabaseUrl.length > 0 && supabasePubKey.length > 0

let supabase: any = new SupabaseNoop()
if (enabled) {
  supabase = createClient(supabaseUrl, supabasePubKey)
}

export async function insertEvent(options: {
  event: string
  address: string
  cellar?: string
  transaction_hash?: string
}) {
  if (!enabled) return

  const { event, address, cellar, transaction_hash } = options
  const user_agent = window.navigator.userAgent

  switch (event) {
    case "wallet.connect-succeeded": {
      await supabase
        .from("event_connect")
        .insert({ address, user_agent })
      break
    }
    case "deposit.started": {
      await supabase
        .from("event_deposit_started")
        .insert({ address, cellar, user_agent })
      break
    }
    case "deposit.succeeded": {
      await supabase.from("event_deposit_success").insert({
        address,
        cellar,
        transaction_hash,
        user_agent,
      })
      break
    }
  }
}
