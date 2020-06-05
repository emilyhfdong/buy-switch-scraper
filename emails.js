const mailjet = require("node-mailjet").connect(
  "ae34e66977a181015ef0b610ed41ab66",
  "379ba05fd768d8020e63f275663f0512"
)

const FORM_URL = "https://buy-switch.netlify.app"

const getUnsubscribeLink = (email) =>
  `<a href=${FORM_URL}?email=${email} >unsubscribe</a>`

const formatNotificationEmail = ({ name, url }, inStock, email) =>
  inStock
    ? `<div><h1>ITS IN STOCK AT ${name.toUpperCase()}!! GO GO GO GO</h1><a href=${url} >BUY HERE</a>${getUnsubscribeLink(
        email
      )}</div>`
    : `<div><h1>Sad times its no longer in stock at ${name.toUpperCase()}</h1><p>try again next time</p>${getUnsubscribeLink(
        email
      )}</div>`

const getWelcomeEmail = (email) =>
  `<div><h1>You're on the list!</h1><p>We will send you emails whenever updates to Best Buy, The Source, Toys R Us, or EB Games</p>${getUnsubscribeLink(
    email
  )}</div>`

const sendNotificationEmail = async (store, inStock, emailAddress) => {
  await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "emilyhfdong@gmail.com",
        },
        To: [
          {
            Email: emailAddress,
          },
        ],
        Subject: inStock
          ? "🙌😱✨Switch is now in stock!✨😱🙌"
          : "😭Switch is no longer in stock😭",
        TextPart: formatNotificationEmail(store, inStock, emailAddress),
        HTMLPart: formatNotificationEmail(store, inStock, emailAddress),
        CustomID: Date.now().toString(),
      },
    ],
  })
}
const sendWelcomeEmail = async (emailAddress) => {
  await mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "emilyhfdong@gmail.com",
        },
        To: [
          {
            Email: emailAddress,
          },
        ],
        Subject: "💕✨You're on the list!✨💕",
        TextPart: getWelcomeEmail(emailAddress),
        HTMLPart: getWelcomeEmail(emailAddress),
        CustomID: Date.now().toString(),
      },
    ],
  })
}

module.exports = {
  sendNotificationEmail,
  sendWelcomeEmail,
}
