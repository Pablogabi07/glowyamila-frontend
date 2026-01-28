export const config = {
  runtime: "edge",
}

import { createClient } from "@supabase/supabase-js"

export default async function handler(req) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY
    )

    const form = await req.formData()
    const id = Number(form.get("id"))

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing product ID" }), {
        status: 400,
      })
    }

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id)

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      })
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
