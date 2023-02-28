#!/bin/bash

{ cat | sqlite3 database.sqlite3; } <<EOF

DROP TABLE pt;

CREATE TABLE "pt"  (
    "AtomicNumber"      INTEGER,
    "Element"           TEXT,
    "Symbol"            TEXT,
    "AtomicMass"        INTEGER,
    "NumberofNeutrons"  INTEGER,
    "NumberofProtons"   INTEGER,
    "NumberofElectrons" INTEGER,
    "Period"            INTEGER,
    "Group"             INTEGER,
    "Phase"             TEXT,
    "Radioactive"       TEXT,
    "Natural"           TEXT,
    "Metal"             TEXT,
    "Nonmetal"          TEXT,
    "Metalloid"         TEXT,
    "Type"              TEXT,
    "AtomicRadius"      REAL,
    "Electronegativity" REAL,
    "FirstIonization"   REAL,
    "Density"           REAL,
    "MeltingPoint"      REAL,
    "BoilingPoint"      REAL,
    "NumberOfIsotopes"  INTEGER,
    "Discoverer"        INTEGER,
    "Year"              INTEGER,
    "SpecificHeat"      REAL,
    "NumberofShells"    INTEGER,
    "NumberofValence"   INTEGER
);

.separator ","
.import --csv --skip 1 periodic_table.csv pt

EOF

base64 database.sqlite3 > database.base64
