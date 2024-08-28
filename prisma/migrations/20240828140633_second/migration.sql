/*
  Warnings:

  - You are about to drop the `BinData` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `BinData`;

-- CreateTable
CREATE TABLE `Bin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `bin` VARCHAR(191) NOT NULL,
    `scheme` VARCHAR(15) NOT NULL,
    `brand` VARCHAR(35) NOT NULL,
    `type` VARCHAR(10) NOT NULL,
    `country` VARCHAR(3) NOT NULL,
    `bankName` VARCHAR(45) NOT NULL,
    `bankUrl` VARCHAR(45) NOT NULL,
    `bankPhone` VARCHAR(13) NOT NULL,
    `bankCity` VARCHAR(35) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Bin.bin_unique`(`bin`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
