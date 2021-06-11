export interface JsonResponse<TData> extends Response {
    jsonData: TData
}

const jsonFetch = async <TData>(request: RequestInfo): Promise<JsonResponse<TData>> => {
    var response = await fetch(request);
    var jsonData = await response.json() as TData;

    return {
        ...response,
        jsonData
    };
}

export default jsonFetch;