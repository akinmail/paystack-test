import { prisma } from './../app';
import { PrismaClient } from '@prisma/client'

import { processBatch } from './data-injest'; 
import { BinDataFromCSV } from '../types/types';

// Mock prisma
jest.mock('./../app', () => ({
  prisma: {
    bin: {
      upsert: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('processBatch', () => {
  const mockBinData: BinDataFromCSV[] = [
    {
      bin: '123456',
      scheme: 'visa',
      brand: 'visa',
      type: 'credit',
      country: 'US',
      bank_name: 'Chase',
      bank_url: 'https://www.chase.com',
      bank_phone: '+1234567890',
      bank_city: 'New York',
    },
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upsert bin data and log the number of processed records', async () => {
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    (prisma.$transaction as jest.Mock).mockResolvedValueOnce(mockBinData.map(() => ({ success: true })));

    await processBatch(mockBinData);

    // Assert that upsert was called
    expect(prisma.bin.upsert).toHaveBeenCalledTimes(mockBinData.length);
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Array));
    
    // Assert that the log was called
    expect(consoleLogSpy).toHaveBeenCalledWith(`Processed batch of ${mockBinData.length} records.`);

    consoleLogSpy.mockRestore();
  });

  it('should throw an error if transaction fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('Transaction failed');
    (prisma.$transaction as jest.Mock).mockRejectedValueOnce(error);

    await expect(processBatch(mockBinData)).rejects.toThrow('Transaction failed');

    // Assert that error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith("Error processing batch:", error);

    consoleErrorSpy.mockRestore();
  });
});
