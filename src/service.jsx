import Axios from 'axios'

export const checkIP = async (ip) => {
  try {
    const response = await Axios.post(`http://localhost:8000/scamalytics-ip`, {
      ip: ip,
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const ipLocation = async (ip) => {
  try {
    const response = await Axios.post(`http://localhost:8000/ip-location`, {
      ip: ip,
    })
    return response.data
  } catch (error) {
    console.log(error)
  }
}

export const proxyCheck = async (payload) => {
  try {
    const response = await Axios.post(`http://localhost:8000/proxy`, payload)
    console.log(response)
    return response.data
  } catch (error) {
    console.log(error)
  }
}
