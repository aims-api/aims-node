import { Response, parseError, successResponse } from '../apiResponse'

const baseUrl = 'https://music.apple.com/'

const parseAppleMusicAmpApiBearerToken = async () => {
  const scriptPath = await parseAppleMusicScriptPath()
  const response = await fetch(baseUrl + scriptPath)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const src = await response.text()

  const variableNameRegexp = /Authorization\s*=\s*`Bearer\s+\$\{([^}]+)\}`/
  const match = src.match(variableNameRegexp)

  if (!match || !match[1]) {
    throw new Error('Variable name not found in script')
  }
  const [, variableName] = match

  const escapedVariableName = variableName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
  const tokenRegexp = new RegExp(String.raw`const\s+${escapedVariableName}\s*=\s*\"([^\"]+)\"`)
  const tokenMatch = src.match(tokenRegexp)

  if (!tokenMatch || !tokenMatch[1]) {
    throw new Error('Token not found in script')
  }

  const [, token] = tokenMatch
  return token
}

const parseAppleMusicScriptPath = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const html = await response.text()
  const regex = /\/assets\/index-[^.]+.js/
  const match = html.match(regex)

  if (!match) {
    throw new Error('Apple Music script path not found')
  }

  return match[0]
}

export const getAppleMusicToken = async (): Promise<Response<unknown>> => {
  try {
    const response = await parseAppleMusicAmpApiBearerToken()
    return successResponse(response)
  } catch (error) {
    return parseError(error)
  }
}
