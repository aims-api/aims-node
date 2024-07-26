import { AxiosInstance } from 'axios'
import { API_VERSION } from '../../consts'
import { parseError, Response, successResponse } from '../../helpers/apiResponse'
import { AutocompleteResponse, autocompleteRawResponseSchema } from '../../helpers/types/search'

export const promptSuggestions =
  (client: () => AxiosInstance) =>
  async (request: string): Promise<Response<AutocompleteResponse>> => {
    try {
      const response = await client().post(`/${API_VERSION}/prompt-suggestions`, { query: request })
      const parserResponse = autocompleteRawResponseSchema.parse(response.data)
      return successResponse({
        ...parserResponse,
        suggestions: parserResponse.suggestions ?? [],
      })
    } catch (error) {
      return parseError(error)
    }
  }
