-- MySQL dump 10.13  Distrib 8.0.32, for Linux (x86_64)
--
-- Host: localhost    Database: montag
-- ------------------------------------------------------
-- Server version	8.0.35-0ubuntu0.23.10.1

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
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `jobFamilyId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `skills_jobFamilyId_foreign_idx` (`jobFamilyId`),
  CONSTRAINT `skills_jobFamilyId_foreign_idx` FOREIGN KEY (`jobFamilyId`) REFERENCES `jobFamilies` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES (1,'JavaScript','2024-01-26 12:47:59','2024-01-26 12:47:59',1),(2,'React.js','2024-01-26 12:47:59','2024-01-26 12:47:59',1),(3,'Node.js','2024-01-26 12:47:59','2024-01-26 12:47:59',1),(4,'Spring Boot','2024-01-26 12:47:59','2024-01-26 12:47:59',1),(5,'Java','2024-01-26 12:47:59','2024-01-26 12:47:59',1),(6,'Git','2024-01-26 12:47:59','2024-01-26 12:47:59',1),(7,'HTML5','2024-01-26 12:47:59','2024-01-26 12:47:59',1),(8,'CSS3','2024-01-26 12:47:59','2024-01-26 12:47:59',1),(9,'SQL','2024-01-26 12:47:59','2024-01-26 12:47:59',1),(10,'RESTful API Development','2024-01-26 12:47:59','2024-01-26 12:47:59',1),(11,'Automated Testing','2024-01-26 12:47:59','2024-01-26 12:47:59',2),(12,'Manual Testing','2024-01-26 12:47:59','2024-01-26 12:47:59',2),(13,'Selenium','2024-01-26 12:47:59','2024-01-26 12:47:59',2),(14,'JUnit','2024-01-26 12:47:59','2024-01-26 12:47:59',2),(15,'TestNG','2024-01-26 12:47:59','2024-01-26 12:47:59',2),(16,'Quality Assurance','2024-01-26 12:47:59','2024-01-26 12:47:59',2),(17,'Bug Tracking','2024-01-26 12:47:59','2024-01-26 12:47:59',2),(18,'Test Planning','2024-01-26 12:47:59','2024-01-26 12:47:59',2),(19,'Test Case Design','2024-01-26 12:47:59','2024-01-26 12:47:59',4),(20,'Continuous Integration/Continuous Deployment (CI/CD) knowledge','2024-01-26 12:47:59','2024-01-26 12:47:59',4),(21,'Linux System Administration','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(22,'Docker','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(23,'Kubernetes','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(24,'Jenkins','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(25,'Git','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(26,'Infrastructure as Code (IaC)','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(27,'Monitoring and Logging','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(28,'AWS','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(29,'Microsoft Azure','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(30,'GCP','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(31,'Cloud Platforms','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(32,'Bash','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(33,'Python','2024-01-26 12:52:40','2024-01-26 12:52:40',1),(34,'Scripting','2024-01-26 12:52:40','2024-01-26 12:52:40',4),(35,'Project Planning','2024-01-26 13:05:26','2024-01-26 13:05:26',3),(36,'Agile Methodology','2024-01-26 13:05:26','2024-01-26 13:05:26',3),(37,'Scrum','2024-01-26 13:05:26','2024-01-26 13:05:26',3),(38,'Kanban','2024-01-26 13:05:26','2024-01-26 13:05:26',3),(39,'Risk Management','2024-01-26 13:05:26','2024-01-26 13:05:26',3),(40,'Stakeholder Communication','2024-01-26 13:05:26','2024-01-26 13:05:26',3),(41,'Budgeting and Resource Allocation','2024-01-26 13:05:26','2024-01-26 13:05:26',3),(42,'Project Scheduling','2024-01-26 13:05:26','2024-01-26 13:05:26',3),(43,'Team Collaboration','2024-01-26 13:05:26','2024-01-26 13:05:26',3),(44,'Quality Management','2024-01-26 13:05:26','2024-01-26 13:05:26',3),(45,'User Research','2024-01-26 13:06:49','2024-01-26 13:06:49',5),(46,'Wireframing','2024-01-26 13:06:49','2024-01-26 13:06:49',5),(47,'Prototyping','2024-01-26 13:06:49','2024-01-26 13:06:49',5),(48,'UI Design','2024-01-26 13:06:49','2024-01-26 13:06:49',5),(49,'UX Design','2024-01-26 13:06:49','2024-01-26 13:06:49',5),(50,'Usability Testing','2024-01-26 13:06:49','2024-01-26 13:06:49',5),(51,'Adobe Creative Suite (e.g., Photoshop, Illustrator)','2024-01-26 13:06:49','2024-01-26 13:06:49',5),(52,'Sketch','2024-01-26 13:06:49','2024-01-26 13:06:49',5),(53,'Figma','2024-01-26 13:06:49','2024-01-26 13:06:49',5),(54,'Responsive Design','2024-01-26 13:06:49','2024-01-26 13:06:49',5),(55,'Customer Service','2024-01-26 13:07:43','2024-01-26 13:07:43',6),(56,'Troubleshooting','2024-01-26 13:07:43','2024-01-26 13:07:43',6),(57,'Hardware Support','2024-01-26 13:07:43','2024-01-26 13:07:43',6),(58,'Software Support','2024-01-26 13:07:43','2024-01-26 13:07:43',6),(59,'Operating Systems (e.g., Windows, Linux)','2024-01-26 13:07:43','2024-01-26 13:07:43',6),(60,'Network Troubleshooting','2024-01-26 13:07:43','2024-01-26 13:07:43',6),(61,'Remote Desktop Support','2024-01-26 13:07:43','2024-01-26 13:07:43',6),(62,'Ticketing Systems','2024-01-26 13:07:43','2024-01-26 13:07:43',6),(63,'Communication Skills','2024-01-26 13:07:43','2024-01-26 13:07:43',6),(64,'Problem Solving','2024-01-26 13:07:43','2024-01-26 13:07:43',6);
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-01-26 13:16:48
