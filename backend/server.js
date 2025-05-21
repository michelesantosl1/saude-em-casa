require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Conectar com o MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err))

// Rota base
app.get('/', (req, res) => {
  res.send('API Saúde em Casa funcionando!')
})

// Iniciar servidor
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
