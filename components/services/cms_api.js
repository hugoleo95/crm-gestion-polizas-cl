import axios from 'axios'

let urlEnv = ''
if (process.env.NODE_ENV === 'development') {
  urlEnv = 'https://cms-headless-api.herokuapp.com/'
} else if (process.env.NODE_ENV === 'production') {
  urlEnv = 'https://cms-headless-api.herokuapp.com/'
} else if (process.env.NODE_ENV === 'staging') {
  urlEnv = 'https://cms-headless-api.herokuapp.com/'
}

const cmsApi = axios.create({
  baseURL: urlEnv
})

export default cmsApi
