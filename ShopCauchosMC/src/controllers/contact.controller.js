import { sendContactEmail } from '../services/emailContact.js'

export async function contactMessage(req, res) {
  try {
    const { empresa, correo, telefono, mensaje } = req.body || {}
    const body = `Empresa: ${empresa}\nCorreo: ${correo}\nTeléfono: ${telefono}\n\nMensaje:\n${mensaje}`
    
    const result = await sendContactEmail(body)
    res.status(200).json({ ok: true, result })
  } catch (error) {
    console.log(error)
    res.status(500).json({ ok: false, error: error.message })
  }
}

