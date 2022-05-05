/*
  Warnings:

  - You are about to drop the column `otsikko` on the `viesti` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_viesti" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sisalto" TEXT NOT NULL,
    "kirjoittaja" TEXT NOT NULL,
    "aika" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keskusteluId" INTEGER NOT NULL,
    CONSTRAINT "viesti_keskusteluId_fkey" FOREIGN KEY ("keskusteluId") REFERENCES "keskustelu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_viesti" ("aika", "id", "keskusteluId", "kirjoittaja", "sisalto") SELECT "aika", "id", "keskusteluId", "kirjoittaja", "sisalto" FROM "viesti";
DROP TABLE "viesti";
ALTER TABLE "new_viesti" RENAME TO "viesti";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
