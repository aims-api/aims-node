import { Client } from '../src/client'

export const checkFormDataValue = (streams: unknown[], value: string) => {
  return streams.some((element: unknown) => {
    if (typeof element !== 'string') {
      return false
    }
    return element.includes(value)
  })
}

export const testClient = new Client({
  authorization: '',
  cookie: '',
})
