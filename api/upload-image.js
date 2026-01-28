import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'
import fs from 'fs'

export const config = {
  api: {
    bodyParser: false, // necesario para manejar archivos
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

    const { files } = form
    const file = files.file

    if (!file) {
      return res.status(400).json({ error: 'No file provided' })
    }

    const ext = file.originalFilename.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${ext}`
    const fileBuffer = fs.readFileSync(file.filepath)

    // Subir archivo a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, fileBuffer, {
        contentType: file.mimetype,
      })

    if (uploadError) {
      return res.status(500).json({ error: uploadError.message })
    }

    // Obtener URL pública
    const { data: publicUrl } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    return res.status(200).json({ url: publicUrl.publicUrl })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
