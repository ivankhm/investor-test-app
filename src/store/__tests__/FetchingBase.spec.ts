import * as FB from "../Base/FetchingBase";

const initialState: FB.IFetchingBase = {
    isFetching: false,
    didInvalidate: false,
    apiLastError: 'someError'
}

describe('FetchBase helper', () => {
    it('should beginFetching', () => {

        const state = {
            ...initialState,
            didInvalidate: true,
            someValue: 0,
        };

        expect(FB.beginFetching(state))
            .toEqual({
                ...state,
                isFetching: true,
                didInvalidate: false,
                apiLastError: false
            })
    });

    it('should reciveFetch success', () => {
        const state = {
            ...initialState,
            isFetching: true,
            didInvalidate: false,
            someValue: 0,
        };

        expect(FB.endFetching(state, false))
            .toEqual({
                ...state,
                isFetching: false,
                didInvalidate: true,
                apiLastError: false
            })
    })

    it('should reciveFetch error', () => {
        const state = {
            ...initialState,
            isFetching: true,
            didInvalidate: false,
            someValue: 0,
        };
        const newError = 'newError';

        expect(FB.endFetching(state, newError))
            .toEqual({
                ...state,
                isFetching: false,
                didInvalidate: false,
                apiLastError: newError
            })
    })
})