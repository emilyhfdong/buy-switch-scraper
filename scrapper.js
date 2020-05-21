const puppeteer = require("puppeteer")
const { getStoreAvailabilities, getUserEmails } = require("./db")
const { sendNotificationEmail } = require("./emails")

const WEBSITES = [
  {
    name: "bestbuy",
    url:
      "https://www.bestbuy.ca/en-ca/product/nintendo-switch-console-with-neon-red-blue-joy-con/13817625",
    getIsAvailable: () => !document.querySelector(`.addToCartButton`).disabled,
  },
  {
    name: "thesource",
    url:
      "https://www.thesource.ca/en-ca/gaming/nintendo-switch/nintendo-switch-consoles-bundles/nintendo-switch%e2%84%a2-1-1-32gb-console-with-neon-joy%e2%80%91con%e2%84%a2/p/108083712?URL=https%3A%2F%2Fwww.thesource.ca%2Fen-ca%2Fgaming%2Fnintendo-switch%2Fnintendo-switch-consoles-bundles%2Fnintendo-switch%25e2%2584%25a2-1-1-32gb-console-with-neon-joy",
    getIsAvailable: () => !document.querySelector(`.addToCartButton`).disabled,
  },
  {
    name: "ebgames",
    url: "https://www.ebgames.ca/Platform/Games/771002",
    getIsAvailable: () =>
      window
        .getComputedStyle(document.getElementById("btnAddToCart"))
        .getPropertyValue("display") !== "none",
  },
  {
    name: "toysrus",
    url:
      "https://www.toysrus.ca/en/Nintendo-Switch-with-Neon-Blue-and-Neon-Red-Joy%E2%80%91Con/49F3D6CA.html",
    getIsAvailable: () => !document.querySelector(".add-to-cart").disabled,
  },
]

const logger = (name, message, ...other) =>
  console.log(`[${name}]: ${message}`, ...other)

const sendAllEmails = async (store, isAvailable) => {
  const users = await getUserEmails()
  const emailPromises = users.map((email) =>
    sendNotificationEmail(store, isAvailable, email)
  )
  await Promise.all(emailPromises)
}

const scrapeSite = async (
  { name, url, getIsAvailable },
  storedAvailabilities
) => {
  logger(name, "launching browser")
  const browser = await puppeteer.launch()
  logger(name, "going to", url)
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: "domcontentloaded" })

  logger(name, "scrapping page")
  const isAvailable = await page.evaluate(getIsAvailable)

  if (storedAvailabilities[name] !== isAvailable) {
    logger(
      name,
      "there was an update! is it now",
      isAvailable ? "in stock" : "out of stock"
    )
    logger(name, "sending email notification")
    await sendAllEmails({ name, url }, isAvailable, "emilyhfdong@gmail.com")
  } else {
    logger(
      name,
      "no updates, it is still",
      isAvailable ? "in stock" : "out of stock"
    )
  }
}

const hi = async () => {
  const storedAvailabilities = await getStoreAvailabilities()
  const scrapeSitePromises = WEBSITES.map((website) =>
    scrapeSite(website, storedAvailabilities)
  )
  await Promise.all(scrapeSitePromises)
  console.log("Done")
}
hi()
