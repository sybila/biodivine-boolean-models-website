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
    "variableNames" TEXT[],
    "inputNames" TEXT[],
    "outputNames" TEXT[],

    CONSTRAINT "BooleanModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BooleanModelData" (
    "modelId" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "modelData" BYTEA NOT NULL,

    CONSTRAINT "BooleanModelData_pkey" PRIMARY KEY ("modelId","mimeType")
);
