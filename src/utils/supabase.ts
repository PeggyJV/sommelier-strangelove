import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabasePubKey = process.env.NEXT_PUBLIC_SUPABASE_PUB_KEY ?? ""

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, supabasePubKey)
const enabled = supabaseUrl.length > 0 && supabasePubKey.length > 0

export async function insertEvent(options: {
  event: string
  address: string
  cellar?: string
}) {
  if (!enabled) return

  const { event, address, cellar } = options

  switch (event) {
    case "wallet.connect-succeeded": {
      await supabase.from("event_connect").insert({ address })
      break
    }
    case "deposit.started": {
      await supabase
        .from("event_deposit_started")
        .insert({ address, cellar })
      break
    }
    case "deposit.succeeded": {
      await supabase
        .from("event_deposit_success")
        .insert({ address, cellar })
      break
    }
  }
}
