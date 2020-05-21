const admin = require("firebase-admin")

var serviceAccount = require("../service-account.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://buy-switch.firebaseio.com",
})

const db = admin.firestore()

const getStoredComments = async () => {
  const commentsCollection = await db.collection("comments").get()
  const comments = commentsCollection.docs.map((store) => store.data())
  return comments
}

const storeNewComments = async (newComments) => {
  const storeCommentPromises = newComments.map((comment) =>
    db.collection("comments").add(comment)
  )
  await Promise.all(storeCommentPromises)
}

const getUserEmails = async () => {
  const users = await db.collection("users").get()
  return users.docs.map((doc) => doc.data().email)
}

const storeNewEmail = async (email) => {
  await db.collection("users").add({ email })
}

const getStoreAvailabilities = async () => {
  const collection = await db.collection("available").get()
  return collection.docs[0].data()
}

module.exports = {
  getStoredComments,
  storeNewComments,
  getUserEmails,
  storeNewEmail,
  getStoreAvailabilities,
}
