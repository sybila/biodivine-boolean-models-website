-- CreateTable
CREATE TABLE "Model" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "urlPublication" TEXT NOT NULL,
    "urlModel" TEXT NOT NULL,
    "keywords" TEXT[],
    "variables" INTEGER NOT NULL,
    "inputs" INTEGER NOT NULL,
    "regulations" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "bib" TEXT NOT NULL,
    "modelData" BYTEA NOT NULL,

    CONSTRAINT "Model_pkey" PRIMARY KEY ("id")
);
