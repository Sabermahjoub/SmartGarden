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

  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB AUTO_INCREMENT=142 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Dumping structure for table gardenpy.sensor_data
CREATE TABLE IF NOT EXISTS `sensor_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `temperature` float NOT NULL,
  `humidity` float NOT NULL,
  `light_percentage` float NOT NULL,
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
INSERT INTO `sensor_data` (`id`, `temperature`, `humidity`, `light_percentage`, `timestamp`) VALUES
	(1, 24, 77, 27.6923, '2024-10-24 20:04:04'),
	(2, 24, 77, 27.6679, '2024-10-24 20:04:11'),
	(3, 24, 77, 27.9853, '2024-10-24 20:04:19'),
	(4, 24, 77, 28.3028, '2024-10-24 20:04:26'),
	(5, 24, 77, 28.5226, '2024-10-24 20:04:33'),
	(6, 24, 77, 32.8938, '2024-10-24 20:04:40'),
	(7, 24, 77, 27.2039, '2024-10-24 20:04:47'),
	(8, 24, 77, 15.873, '2024-10-24 20:04:55'),
	(9, 24, 77, 1.39194, '2024-10-24 20:05:02'),
	(10, 24, 77, 26.9597, '2024-10-24 20:05:09'),
	(11, 24, 77, 27.2772, '2024-10-24 20:05:16'),
	(12, 24, 77, 27.7411, '2024-10-24 20:05:23'),
	(13, 24, 77, 27.5946, '2024-10-24 20:05:30'),
	(14, 24, 77, 27.4725, '2024-10-24 20:05:38'),
	(15, 24, 77, 27.1306, '2024-10-24 20:05:45'),
	(16, 24, 77, 27.7656, '2024-10-24 20:05:52'),
	(17, 24, 77, 27.2528, '2024-10-24 20:05:59'),
	(18, 24, 77, 25.5434, '2024-10-24 20:06:06'),
	(19, 24, 77, 10.2564, '2024-10-24 20:06:13'),
	(20, 24, 77, 10.8913, '2024-10-24 20:06:21'),
	(21, 24, 77, 10.7204, '2024-10-24 20:06:28'),
	(22, 24, 77, 6.86203, '2024-10-24 20:06:35'),
	(23, 24, 77, 6.91087, '2024-10-24 20:06:42'),
	(24, 24, 77, 6.30037, '2024-10-24 20:06:49'),
	(25, 24, 77, 5.93407, '2024-10-24 20:06:56'),
	(26, 24, 77, 10.8181, '2024-10-24 20:07:04'),
	(27, 24, 77, 10.4762, '2024-10-24 20:07:11'),
	(28, 24, 77, 10.8669, '2024-10-24 20:07:18'),
	(29, 24, 77, 10.8181, '2024-10-24 20:07:25'),
	(30, 24, 77, 10.5983, '2024-10-24 20:07:32'),
	(31, 24, 77, 10.6227, '2024-10-24 20:07:39'),
	(32, 24, 77, 10.7692, '2024-10-24 20:07:47'),
	(33, 24, 77, 10.8669, '2024-10-24 20:07:54'),
	(34, 24, 77, 10.8669, '2024-10-24 20:08:01'),
	(35, 24, 77, 10.5494, '2024-10-24 20:08:08'),
	(36, 24, 77, 10.5739, '2024-10-24 20:08:17'),
	(37, 24, 77, 10.7692, '2024-10-24 20:08:22'),
	(38, 24, 77, 11.1355, '2024-10-24 20:08:30'),
	(39, 24, 77, 10.7204, '2024-10-24 20:08:37'),
	(40, 24, 77, 10.9157, '2024-10-24 20:08:44'),
	(41, 24, 77, 10.9402, '2024-10-24 20:08:51'),
	(42, 24, 77, 10.7936, '2024-10-24 20:08:58'),
	(43, 24, 77, 10.8669, '2024-10-24 20:09:05'),
	(44, 24, 77, 10.8913, '2024-10-24 20:09:13'),
	(45, 24, 77, 11.2088, '2024-10-24 20:09:20'),
	(46, 24, 77, 10.9646, '2024-10-24 20:09:27'),
	(47, 24, 77, 11.1111, '2024-10-24 20:09:34'),
	(48, 24, 77, 10.7204, '2024-10-24 20:09:41'),
	(49, 24, 77, 10.9157, '2024-10-24 20:09:48'),
	(50, 24, 77, 10.5739, '2024-10-24 20:09:56'),
	(51, 24, 77, 10.6227, '2024-10-24 20:10:03'),
	(52, 24, 77, 10.5006, '2024-10-24 20:10:10'),
	(53, 24, 77, 10.6227, '2024-10-24 20:10:17'),
	(54, 24, 77, 10.5494, '2024-10-24 20:10:24'),
	(55, 24, 77, 10.3053, '2024-10-24 20:10:32'),
	(56, 24, 77, 10.4274, '2024-10-24 20:10:39'),
	(57, 24, 77, 10.3053, '2024-10-24 20:10:46'),
	(58, 24, 77, 10.0855, '2024-10-24 20:10:53'),
	(59, 24, 77, 10.5739, '2024-10-24 20:11:00'),
	(60, 24, 77, 10.8181, '2024-10-24 20:11:07'),
	(61, 24, 77, 11.0623, '2024-10-24 20:11:15'),
	(62, 24, 77, 10.9157, '2024-10-24 20:11:22'),
	(63, 24, 77, 10.5494, '2024-10-24 20:11:29'),
	(64, 24, 77, 10.525, '2024-10-24 20:11:36'),
	(65, 24, 77, 10.5494, '2024-10-24 20:11:43'),
	(66, 24, 77, 10.5494, '2024-10-24 20:11:51'),
	(67, 24, 77, 10.5494, '2024-10-24 20:11:58'),
	(68, 24, 77, 10.525, '2024-10-24 20:12:05'),
	(69, 24, 77, 10.5494, '2024-10-24 20:12:14'),
	(70, 24, 77, 10.5494, '2024-10-24 20:12:19'),
	(71, 24, 77, 10.5494, '2024-10-24 20:12:26'),
	(72, 24, 77, 10.5006, '2024-10-24 20:12:33'),
	(73, 24, 77, 10.5494, '2024-10-24 20:12:41'),
	(74, 24, 77, 10.6227, '2024-10-24 20:12:48'),
	(75, 24, 77, 10.5494, '2024-10-24 20:12:55'),
	(76, 24, 77, 10.525, '2024-10-24 20:13:02'),
	(77, 24, 77, 11.8681, '2024-10-24 20:13:09'),
	(78, 24, 77, 11.1844, '2024-10-24 20:13:17'),
	(79, 24, 77, 10.6227, '2024-10-24 20:13:24'),
	(80, 24, 77, 10.8425, '2024-10-24 20:13:31'),
	(81, 24, 77, 10.5494, '2024-10-24 20:13:38'),
	(82, 24, 77, 10.989, '2024-10-24 20:13:45'),
	(83, 24, 77, 10.8669, '2024-10-24 20:13:52'),
	(84, 24, 77, 10.7936, '2024-10-24 20:14:06'),
	(85, 24, 77, 10.4762, '2024-10-24 20:14:11'),
	(86, 24, 77, 10.7692, '2024-10-24 20:14:14'),
	(87, 24, 77, 10.9402, '2024-10-24 20:14:25'),
	(88, 24, 77, 10.696, '2024-10-24 20:14:28'),
	(89, 24, 77, 10.0855, '2024-10-24 20:14:35'),
	(90, 24, 77, 11.2088, '2024-10-24 20:14:43'),
	(91, 24, 77, 10.7936, '2024-10-24 20:14:50'),
	(92, 24, 77, 10.6715, '2024-10-24 20:15:02'),
	(93, 24, 77, 10.5739, '2024-10-24 20:15:04'),
	(94, 24, 77, 11.6972, '2024-10-24 20:15:14'),
	(95, 24, 77, 10.5006, '2024-10-24 20:15:21'),
	(96, 24, 77, 10.4518, '2024-10-24 20:15:26'),
	(97, 24, 77, 10.525, '2024-10-24 20:15:33'),
	(98, 24, 77, 10.7692, '2024-10-24 20:15:40'),
	(99, 24, 77, 10.1587, '2024-10-24 20:15:48'),
	(100, 24, 77, 10.3785, '2024-10-24 20:15:55'),
	(101, 24, 77, 10.3053, '2024-10-24 20:16:02'),
	(102, 24, 77, 10.2076, '2024-10-24 20:16:09'),
	(103, 24, 77, 10.5494, '2024-10-24 20:16:16'),
	(104, 24, 77, 10.5739, '2024-10-24 20:16:23'),
	(105, 24, 77, 10.3785, '2024-10-24 20:16:30'),
	(106, 24, 77, 10.4029, '2024-10-24 20:16:38'),
	(107, 24, 77, 10.5494, '2024-10-24 20:16:45'),
	(108, 24, 77, 10.525, '2024-10-24 20:16:52'),
	(109, 24, 77, 10.1832, '2024-10-24 20:16:59'),
	(110, 24, 77, 10.4762, '2024-10-24 20:17:06'),
	(111, 24, 77, 10.4762, '2024-10-24 20:17:13'),
	(112, 24, 77, 10.5494, '2024-10-24 20:17:20'),
	(113, 24, 77, 10.5494, '2024-10-24 20:17:27'),
	(114, 24, 77, 10.525, '2024-10-24 20:17:35'),
	(115, 24, 77, 10.525, '2024-10-24 20:17:42'),
	(116, 24, 77, 10.6715, '2024-10-24 20:17:49'),
	(117, 24, 77, 10.525, '2024-10-24 20:17:56'),
	(118, 24, 77, 10.4762, '2024-10-24 20:18:03'),
	(119, 24, 77, 10.4029, '2024-10-24 20:18:11'),
	(120, 24, 77, 10.5006, '2024-10-24 20:18:18'),
	(121, 24, 77, 10.5006, '2024-10-24 20:18:25'),
	(122, 24, 77, 10.525, '2024-10-24 20:18:34'),
	(123, 24, 77, 10.4274, '2024-10-24 20:18:39'),
	(124, 24, 77, 10.0122, '2024-10-24 20:18:47'),
	(125, 24, 77, 10.2564, '2024-10-24 20:18:54'),
	(126, 24, 77, 11.3309, '2024-10-24 20:19:01'),
	(127, 24, 77, 9.64591, '2024-10-24 20:19:08'),
	(128, 24, 77, 9.64591, '2024-10-24 20:19:15'),
	(129, 24, 77, 9.52381, '2024-10-24 20:19:22'),
	(130, 24, 77, 9.84127, '2024-10-24 20:19:31'),
	(131, 24, 77, 9.76801, '2024-10-24 20:19:37'),
	(132, 24, 77, 9.91453, '2024-10-24 20:19:44'),
	(133, 24, 77, 9.76801, '2024-10-24 20:19:51'),
	(134, 24, 77, 9.86569, '2024-10-24 20:19:58'),
	(135, 24, 77, 9.86569, '2024-10-24 20:20:05'),
	(136, 24, 77, 9.76801, '2024-10-24 20:20:12'),
	(137, 24, 77, 9.76801, '2024-10-24 20:20:19'),
	(138, 24, 77, 9.74359, '2024-10-24 20:20:27'),
	(139, 24, 77, 10.0122, '2024-10-24 20:20:34'),
	(140, 24, 77, 9.37729, '2024-10-24 20:20:41'),
	(141, 24, 77, 9.79243, '2024-10-24 20:20:48');

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



/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
