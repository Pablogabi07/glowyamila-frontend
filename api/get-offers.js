export const config = { runtime: "edge" }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

export default async function handler(req) {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_KEY")
    )

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_offer", true)
      .eq("active", true)

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 500 })
    }

    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
}
