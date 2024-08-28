import express from 'express';
import { PrismaClient } from '@prisma/client';
import { BinProvider, BinDetails } from './../binproviders/bin-provider.interface';
import { BinListProvider } from './../binproviders/binlist-provider';

const prisma = new PrismaClient();
const binListProvider = new BinListProvider();

const router = express.Router();

router.get('/api/bin/:bin', async (req, res) => {
    const { bin } = req.params;

    try {
        // First, try to fetch from the database
        let binDetails = await prisma.bin.findUnique({
            where: { bin }
        });

        if (binDetails) {
            const response: BinDetails = {
                scheme: binDetails.scheme,
                brand: binDetails.brand,
                type: binDetails.type,
                country: binDetails.country,
                bankName: binDetails.bankName,
                bankUrl: binDetails.bankUrl,
                bankPhone: binDetails.bankPhone,
                bankCity: binDetails.bankCity
            };
            return res.json(response);
        }

        // If not found in the database, use the BinListProvider
        binDetails = await binListProvider.lookup(bin);
        res.json(binDetails);

    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
