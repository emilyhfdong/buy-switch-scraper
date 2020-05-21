const express = require("express")
const app = express()
var port = process.env.PORT || 3000

app.get("/", (req, res) => res.status(201).send())

app.listen(port, () =>
  console.log(`Example listening at http://localhost:${port}`)
)
