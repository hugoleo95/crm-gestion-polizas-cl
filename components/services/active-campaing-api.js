import axios from 'axios'
const proxyurl = 'https://simplee-cors.herokuapp.com/'

const urlEnv = `${proxyurl}https://simplee71208.api-us1.com/api/3/`
const headers = {
  'Api-Token': '2c97789829e60b5ef5306768e3555760f6a39a894b9f3e7f2eb47c9dbee677f6f0df5a52',
  'Access-Control-Allow-Origin': 'http://localhost:8000',
  'Access-Control-Allow-Credentials': true
}

const activeCApi = axios.create({
  baseURL: urlEnv,
  headers
})

const [SUSCRIBE, UNSUSCRIBE] = [1, 2]

function updateListStatus (list, contact, status) {
  const data = {
    contactList: {
      list,
      contact,
      status
    }
  }
  return activeCApi.post('contactLists/', data)
}

const syncContact = (contact) => {
  return activeCApi.post('contact/sync/', contact)
}
const suscribeToList = (contactId, listId) => {
  return updateListStatus(listId, contactId, SUSCRIBE)
}
const unsuscribeToList = (contactId, listId) => {
  return updateListStatus(listId, contactId, UNSUSCRIBE)
}
export {
  activeCApi,
  suscribeToList,
  syncContact,
  unsuscribeToList
}
