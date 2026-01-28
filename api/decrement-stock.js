export const config = { runtime: "edge" }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

export default async function handler(req) {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_KEY")
    )

    const { cart } = await req.json()

    if (!cart || cart.length === 0) {
      return new Response(JSON.stringify({ error: "Carrito vacío" }), {
        status: 400,
      })
    }

    for (const item of cart) {
      const { error } = await supabase.rpc("decrement_stock", {
        product_id: item.id,
        qty: item.quantity,
      })

      if (error) {
        return new Response(
          JSON.stringify({
            error: `Error descontando stock de ${item.name}`,
          }),
          { status: 500 }
        )
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
}
