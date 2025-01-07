-- bb_db.sql
--
-- BetterBallot SQL Database
--
-- LAST MODIFIED
-- 2024-12-22


-- Create the database
CREATE DATABASE BB_DB;

-- Create table
CREATE TABLE Municipality (
    City varchar(255),
    State varchar(255)
);

-- TODO: Define prodecures for selecting
-- example:
-- SELECT PersonName, PersonParty FROM Municipality AS m,
-- WHERE m.AreaName="Berkeley"