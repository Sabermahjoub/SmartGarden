-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for gardenpy
CREATE DATABASE IF NOT EXISTS `gardenpy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gardenpy`;

CREATE TABLE IF NOT EXISTS `task` (
  `task_id` INT NOT NULL AUTO_INCREMENT,
  `task_name` VARCHAR(30) NOT NULL, 
  `description` VARCHAR(255) NOT NULL,  
  `task_type` VARCHAR(50) NOT NULL, 
  `starting_time` VARCHAR(10),
  `ending_time` VARCHAR(10),
  `plant` VARCHAR(50) NOT NULL, 
  `done` BOOLEAN NOT NULL,
  `date` VARCHAR(10) NOT NULL,

  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Dumping structure for table gardenpy.sensor_data
CREATE TABLE IF NOT EXISTS `sensor_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `temperature` float NOT NULL,
  `humidity` float NOT NULL,
  `light_percentage` float NOT NULL,
  `moisture` float NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `plant` (
  `plant_name` VARCHAR(20) NOT NULL,
  `minTemp_day` INT NOT NULL,
  `maxTemp_day` INT NOT NULL,
  `minTemp_night` INT NOT NULL,
  `maxTemp_night` INT NOT NULL,
  `minHumidity` INT NOT NULL,
  `maxHumidity` INT NOT NULL,
  `Wind` VARCHAR(10) NOT NULL,
  `minUVIndex` INT NOT NULL,
  `maxUVIndex` INT NOT NULL,
  `minLight` INT NOT NULL,
  `maxLight` INT NOT NULL,
  `minSoilMoisture` INT NOT NULL,
  `maxSoilMoisture` INT NOT NULL,
  `lastDateOfIrrigation` VARCHAR(10) NOT NULL,
  `lastDateOfFertilizer` VARCHAR(10) NOT NULL,
  `lastDateOfPesticide` VARCHAR(10) NOT NULL,
  `lastDateOfNutrients` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`plant_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Dumping data for table gardenpy.sensor_data: ~128 rows (approximately)
INSERT INTO `sensor_data` (`id`, `temperature`, `humidity`, `light_percentage`,`moisture`, `timestamp`) VALUES
	(1, 24, 77, 27.6923, 50, '2024-12-09 12:04:04'),
	(2, 24, 77, 27.6679, 50, '2024-10-24 20:04:11'),
	(3, 24, 77, 27.9853, 50, '2024-10-24 20:04:19'),
	(4, 24, 77, 28.3028,50, '2024-10-24 20:04:26'),
	(5, 24, 77, 28.5226,50, '2024-10-24 20:04:33'),
	(6, 24, 77, 32.8938,50, '2024-10-24 20:04:40'),
	(7, 24, 77, 27.2039,50, '2024-10-24 20:04:47'),
	(8, 24, 77, 15.873,50, '2024-10-24 20:04:55'),
	(9, 24, 77, 1.39194,50, '2024-10-24 20:05:02'),
	(10, 24, 77, 26.9597,50, '2024-10-24 20:05:09'),
	(11, 24, 77, 27.2772,50, '2024-10-24 20:05:16'),
	(12, 24, 77, 27.7411,50, '2024-10-24 20:05:23'),
	(13, 24, 77, 27.5946,50, '2024-10-24 20:05:30'),
	(14, 24, 77, 27.4725,50, '2024-10-24 20:05:38'),
	(15, 24, 77, 27.1306,50, '2024-10-24 20:05:45'),
	(16, 24, 77, 27.7656,50, '2024-10-24 20:05:52'),
	(17, 24, 77, 27.2528,50, '2024-10-24 20:05:59'),
	(18, 24, 77, 25.5434,50, '2024-10-24 20:06:06'),
	(19, 24, 77, 10.2564,50, '2024-10-24 20:06:13'),
	(20, 24, 77, 10.8913,50, '2024-10-24 20:06:21'),
	(21, 24, 77, 10.7204,50, '2024-10-24 20:06:28'),
	(22, 24, 77, 6.86203,50, '2024-10-24 20:06:35'),
	(23, 24, 77, 6.91087,50, '2024-10-24 20:06:42'),
	(24, 24, 77, 6.30037, 50 , '2024-10-24 20:06:49'),
	(25, 24, 77, 5.93407, 50 , '2024-10-24 20:06:56'),
	(26, 24, 77, 10.8181, 50 , '2024-10-24 20:07:04'),
	(27, 24, 77, 10.4762, 50 , '2024-10-24 20:07:11'),
	(28, 24, 77, 10.8669, 50 , '2024-10-24 20:07:18'),
	(29, 24, 77, 10.8181, 50 , '2024-10-24 20:07:25'),
	(30, 24, 77, 10.5983, 50 , '2024-10-24 20:07:32'),
	(31, 24, 77, 10.6227, 50 , '2024-10-24 20:07:39'),
	(32, 24, 77, 10.7692, 50 , '2024-10-24 20:07:47'),
	(33, 24, 77, 10.8669, 50 , '2024-10-24 20:07:54'),
	(34, 24, 77, 10.8669, 50 , '2024-10-24 20:08:01'),
	(35, 24, 77, 10.5494, 50 , '2024-10-24 20:08:08'),
	(36, 24, 77, 10.5739, 50 , '2024-10-24 20:08:17'),
	(37, 24, 77, 10.7692, 50 , '2024-10-24 20:08:22'),
	(38, 24, 77, 11.1355, 50 , '2024-10-24 20:08:30')

INSERT INTO `plant` 
  VALUES (
  'Tomato',
  20, -- minTemp_day
  27, -- maxTemp_day
  15, -- minTemp_night
  20, -- maxTemp_night
  65, -- minHumidity
  85, -- maxHumidity
  'Light', -- Wind
  6, -- minUVIndex
  8, -- maxUVIndex
  25, -- minLight (%)
  50, -- maxLight (%)
  60, -- minSoilMoisture (% field capacity)
  70, -- maxSoilMoisture (% field capacity)
  '', -- lastDateOfIrrigation (to be filled later)
  '', -- lastDateOfFertilizer (to be filled later)
  '', -- lastDateOfPesticide (to be filled later)
  ''  -- lastDateOfNutrients (to be filled later)
);

INSERT INTO `plant`
 VALUES (
  'Chickpea',
  20, -- minTemp_day
  30, -- maxTemp_day
  10, -- minTemp_night
  20, -- maxTemp_night
  50, -- minHumidity
  60, -- maxHumidity
  'Moderate', -- Wind
  6, -- minUVIndex
  8, -- maxUVIndex
  25, -- minLight (%)
  50, -- maxLight (%)
  50, -- minSoilMoisture (% field capacity)
  70, -- maxSoilMoisture (% field capacity)
  '', -- lastDateOfIrrigation (to be filled later)
  '', -- lastDateOfFertilizer (to be filled later)
  '', -- lastDateOfPesticide (to be filled later)
  ''  -- lastDateOfNutrients (to be filled later)
);

INSERT INTO `plant` 
VALUES (
  'Pepper',
  20, -- minTemp_day
  30, -- maxTemp_day
  15, -- minTemp_night
  20, -- maxTemp_night
  50, -- minHumidity
  70, -- maxHumidity
  'Moderate', -- Wind
  6, -- minUVIndex
  8, -- maxUVIndex
  30, -- minLight (%)
  50, -- maxLight (%)
  50, -- minSoilMoisture (% field capacity)
  70, -- maxSoilMoisture (% field capacity)
  '', -- lastDateOfIrrigation (to be filled later)
  '', -- lastDateOfFertilizer (to be filled later)
  '', -- lastDateOfPesticide (to be filled later)
  ''  -- lastDateOfNutrients (to be filled later)
);


INSERT INTO `plant`
 VALUES (
  'Pea',
  15, -- minTemp_day
  25, -- maxTemp_day
  10, -- minTemp_night
  15, -- maxTemp_night
  50, -- minHumidity
  70, -- maxHumidity
  'Moderate', -- Wind
  4, -- minUVIndex
  8, -- maxUVIndex
  20, -- minLight (%)
  40, -- maxLight (%)
  60, -- minSoilMoisture (% field capacity)
  80, -- maxSoilMoisture (% field capacity)
  '', -- lastDateOfIrrigation (to be filled later)
  '', -- lastDateOfFertilizer (to be filled later)
  '', -- lastDateOfPesticide (to be filled later)
  ''  -- lastDateOfNutrients (to be filled later)
);


-- Table for logs 
CREATE TABLE IF NOT EXISTS `logs` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `plant_name` VARCHAR(20),
  `operation` VARCHAR(20) NOT NULL, -- nutrients, pesticides, irrigation
  `date` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`plant_name`) REFERENCES `plant`(`plant_name`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Inserting into logs 
INSERT into `logs` (`plant_name`, `operation`, `date`) values ('Tomato','Watering','07/12/2024')
INSERT into `logs` (`plant_name`, `operation`, `date`) values ('Tomato','Watering','26/11/2024')
INSERT into `logs` (`plant_name`, `operation`, `date`) values ('Chickpea','Fertilizer','11/11/2024')
INSERT into `logs` (`plant_name`, `operation`, `date`) values ('Chickpea','Pesticides','30/10/2024')
INSERT into `logs` (`plant_name`, `operation`, `date`) values ('Pea','Watering','07/12/2024')
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
