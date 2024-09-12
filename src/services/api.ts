import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

export const getItems = () => {
  return axios.get(`${API_URL}/items`)
}

export const createItem = (item: { name: string; value: string }) => {
  return axios.post(`${API_URL}/items`, item)
}
