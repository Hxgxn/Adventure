-- MySQL dump 10.18  Distrib 10.3.27-MariaDB, for debian-linux-gnueabihf (armv8l)
--
-- Host: localhost    Database: adventure
-- ------------------------------------------------------
-- Server version	10.3.27-MariaDB-0+deb10u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `economy`
--

DROP TABLE IF EXISTS `economy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `economy` (
  `building_name` text DEFAULT NULL,
  `building_id` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `resource_id` int(11) DEFAULT NULL,
  `production` int(11) DEFAULT NULL,
  `price` int(11) DEFAULT NULL,
  `price_resource_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `economy`
--

LOCK TABLES `economy` WRITE;
/*!40000 ALTER TABLE `economy` DISABLE KEYS */;
INSERT INTO `economy` VALUES ('Holzfäller-Camp',1,2,1,2,1000,1),('Holzfäller-Camp',1,3,1,3,10000,1),('Steinbergwerk',2,2,2,2,2000,2),('Steinbergwerk',2,3,2,2,4000,2),('Steinbergwerk',2,1,2,1,500,1),('Holzfäller-Camp',1,1,1,1,100,1);
/*!40000 ALTER TABLE `economy` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `level_buildings`
--

DROP TABLE IF EXISTS `level_buildings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `level_buildings` (
  `user_id` int(11) DEFAULT NULL,
  `building` text DEFAULT NULL,
  `building_id` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `level_buildings`
--

LOCK TABLES `level_buildings` WRITE;
/*!40000 ALTER TABLE `level_buildings` DISABLE KEYS */;
INSERT INTO `level_buildings` VALUES (1,'Holzfäller-Camp',1,3),(1,'Steinbergwerk',2,3),(3,'Holzfäller-Camp',1,3),(3,'Steinbergwerk',2,1);
/*!40000 ALTER TABLE `level_buildings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resources`
--

DROP TABLE IF EXISTS `resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `resources` (
  `user_id` int(11) DEFAULT NULL,
  `resource_name` text DEFAULT NULL,
  `resource_id` int(11) DEFAULT NULL,
  `value` bigint(20) DEFAULT NULL,
  `last_update` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resources`
--

LOCK TABLES `resources` WRITE;
/*!40000 ALTER TABLE `resources` DISABLE KEYS */;
INSERT INTO `resources` VALUES (1,'Holz',1,4861,'1625924856761'),(1,'Stein',2,779,'1625924856766'),(3,'Holz',1,89476,'1625921768973'),(3,'Stein',2,1000,'1625929433251');
/*!40000 ALTER TABLE `resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text DEFAULT NULL,
  `passwort` text DEFAULT NULL,
  `created_at` text DEFAULT NULL,
  `last_login` text DEFAULT NULL,
  `aktiv` tinyint(1) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Hagen','d9b5f58f0b38198293971865a14074f59eba3e82595becbe86ae51f1d9f1f65e','1625845203749','1625927017754',1,1),(2,'Admin','532eaabd9574880dbf76b9b8cc00832c20a6ec113d682299550d7a6e0f345e25','1625846413714','1625846413725',1,1),(3,'Hagen2','d9b5f58f0b38198293971865a14074f59eba3e82595becbe86ae51f1d9f1f65e','1625911714727','1625929389066',1,1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-07-15  6:04:12
