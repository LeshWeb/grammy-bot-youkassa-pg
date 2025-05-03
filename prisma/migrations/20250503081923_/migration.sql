/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - The required column `userId` was added to the `User` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Order" (
    "orderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "price" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
