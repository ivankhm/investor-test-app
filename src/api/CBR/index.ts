
import axios from 'axios'
import { RawDailyRates } from './types';

export const apiRoot = 'https://www.cbr-xml-daily.ru/daily_json.js';

export function getExchangeRates() {
    return axios.get<RawDailyRates>(apiRoot);
}