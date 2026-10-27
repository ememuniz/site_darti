/*
  Warnings:

  - The values [AUTOMAÇÃO_E_TECNOLOGIAS_FISICAS,SISTEMAS_E_INTELIGENCIA_COMPUTACIONAL] on the enum `Board` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Board_new" AS ENUM ('RECURSOS_HUMANOS', 'FINANCEIRO', 'COMUNICACAO', 'AUTOMAÇÃO_E_ROBOTICA', 'SISTEMAS_E_INTELIGENCIA', 'INOVAÇÃO_TRANSDISCIPLINAR');
ALTER TABLE "User" ALTER COLUMN "board" TYPE "Board_new"[] USING ("board"::text::"Board_new"[]);
ALTER TYPE "Board" RENAME TO "Board_old";
ALTER TYPE "Board_new" RENAME TO "Board";
DROP TYPE "public"."Board_old";
COMMIT;
