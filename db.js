const admin = require("firebase-admin")

var serviceAccount = require("./service-account.json")
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
  const existingEmails = await getUserEmails()
  if (existingEmails.includes(email)) {
    throw new Error("email already exists")
  }
  await db.collection("users").add({ email })
}

const deleteEmail = async (email) => {
  const usersCollection = await db
    .collection("users")
    .where("email", "==", email)
    .get()

  await db.collection("users").doc(usersCollection.docs[0].id).delete()
}

const getStoreAvailabilities = async () => {
  const collection = await db.collection("available").get()
  return collection.docs[0].data()
}

const updateStoreAvailability = async (update) => {
  const collection = await db.collection("available").get()
  const docId = collection.docs[0].id
  await db.collection("available").doc(docId).update(update)
}

module.exports = {
  getStoredComments,
  storeNewComments,
  getUserEmails,
  storeNewEmail,
  getStoreAvailabilities,
  updateStoreAvailability,
  deleteEmail,
}
