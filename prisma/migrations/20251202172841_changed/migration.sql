/*
  Warnings:

  - A unique constraint covering the columns `[userId,user_agent]` on the table `tokens` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "tokens" DROP CONSTRAINT "tokens_userId_fkey";

-- DropIndex
DROP INDEX "tokens_token_user_agent_key";

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "userId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tokens_userId_user_agent_key" ON "tokens"("userId", "user_agent");

-- AddForeignKey
ALTER TABLE "tokens" ADD CONSTRAINT "tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
