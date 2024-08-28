-- CreateTable
CREATE TABLE `BinData` (
    `bin` VARCHAR(191) NOT NULL,
    `scheme` VARCHAR(191) NOT NULL,
    `brand` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `bankName` VARCHAR(191) NOT NULL,
    `bankUrl` VARCHAR(191) NOT NULL,
    `bankPhone` VARCHAR(191) NOT NULL,
    `bankCity` VARCHAR(191) NOT NULL,
    `lastUpdated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`bin`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
