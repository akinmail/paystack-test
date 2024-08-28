import axios from 'axios';
import { BinProvider, BinDetails } from './bin-provider.interface';

export class BinListProvider implements BinProvider {
    private readonly apiUrl: string = 'https://lookup.binlist.net/';

    async lookup(bin: string): Promise<BinDetails> {
        try {
            const response = await axios.get(`${this.apiUrl}${bin}`, {
                headers: { 'Accept-Version': '3' }
            });

            const data = response.data;

            // Map the BinList API response to the BinDetails interface
            return {
                scheme: data.scheme,
                brand: data.brand,
                type: data.type,
                country: data.country.name,
                bankName: data.bank.name,
                bankUrl: data.bank.url,
                bankPhone: data.bank.phone,
                bankCity: data.bank.city
            };
        } catch (error : any) {
            throw new Error(`Failed to fetch data from BinList: ${error.message}`);
        }
    }
}
