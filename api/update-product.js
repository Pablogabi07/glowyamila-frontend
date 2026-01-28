import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false, // necesario para manejar formData con archivos
  },
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
)

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    // Parsear formData con formidable
    const form = await new Promise((resolve, reject) => {
      const form = formidable({ multiples: false })
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        resolve({ fields, files })
      })
    })

    const { fields, files } = form

    const id = Number(fields.id)
    const name = fields.name || ''
    const description = fields.description || ''
    const price = Number(fields.price || 0)
    const category = fields.category || 'General'
    const is_offer = fields.is_offer === 'true'
    const offer_price = Number(fields.offer_price || 0)

    let image_url = fields.current_image || null

    // Si hay imagen nueva, subirla
    if (files.image) {
      const file = files.image
      const ext = file.originalFilename.split('.').pop()
      const fileName = `${crypto.randomUUID()}.${ext}`
      const fileBuffer = fs.readFileSync(file.filepath)

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(fileName, fileBuffer, {
          contentType: file.mimetype,
        })

      if (uploadError) {
        return res.status(500).json({ error: uploadError.message })
      }

      const { data: publicUrl } = supabase.storage
        .from('products')
        .getPublicUrl(fileName)

      image_url = publicUrl.publicUrl
    }

    // Actualizar producto
    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        category,
        is_offer,
        offer_price,
        image_url,
      })
      .eq('id', id)
      .select()

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data[0])
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
