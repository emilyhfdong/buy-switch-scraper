const express = require("express")
const app = express()
var port = process.env.PORT || 3000

app.get("/", (req, res) => res.status(201).send())

app.listen(port, () =>
  console.log(`Example listening at http://localhost:${port}`)
)

app.post("/emails", async (req, res) => {
  try {
    if (req.body.email) {
      await storeNewEmail(req.body.email)
      await sendWelcomeEmail(req.body.email)
    }
    res.status(201).send()
  } catch (e) {
    res.status(500).send()
  }
})
