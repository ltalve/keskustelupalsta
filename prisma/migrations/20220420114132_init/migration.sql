-- CreateTable
CREATE TABLE "keskustelu" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "otsikko" TEXT NOT NULL,
    "sisalto" TEXT NOT NULL,
    "kirjoittaja" TEXT NOT NULL,
    "aika" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "viesti" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "otsikko" TEXT NOT NULL,
    "sisalto" TEXT NOT NULL,
    "kirjoittaja" TEXT NOT NULL,
    "aika" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keskusteluId" INTEGER NOT NULL,
    CONSTRAINT "viesti_keskusteluId_fkey" FOREIGN KEY ("keskusteluId") REFERENCES "keskustelu" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
