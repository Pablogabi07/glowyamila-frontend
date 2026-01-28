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
    const file = form.get("file")

    if (!file) {
      return new Response(JSON.stringify({ error: "No file provided" }), {
        status: 400,
      })
    }

    const ext = file.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${ext}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, buffer, {
        contentType: file.type,
      })

    if (uploadError) {
      return new Response(JSON.stringify({ error: uploadError.message }), {
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
