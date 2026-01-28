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

    const name = form.get("name") || ""
    const description = form.get("description") || ""
    const price = Number(form.get("price") || 0)
    const category = form.get("category") || "General"
    const is_offer = form.get("is_offer") === "true"
    const offer_price = Number(form.get("offer_price") || 0)

    let image_url = null

    const image = form.get("image")

    // Si hay imagen, subirla
    if (image && typeof image !== "string") {
      const ext = image.name.split(".").pop()
      const fileName = `${crypto.randomUUID()}.${ext}`

      const arrayBuffer = await image.arrayBuffer()
      const buffer = new Uint8Array(arrayBuffer)

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, buffer, {
          contentType: image.type,
        })

      if (uploadError) {
        return new Response(JSON.stringify({ error: uploadError.message }), {
          status: 500,
        })
      }

      const { data: publicUrl } = supabase.storage
        .from("products")
        .getPublicUrl(fileName)

      image_url = publicUrl.publicUrl
    }

    // Crear producto
    const { data, error } = await supabase
      .from("products")
      .insert([
        {
          name,
          description,
          price,
          category,
          is_offer,
          offer_price,
          image_url,
          active: true,
        },
      ])
      .select()

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      })
    }

    return new Response(JSON.stringify(data[0]), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    })
  }
}
