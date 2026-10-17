-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'LEADER', 'ADMIN', 'STUDENT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';
