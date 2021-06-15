import express from 'express'

const app = express()

app.listen(3333, () => {
  console.log('server up at port 3333')
})