const { PrismaClient } = require('@prisma/client');

class PrismaClientMock extends PrismaClient {
  bin = {
    upsert: jest.fn(),
  };
  $transaction = jest.fn();
}

module.exports = PrismaClientMock;
