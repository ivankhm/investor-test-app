export interface IFetchingBase {
    isFetching: boolean,
    didInvalidate: boolean,
    apiLastError: string | false
}

export function beginFetching<T extends IFetchingBase>(state: T): T {
    state.isFetching = true;
    state.didInvalidate = false;
    state.apiLastError = false;

    return state;
}

export function endFetching<T extends IFetchingBase>(state: T, apiLastError: string | false = false): T {
    state.isFetching = false;
    state.didInvalidate = apiLastError === false;
    state.apiLastError = apiLastError;

    return state;
}