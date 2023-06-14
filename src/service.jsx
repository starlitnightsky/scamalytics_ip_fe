import Axios from 'axios'
import { API_URL } from './constants'

export const checkIP = async (ip) => {
  try {
    const response = await Axios.post(`${API_URL}/scamalytics-ip`, {
      ip: ip,
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const ipLocation = async (ip) => {
  try {
    const response = await Axios.post(`${API_URL}/ip-location`, {
      ip: ip,
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const proxyCheck = async (payload) => {
  try {
    const response = await Axios.post(`${API_URL}/proxy`, payload)
    return response.data
  } catch (error) {
    console.log(error)
  }
}
