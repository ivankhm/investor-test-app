import { RawSearchMatch, SymbolSearchResult } from "../../../../api/AlphaVantageApi/types"

export const mockSearchMatch: RawSearchMatch = {
    '1. symbol': 'OI',
    '2. name': 'New Item',
    '8. currency': 'usd',

    '3. type': 'string',
    '4. region': 'string',
    '5. marketOpen': 'string',
    '6. marketClose': 'string',
    '7. timezone': 'string',
    '9. matchScore': 1,
}

export const mockSearchResult: SymbolSearchResult = {
    bestMatches: [
        mockSearchMatch
    ]
}