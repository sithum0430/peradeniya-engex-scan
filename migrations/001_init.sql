-- migrations/001_init.sql
DROP TABLE IF EXISTS EntryExitLog CASCADE;
DROP TABLE IF EXISTS BUILDING CASCADE;

CREATE TABLE BUILDING (
  building_id SERIAL PRIMARY KEY,
  building_name VARCHAR(255) NOT NULL
);

CREATE TABLE EntryExitLog (
  log_id SERIAL PRIMARY KEY,
  qr_value VARCHAR(255) NOT NULL,
  building_id INT NOT NULL,
  action VARCHAR(10) NOT NULL CHECK (action IN ('entry','exit')),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  scanned_by TEXT,
  CONSTRAINT fk_building FOREIGN KEY (building_id)
    REFERENCES BUILDING (building_id) ON DELETE CASCADE
);

-- sample buildings
INSERT INTO BUILDING (building_name) VALUES ('Computer Science');
INSERT INTO BUILDING (building_name) VALUES ('Engineering');
