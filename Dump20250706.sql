-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: babyguardai
-- ------------------------------------------------------
-- Server version	9.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `baby_growth_records`
--

DROP TABLE IF EXISTS `baby_growth_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `baby_growth_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `record_date` date NOT NULL,
  `weight` decimal(5,2) NOT NULL COMMENT 'Weight in kilograms',
  `height` decimal(5,2) NOT NULL COMMENT 'Height in centimeters',
  `head_circumference` decimal(5,2) NOT NULL COMMENT 'Head circumference in centimeters',
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `baby_growth_records_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `baby_growth_records`
--

LOCK TABLES `baby_growth_records` WRITE;
/*!40000 ALTER TABLE `baby_growth_records` DISABLE KEYS */;
INSERT INTO `baby_growth_records` VALUES (5,4,'2025-07-04',54.00,66.00,4.00,NULL,'2025-07-03 21:36:06'),(6,5,'2025-07-04',6.10,66.00,5.50,NULL,'2025-07-03 21:33:58'),(7,4,'2025-07-05',6.60,77.00,5.50,NULL,'2025-07-05 16:08:11'),(8,4,'2025-07-06',5.60,66.00,5.00,NULL,'2025-07-06 10:58:09');
/*!40000 ALTER TABLE `baby_growth_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `calendar_events`
--

DROP TABLE IF EXISTS `calendar_events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `calendar_events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `event_type` varchar(50) DEFAULT NULL,
  `event_date` date DEFAULT NULL,
  `event_time` time DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` text,
  `reminder_offset` int DEFAULT NULL,
  `is_recurring` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_calendar_events` (`user_id`,`event_date`),
  CONSTRAINT `calendar_events_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `calendar_events`
--

LOCK TABLES `calendar_events` WRITE;
/*!40000 ALTER TABLE `calendar_events` DISABLE KEYS */;
INSERT INTO `calendar_events` VALUES (19,9,'appointment','2025-07-04','12:00:00','Doctor Vest','Doctor Khaled',0,0),(20,9,'reminder','2025-07-05','12:00:00','Reminder','Hi...',0,0),(21,3,'appointment','2025-07-06','12:00:00','Doctor Vist','Doctor Khaled',0,0),(22,3,'appointment','2025-07-13','12:00:00','Second Doctor Vist','Doctor Khaled',0,0),(24,3,'task','2025-07-06','17:00:00','Daily practice\'s','',0,0);
/*!40000 ALTER TABLE `calendar_events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_sessions`
--

DROP TABLE IF EXISTS `chat_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `session_uuid` char(36) NOT NULL,
  `start_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` timestamp NULL DEFAULT NULL,
  `session_topic` varchar(100) DEFAULT 'New chat',
  `summary` text,
  `file_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `session_uuid` (`session_uuid`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `chat_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_sessions`
--

LOCK TABLES `chat_sessions` WRITE;
/*!40000 ALTER TABLE `chat_sessions` DISABLE KEYS */;
INSERT INTO `chat_sessions` VALUES (10,9,'00f17a2c-84e5-48e5-afb6-d52cb504fa0a','2025-07-03 21:30:22',NULL,'New chat',NULL,NULL),(13,3,'b83a86d1-1e38-4b24-b36c-ec44620a5d03','2025-07-06 10:28:14',NULL,'New chat',NULL,NULL),(14,3,'e7484a82-79bf-4ca5-99ce-de4ced9ab317','2025-07-06 10:51:39',NULL,'New chat',NULL,NULL),(15,3,'bc354ea9-024b-498d-b558-9569b6de74b3','2025-07-06 10:56:39',NULL,'New chat',NULL,NULL);
/*!40000 ALTER TABLE `chat_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_health_records`
--

DROP TABLE IF EXISTS `child_health_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `child_health_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `record_date` date NOT NULL,
  `record_type` enum('Vaccination','Checkup','Growth','Medical','Milestone','Allergy') NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `Dosage` text,
  `Priority` varchar(100) DEFAULT NULL,
  `parent_notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `health_record_index` (`child_id`,`record_date`),
  KEY `idx_health_records` (`child_id`,`record_date`),
  CONSTRAINT `child_health_records_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_health_records`
