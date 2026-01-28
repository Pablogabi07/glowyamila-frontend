export const config = { runtime: "edge" }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

export default async function handler(req) {
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_KEY")
    )

    const form = await req.formData()
    const file = form.get("file")

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      })
    }

    const ext = file.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, file, {
        contentType: file.type,
      })

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError }), {
        status: 500,
      })
    }

    const { data: publicUrl } = supabase.storage
      .from("products")
      .getPublicUrl(fileName)

    return new Response(JSON.stringify({ url: publicUrl.publicUrl }), {
      headers: { "Content-Type": "application/json" },
    })

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
}
