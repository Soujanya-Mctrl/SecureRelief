-- CreateEnum
CREATE TYPE "Role" AS ENUM ('DONOR', 'BENEFICIARY', 'VENDOR', 'ADMIN', 'ORACLE');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'PENDING', 'SUSPENDED', 'BLOCKED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "walletAddress" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "nonce" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_walletAddress_key" ON "User"("walletAddress");
