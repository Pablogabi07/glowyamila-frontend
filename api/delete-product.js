import { createClient } from '@supabase/supabase-js'
import formidable from 'formidable'

export const config = {
  api: {
    bodyParser: false, // necesario para manejar formData
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

    // Parsear formData
    const form = await new Promise((resolve, reject) => {
      const form = formidable({ multiples: false })
      form.parse(req, (err, fields) => {
        if (err) reject(err)
        resolve(fields)
      })
    })

    const id = Number(form.id)

    if (!id) {
      return res.status(400).json({ error: 'Missing product ID' })
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
