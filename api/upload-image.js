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
    const file = form.get("file")

    if (!file) {
      return res.status(400).json({ error: "No file provided" })
    }

    const ext = file.name.split(".").pop()
    const fileName = `${crypto.randomUUID()}.${ext}`

    // Convertir Blob → ArrayBuffer → Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, buffer, {
        contentType: file.type,
      })

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message })
    }

    const { data: publicUrl } = supabase.storage
      .from("products")
      .getPublicUrl(fileName)

    return res.status(200).json({ url: publicUrl.publicUrl })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
