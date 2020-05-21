const express = require("express")
var cors = require("cors")

const app = express()
var port = process.env.PORT || 4000

const bodyParser = require("body-parser")
const { sendWelcomeEmail } = require("./emails")
const { storeNewEmail } = require("./db")

app.use(
  bodyParser.json({
    extended: true,
  })
)
app.use(cors())

app.get("/", (req, res) => res.status(201).send())

app.post("/emails", async (req, res) => {
  console.log("here", req.body)
  try {
    if (req.body) {
      const { email } = req.body
      console.log("storing new email", email)
      await storeNewEmail(email)
      console.log("sending welcome email", email)
      await sendWelcomeEmail(email)
    }
    res.status(201).send()
  } catch (e) {
    console.log("error", e)
    res.status(500).send()
  }
})

app.listen(port, () =>
  console.log(`Example listening at http://localhost:${port}`)
)
