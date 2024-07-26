import FormData from 'form-data'
import { ReadStream } from 'fs'

export const transformObjToFormData = (formdata: FormData, data: object, message: string = '') => {
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'boolean') {
      formdata.append(message === '' ? key : `${message}[${key}]`, `${value}`)
      return
    }
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (message !== '') {
          transformObjToFormData(formdata, item, `${message}[${key}][${index}]`)
          return
        }
        transformObjToFormData(formdata, item, `${key}[${index}]`)
      })
      return
    }
    if (typeof value === 'object' && !(value instanceof ReadStream)) {
      transformObjToFormData(formdata, value, message === '' ? key : `${message}[${key}]`)
      return
    }
    formdata.append(message === '' ? key : `${message}[${key}]`, value)
  })
  return formdata
}
