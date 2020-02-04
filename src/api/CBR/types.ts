export interface RawDailyRates {
    Date: string,
    PreviousDate: string,
    PreviousURL: string,
    Timestamp: string,
    Valute: {
        [key: string]: RatesMapping
    }
}

export interface RatesMapping {
    [key: string]: Rate
};

export interface Rate {
    ID: string,
    NumCode: string,
    CharCode: string,
    Nominal: number,
    Name: string,
    Value: number,
    Previous: number
};