export interface IFetchingBase {
    isFetching: boolean,
    didInvalidate: boolean, 
    apiLastError: string | false
}


export function beginFetching<T extends IFetchingBase>(state: T): T {
    return {
        ...state,
        isFetching: true,
        didInvalidate: false,
        apiLastError: false
    }
}

export function endFetching<T extends IFetchingBase>(state: T, apiLastError: string | false = false): T {
    return {
        ...state,
        isFetching: false,
        didInvalidate: apiLastError === false,
        apiLastError
    }
}