DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Customer`;
DROP TABLE IF EXISTS `Product`;


CREATE USER 'monitoring_user'@'%' IDENTIFIED BY 'changeme';
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'monitoring_user'@'%' IDENTIFIED BY 'changeme';
GRANT SUPER ON *.* TO 'monitoring_user'@'%';
FLUSH PRIVILEGES;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `Customer` (
  `CustomerID` int(11) NOT NULL AUTO_INCREMENT,
  `CustomerFirstName` varchar(100) NOT NULL,
  `CustomerLastName` varchar(100) NOT NULL,
  `CustomerEmail` varchar(255) NOT NULL,
  `Active` TINYINT(0) NULL,
  `CustomerPassword` varchar(255) NULL,
  `CustomerNumber` varchar(60) NULL,
  PRIMARY KEY (`CustomerID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `Customer` WRITE;
/*!40000 ALTER TABLE `Customer` DISABLE KEYS */;
INSERT INTO `Customer` VALUES (1,'Test1','McTest1','test1@yahoo.com',False,'admin','1234'),(2,'Test2','McTest2','test2@gmail.com',False,'admin','1234'),(3,'Test3','McTest3','test3@yahoo.com',False,'admin','1234'),(4,'Test4','McTest4','test4@gmail.com',False,'admin','1234');
/*!40000 ALTER TABLE `Customer` ENABLE KEYS */;
UNLOCK TABLES;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `Product` (
  `ProductID` int(11) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(100) NOT NULL,
  `ProductPhotoURL` varchar(255) NOT NULL,
  `ProductStatus` enum('Active','InActive') DEFAULT NULL,
  PRIMARY KEY (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
INSERT INTO `Product` VALUES (1,'Hat','t','Active'),(2,'Shoes','t','Active'),(3,'Pants','t','Active'),(4,'Shirt','t','InActive'),(5,'Coat','t','InActive');
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `Orders` (
  `OrderID` int(11) NOT NULL AUTO_INCREMENT,
  `OrderStatus` enum('Queued','InProgress','QA','Cancelled','Complete') NOT NULL,
  `ProductID` int(11) NOT NULL,
  `CustomerID` int(11) NOT NULL,
  PRIMARY KEY (`OrderID`),
  KEY `CustomerID` (`CustomerID`),
  KEY `ProductID` (`ProductID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `Customer` (`CustomerID`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `Product` (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` VALUES (2,'Queued',1,1),(3,'Queued',1,2),(4,'Queued',1,3),(5,'InProgress',2,3),(6,'InProgress',2,4),(7,'InProgress',3,1),(8,'QA',1,2),(9,'Complete',1,3),(10,'Cancelled',4,1),(11,'Cancelled',5,2);
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
