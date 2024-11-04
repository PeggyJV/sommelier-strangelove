import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabasePubKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

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
  user_address?: string
  cellar_address?: string
  transaction_hash?: string
  amount?: string
  deposit_token?: string
  chain_id?: string
}) {
  if (!enabled) return

  const {
    event,
    user_address,
    cellar_address,
    transaction_hash,
    amount,
    deposit_token,
    chain_id
  } = options

  if (event === "deposit.succeeded") {
    await supabase.from("deposit").insert({
      user_address,
      cellar_address,
      transaction_hash,
      amount,
      deposit_token,
      chain_id
    })
  }
}
