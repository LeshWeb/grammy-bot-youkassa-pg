/*
  Warnings:

  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_orderId_fkey";

-- DropIndex
DROP INDEX "Order_orderId_key";

-- DropIndex
DROP INDEX "User_userId_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId");

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
