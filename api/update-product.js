export const config = {
  runtime: "nodejs",
}

import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" })
    }

    const form = await req.formData()

    const id = Number(form.get("id"))
    const name = form.get("name") || ""
    const description = form.get("description") || ""
    const price = Number(form.get("price") || 0)
    const category = form.get("category") || "General"
    const is_offer = form.get("is_offer") === "true"
    const offer_price = Number(form.get("offer_price") || 0)

    let image_url = form.get("current_image") || null

    const image = form.get("image")

    if (image && typeof image !== "string") {
      const ext = image.name.split(".").pop()
      const fileName = `${crypto.randomUUID()}.${ext}`

      const arrayBuffer = await image.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, buffer, {
          contentType: image.type,
        })

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message })
      }

      const { data: publicUrl } = supabase.storage
        .from("products")
        .getPublicUrl(fileName)

      image_url = publicUrl.publicUrl
    }

    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        description,
        price,
        category,
        is_offer,
        offer_price,
        image_url,
      })
      .eq("id", id)
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data[0])
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
