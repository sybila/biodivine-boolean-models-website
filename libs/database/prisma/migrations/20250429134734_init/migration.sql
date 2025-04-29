-- CreateTable
CREATE TABLE "BooleanModel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "urlPublication" TEXT NOT NULL,
    "urlModel" TEXT[],
    "keywords" TEXT[],
    "variables" INTEGER NOT NULL,
    "inputs" INTEGER NOT NULL,
    "regulations" INTEGER NOT NULL,
    "notes" TEXT NOT NULL,
    "bib" TEXT NOT NULL,
    "modelData" BYTEA NOT NULL,

    CONSTRAINT "BooleanModel_pkey" PRIMARY KEY ("id")
);