--

LOCK TABLES `child_health_records` WRITE;
/*!40000 ALTER TABLE `child_health_records` DISABLE KEYS */;
INSERT INTO `child_health_records` VALUES (1,4,'2025-07-02','Vaccination','Hepatitis B - 2nd Dose','5ml','high','No side effects observed','2025-07-02 23:35:07','2025-07-02 23:35:07'),(4,5,'2025-07-03','Vaccination','test','5ml','medium','.','2025-07-03 21:32:29','2025-07-03 21:32:29'),(5,4,'2025-07-09','Vaccination','Rotavirus ','5ml','low',NULL,'2025-07-06 10:53:13','2025-07-06 10:53:13'),(6,7,'2025-07-06','Vaccination','Rotavirus ','5ml','high',NULL,'2025-07-06 10:57:31','2025-07-06 10:57:31');
/*!40000 ALTER TABLE `child_health_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_vaccinations`
--

DROP TABLE IF EXISTS `child_vaccinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `child_vaccinations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `vaccination_name` varchar(255) NOT NULL,
  `date_received` date NOT NULL,
  `next_due_date` date DEFAULT NULL,
  `notes` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `child_id` (`child_id`),
  CONSTRAINT `child_vaccinations_ibfk_1` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_vaccinations`
--

LOCK TABLES `child_vaccinations` WRITE;
/*!40000 ALTER TABLE `child_vaccinations` DISABLE KEYS */;
INSERT INTO `child_vaccinations` VALUES (9,5,'test','2025-07-04','2025-07-10',NULL,'2025-07-04 00:31:48','2025-07-04 00:31:48'),(10,4,'Hepatitis B (HepB)','2025-07-01','2025-07-17',NULL,'2025-07-06 13:47:18','2025-07-06 13:47:18'),(11,4,'Rotavirus ','2025-07-01','2025-07-09',NULL,'2025-07-06 13:52:41','2025-07-06 13:52:41'),(12,7,'Rotavirus ','2025-07-01','2025-07-08',NULL,'2025-07-06 13:57:15','2025-07-06 13:57:15');
/*!40000 ALTER TABLE `child_vaccinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `children`
--

DROP TABLE IF EXISTS `children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `children` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `full_name` varchar(55) NOT NULL,
  `birth_date` date NOT NULL,
  `birth_weight` decimal(5,2) NOT NULL,
  `birth_height` decimal(5,2) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `blood_type` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `genetic_conditions` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_children_user` (`user_id`),
  CONSTRAINT `children_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `children`
--

LOCK TABLES `children` WRITE;
/*!40000 ALTER TABLE `children` DISABLE KEYS */;
INSERT INTO `children` VALUES (4,3,'Amora','2025-06-03',5.00,60.00,'Male','A+','assa','2025-07-01 16:15:03'),(5,9,'karem','2025-04-01',6.11,66.00,'Male','A-',NULL,'2025-07-03 21:27:08'),(7,3,'mohamed','2025-06-01',5.50,66.00,'Male','B+',NULL,'2025-07-06 10:55:44');
/*!40000 ALTER TABLE `children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content_categories`
--

DROP TABLE IF EXISTS `content_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `content_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(50) NOT NULL,
  `parent_category_id` int DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_name` (`category_name`),
  KEY `parent_category_id` (`parent_category_id`),
  CONSTRAINT `content_categories_ibfk_1` FOREIGN KEY (`parent_category_id`) REFERENCES `content_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content_categories`
--

LOCK TABLES `content_categories` WRITE;
/*!40000 ALTER TABLE `content_categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `content_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `educational_content`
--

DROP TABLE IF EXISTS `educational_content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `educational_content` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `content_type` enum('Article','Video','Infographic','Exercise','Recipe') NOT NULL,
  `difficulty_level` enum('Beginner','Intermediate','Advanced') DEFAULT NULL,
  `content_body` text,
  `media_url` varchar(255) DEFAULT NULL,
  `published_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `educational_content_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `content_categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `educational_content`
--

LOCK TABLES `educational_content` WRITE;
/*!40000 ALTER TABLE `educational_content` DISABLE KEYS */;
/*!40000 ALTER TABLE `educational_content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `family_users`
--

DROP TABLE IF EXISTS `family_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `family_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `main_user_id` int NOT NULL,
  `family_name` varchar(55) NOT NULL,
  `family_email` varchar(55) NOT NULL,
  `relation` enum('Father','Mother','Spouse','Partner','Grandparent','Sibling','Other') NOT NULL,
  `access_level` enum('Full','Limited') DEFAULT 'Limited',
  PRIMARY KEY (`id`),
  UNIQUE KEY `family_email` (`family_email`),
  KEY `main_user_id` (`main_user_id`),
  CONSTRAINT `family_users_ibfk_1` FOREIGN KEY (`main_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family_users`
--

LOCK TABLES `family_users` WRITE;
/*!40000 ALTER TABLE `family_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `family_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_tracking`
--

DROP TABLE IF EXISTS `health_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `health_tracking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `track_date` date NOT NULL,
  `sleep_hours` decimal(3,1) DEFAULT NULL,
  `water_intake` decimal(5,2) DEFAULT NULL,
  `steps` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `health_tracking_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_tracking`
--

LOCK TABLES `health_tracking` WRITE;
/*!40000 ALTER TABLE `health_tracking` DISABLE KEYS */;
INSERT INTO `health_tracking` VALUES (1,3,'2025-06-26',0.5,1.00,11),(2,3,'2025-06-27',6.0,2.00,2500),(3,3,'2025-06-28',8.4,0.10,5000),(4,3,'2025-06-30',4.0,5.00,2000),(5,3,'2025-07-01',8.0,1.40,5000),(6,3,'2025-07-02',9.0,1.00,3000),(7,3,'2025-07-03',8.0,2.00,3000),(8,3,'2025-07-04',7.0,1.50,5000),(9,9,'2025-07-04',8.0,2.00,5000),(10,3,'2025-07-05',8.0,2.00,5000),(11,3,'2025-07-06',11.0,3.00,3000);
/*!40000 ALTER TABLE `health_tracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_uuid` char(36) NOT NULL,
  `sender` enum('user','assistant') NOT NULL,
  `content` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `session_uuid` (`session_uuid`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`session_uuid`) REFERENCES `chat_sessions` (`session_uuid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (77,'00f17a2c-84e5-48e5-afb6-d52cb504fa0a','user','Hi','2025-07-03 21:30:28'),(78,'00f17a2c-84e5-48e5-afb6-d52cb504fa0a','assistant','**Hello, Test User!**\n\nI\'m so happy to connect with you! As your nurse assistant, I\'m here to support you through your pregnancy and postpartum journey. If you\'re looking for some healthy meal ideas, I\'d be delighted to share some nutritious options with you. \n\n**Healthy Meal Ideas for Pregnant and Postpartum Women:**\n\n* Leafy greens like spinach and kale for iron and calcium\n* Fatty fish like salmon for omega-3 fatty acids\n* Whole grains like brown rice and quinoa for fiber and energy\n\nIf you have any specific questions or concerns about pregnancy, postpartum, or childcare, please don\'t hesitate to ask. I\'m here to help!\n\n*Disclaimer: This advice is for informational purposes only and does not replace professional medical consultation. Always consult your healthcare provider for personal medical advice.*','2025-07-03 21:30:30'),(79,'00f17a2c-84e5-48e5-afb6-d52cb504fa0a','user','I want to play with a baby','2025-07-03 21:30:45'),(80,'00f17a2c-84e5-48e5-afb6-d52cb504fa0a','assistant','**Supportive Response**\n\nHi Test User! I\'m happy to help you with any questions or concerns you may have about your pregnancy or postpartum journey. However, I don\'t have information on playing with a baby. \n\nIf you\'re looking for advice on nutrition or meal ideas, I\'d be delighted to help! As a pregnant or postpartum woman, it\'s essential to fuel your body with wholesome foods. Here are some healthy meal ideas:\n\n* **Leafy Greens Salad** with lean proteins and whole grains\n* **Omega-rich Fatty Fish** with quinoa and steamed veggies\n* **Warm Oatmeal** with fruits and nuts\n\nRemember, always consult your healthcare provider for personalized advice. If you have any questions about pregnancy, postpartum, or childcare, I\'m here to support you!\n\n*Disclaimer: This advice is for informational purposes only and does not replace professional medical consultation. Always consult your healthcare provider for personal medical advice.*','2025-07-03 21:30:46'),(99,'b83a86d1-1e38-4b24-b36c-ec44620a5d03','user','What are some common physical and emotional challenges women face during the postpartum period, and what strategies can help support recovery and mental well-being?','2025-07-06 10:28:18'),(100,'b83a86d1-1e38-4b24-b36c-ec44620a5d03','assistant','**Supporting Your Recovery and Well-being**\n\nDear Test User, I\'m so glad you\'re thinking about your postpartum care! Unfortunately, I don\'t have information on the specific challenges you\'re asking about. However, I want to assure you that you\'re not alone, and it\'s essential to prioritize your physical and emotional well-being during this time.\n\nIf you have any questions about **nutrition and meal ideas** that can support your recovery, I\'d be happy to help! Healthy eating can make a significant difference in your energy levels and overall health.\n\nPlease feel free to ask me about pregnancy, postpartum, or childcare-related topics, and I\'ll do my best to provide you with helpful information and guidance. Remember, it\'s always a good idea to consult with your healthcare provider for personalized advice.\n\n*Disclaimer: This advice is for informational purposes only and does not replace professional medical consultation. Always consult your healthcare provider for personal medical advice.*','2025-07-06 10:28:19'),(105,'e7484a82-79bf-4ca5-99ce-de4ced9ab317','user','The right food during pregnancy','2025-07-06 10:51:47'),(106,'e7484a82-79bf-4ca5-99ce-de4ced9ab317','assistant','**Nutrition Tips for a Healthy Pregnancy**\n\nHi Test User! As your nurse assistant, I\'m happy to help with nutrition tips for a healthy pregnancy. While I don\'t have specific information on the \"right food\" during pregnancy, I can suggest some healthy meal ideas and nutrition tips that are beneficial for you and your baby.\n\n* **Eat a balanced diet**: Focus on whole foods like fruits, vegetables, whole grains, lean proteins, and healthy fats.\n* **Stay hydrated**: Drink plenty of water throughout the day to help your body support your growing baby.\n* **Consult your healthcare provider**: They can provide personalized nutrition advice and recommendations tailored to your specific needs.\n\nRemember, it\'s always best to consult your healthcare provider for personalized advice on nutrition and pregnancy. If you have any questions or concerns about pregnancy, postpartum, or childcare, feel free to ask!\n\n*Disclaimer: This advice is for informational purposes only and does not replace professional medical consultation. Always consult your healthcare provider for personal medical advice.*','2025-07-06 10:51:48'),(107,'e7484a82-79bf-4ca5-99ce-de4ced9ab317','user','The right food for baby','2025-07-06 10:51:57'),(108,'e7484a82-79bf-4ca5-99ce-de4ced9ab317','assistant','**Nutrition for a Healthy Pregnancy and Postpartum**\n\nI\'m happy to help with nutrition tips for you, Test User! As a pregnant or postpartum woman, it\'s essential to fuel your body with wholesome foods for your health and your baby\'s growth. Here are some healthy meal ideas:\n\n* **Leafy Greens**: Spinach, kale, and collard greens are rich in folate, iron, and calcium.\n* **Protein-rich Foods**: Include lean meats, fish, beans, lentils, and dairy products in your diet.\n* **Whole Grains**: Choose brown rice, quinoa, whole wheat bread, and oats for fiber and nutrients.\n\nRemember, a balanced diet is crucial for your well-being and your baby\'s development. If you have specific questions or concerns about pregnancy, postpartum, or childcare, feel free to ask, and I\'ll do my best to support you!\n\n**Disclaimer:** While I\'m happy to provide general nutrition tips, please consult your healthcare provider for personalized dietary advice.\n\n*Disclaimer: This advice is for informational purposes only and does not replace professional medical consultation. Always consult your healthcare provider for personal medical advice.*','2025-07-06 10:51:58'),(109,'bc354ea9-024b-498d-b558-9569b6de74b3','user','The right food during pregnancy','2025-07-06 10:56:45'),(110,'bc354ea9-024b-498d-b558-9569b6de74b3','assistant','**Nutrition Tips for a Healthy Pregnancy**\n\nHi Test User! As your nurse assistant, I\'m happy to help with nutrition tips for a healthy pregnancy. While I don\'t have specific information on the \"right food\" during pregnancy, I can suggest some healthy meal ideas and nutrition tips:\n\n* **Eat a balanced diet**: Focus on whole foods like fruits, vegetables, whole grains, lean proteins, and healthy fats.\n* **Stay hydrated**: Drink plenty of water throughout the day to help your body support your growing baby.\n* **Take your prenatal vitamins**: These supplements can help fill any nutritional gaps in your diet.\n\nRemember, it\'s always best to consult with your healthcare provider for personalized nutrition advice. If you have any questions or concerns about pregnancy, postpartum, or childcare, I\'m here to help!\n\n*Disclaimer: This advice is for informational purposes only and does not replace professional medical consultation. Always consult your healthcare provider for personal medical advice.*','2025-07-06 10:56:46');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pregnancy_status`
--

DROP TABLE IF EXISTS `pregnancy_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pregnancy_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `start_date` date NOT NULL,
  `expected_date` date NOT NULL,
  `trimester` int DEFAULT NULL,
  `notes` text,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `pregnancy_status_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pregnancy_status_chk_1` CHECK ((`trimester` between 1 and 3))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pregnancy_status`
--

LOCK TABLES `pregnancy_status` WRITE;
/*!40000 ALTER TABLE `pregnancy_status` DISABLE KEYS */;
/*!40000 ALTER TABLE `pregnancy_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_media`
--

DROP TABLE IF EXISTS `user_media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_media` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `description` text,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_media`
--

LOCK TABLES `user_media` WRITE;
/*!40000 ALTER TABLE `user_media` DISABLE KEYS */;
INSERT INTO `user_media` VALUES (21,9,'uploads\\1e7746c9_Screenshot_2025-07-02_232454.png','photo','2025-07-03 21:33:05'),(22,3,'uploads\\839b2877_baby-girl.png','','2025-07-06 10:13:47'),(23,3,'uploads\\45319c38_Logo.jpeg','','2025-07-06 10:57:48');
/*!40000 ALTER TABLE `user_media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(55) NOT NULL,
  `user_email` varchar(55) NOT NULL,
  `user_pass` varchar(255) NOT NULL,
  `user_birthday` date NOT NULL,
  `blood_type` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') NOT NULL,
  `join_date` date DEFAULT (curdate()),
  `health_conditions` text,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `dark_mode` tinyint(1) DEFAULT '0',
  `font_size` int DEFAULT '2',
  `current_child_id` varchar(36) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Test User','test@example.com','scrypt:32768:8:1$EfhcZG03mZDZX4ff$92dd534679692b863592f71904edab3619ae4ec63a62f8142a7ff233f9944469a6cf7e1b7bf65c1814b63f2b355af1f118e988db41331d47ec7ed6e4c4be4e26','1990-01-01','O+','2025-05-29',NULL,NULL,0,2,NULL),(2,'Test User2','test2@example.com','scrypt:32768:8:1$HqzBTgQE2IQ3qekQ$3943c117b76c7bc1f8b3ccf75e9584dedb19697b834822ccb8a9b2ee0942b96c9e810f67bdcd791ad4fc79b60e12d1d4a70450edf93c7d47aad37fef7a677b13','1990-01-01','O+','2025-05-30',NULL,NULL,0,2,NULL),(3,'Khaled Tamer ElNaggar','khaledfunnew@gmail.com','scrypt:32768:8:1$qFUirn9bQ0pK1kw3$e06b0e5cb8fc8a9d315567cd4967bd6b8a5009c8cda4d2a1deb0923491ac75784e86847882c415918cf4139935d748e4dfed902e1998ec7c40c804b5fd283ff2','2025-05-08','A+','2025-05-30',NULL,NULL,0,2,'4'),(4,'bbbbb','khaled@gmail.com','scrypt:32768:8:1$Q73kQxKuzkCObqLV$1c2dd36929ee4005eef831c190f5ffd750eadc1640e8d59e7b78a9a87b078985192c3fbe209db344b0156375740cf8468867e7ebb65b93bfc8e98762fd1492b6','2025-01-01','O-','2025-05-30',NULL,NULL,0,1,NULL),(5,'mohamed','mahmedsalem0101@gmail.com','scrypt:32768:8:1$3qQ3Tz73ljrtQ8Az$a5cb915ad5e2b4a1607c14bb4fa92c206c74d62f15ff92e2f812b22725cdda7b425ffde704acaf20ceddf83e3472c1f5f16ad4a4d52cda6b50616e4f2b42ec18','2025-06-11','B+','2025-06-02',NULL,NULL,0,2,NULL),(6,'Test User3','test3@example.com','scrypt:32768:8:1$NZO0Le9h3OuomRCx$8b012a0bacb1c8fbb66ed011b0b2e33ccc352c27616c7f2240449c8fa9b3bb6e569bcc1edf0678ed22dd2106e55344173411f59d4ee24643bb1c58f6dda5e1ba','1990-01-01','O+','2025-06-07',NULL,NULL,0,2,NULL),(7,'ss','sss@ss.com','scrypt:32768:8:1$byEOb33cx1DvdY7g$3389600ef0bb195e5c56d5a5e2ad03ef89f95eb46510a58f7452645fe538335b644c5273e875aaf1af059ca78dbe3c3cd1f069e075d81651629a8324186e5983','2025-06-07','A-','2025-06-07',NULL,NULL,0,2,NULL),(8,'belal','bb@gmail.com','scrypt:32768:8:1$bFftbtxQVizB7OQC$e30919971fdf8079eddcf23e01800fb8cd97c0fe3a0bb609f94b6f7906d43b39ffda48424c0ba6d78b2eef65990c2467c51bbd304f9bb8c0bbd2acb09e82a05b','2025-06-09','A+','2025-06-08',NULL,NULL,0,2,NULL),(9,'mona','noma@gmail.com','scrypt:32768:8:1$S6ebcj72TyVVsZ3M$4fc228eb00d27325399ee49a65737f2ecc62f0cab3ba616299c3e18d0d828c19b3ce28aad02a0fbb1cba302e5fc50d3ca693c8fd7068f1f61e8d0b51ef3d19c0','1995-01-02','A+','2025-07-04',NULL,NULL,0,1,'5');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-06 16:58:48
