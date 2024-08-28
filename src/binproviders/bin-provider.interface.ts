export interface BinProvider {
    lookup(bin: string): Promise<BinDetails>;
}

// standardize the return type
export interface BinDetails {
    scheme: string;
    brand: string;
    type: string;
    country: string;
    bankName: string;
    bankUrl: string;
    bankPhone: string;
    bankCity: string;
}