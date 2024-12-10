import { AxiosInstance } from "axios";
import { API_VERSION } from "../../../consts";
import {
	parseError,
	Response,
	successResponse,
} from "../../../helpers/apiResponse";
import {
	SimilarCollectionsQueryParams,
	SimilarCollectionsResponse,
	similarCollectionsResponseSchema,
	similarCollectionsResponseSchemaDetailed,
} from "../../../helpers/types/collection";
import { SimilarSearchByKey } from "./byKey";
import { SimilarSearchById } from "./byId";

export const searchSimilar = async (
	client: () => AxiosInstance,
	path: string,
	by: string,
	request: (SimilarSearchByKey | SimilarSearchById) &
		SimilarCollectionsQueryParams,
): Promise<Response<SimilarCollectionsResponse>> => {
	try {
		const response = await client().post(
			`/${API_VERSION}/${path}/similar/${by}`,
			request.data,
			{
				params: request.params,
			},
		);
		const detailed = request.data?.detailed ?? false;
		const parserResponse = (
			detailed
				? similarCollectionsResponseSchemaDetailed
				: similarCollectionsResponseSchema
		).parse(response.data);
		return successResponse(parserResponse);
	} catch (error) {
		return parseError(error);
	}
};
