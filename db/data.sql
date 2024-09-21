DROP TABLE IF EXISTS `Orders`;
DROP TABLE IF EXISTS `Customer`;
DROP TABLE IF EXISTS `Product`;
DROP TABLE IF EXISTS `Activity`;


CREATE USER 'monitoring_user'@'%' IDENTIFIED BY 'changeme';
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'monitoring_user'@'%' IDENTIFIED BY 'changeme';
GRANT SUPER ON *.* TO 'monitoring_user'@'%';
GRANT FILE ON *.* TO 'monitoring_user'@'%';
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
  `Role` varchar(60) NOT NULL,
  PRIMARY KEY (`CustomerID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `Customer` WRITE;
/*!40000 ALTER TABLE `Customer` DISABLE KEYS */;
INSERT INTO `Customer` VALUES (1,'Test1','McTest1','test1@yahoo.com',False,'admin','1234','picker'),(2,'Test2','McTest2','test2@gmail.com',False,'admin','1234','picker'),(3,'Test3','McTest3','test3@yahoo.com',False,'admin','1234','picker'),(4,'Test4','McTest4','test4@gmail.com',False,'admin','1234','picker');
/*!40000 ALTER TABLE `Customer` ENABLE KEYS */;
UNLOCK TABLES;

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `Product` (
  `ProductID` int(11) NOT NULL AUTO_INCREMENT,
  `ProductName` varchar(100) NOT NULL,
  `ProductPhotoURL` varchar(255) NOT NULL,
  `ProductCategory` varchar(100) NOT NULL,
  `ProductStatus` enum('Active','InActive') DEFAULT NULL,
  `ProductDesc` varchar(255) NOT NULL,
  PRIMARY KEY (`ProductID`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `Product` WRITE;
/*!40000 ALTER TABLE `Product` DISABLE KEYS */;
INSERT INTO `Product` VALUES (1,'Hat','t', 'fashion', 'Active','very good'),(2,'Shoes','t','fashion', 'Active','very good'),(3,'Pants','t', 'fashion', 'Active','very good'),(4,'Shirt','t', 'fashion', 'Active','very good'),(5,'Coat','t', 'fashion', 'Active','very good'), (6,'Television','t', 'electronics', 'Active','very good');
/*!40000 ALTER TABLE `Product` ENABLE KEYS */;
UNLOCK TABLES;

CREATE FULLTEXT INDEX idx_full_products ON Product (ProductName, ProductCategory);

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;

CREATE TABLE `Orders` (
  `OrderID` int(11) NOT NULL AUTO_INCREMENT,
  `OrderStatus` enum('Queued','InProgress','QA','Cancelled','Complete') NOT NULL,
  `Products` JSON NOT NULL,
  `CustomerID` int(11) NOT NULL,
  `State` varchar(255) NOT NULL,
  `Address` varchar(255) NOT NULL,
  `OrderDate` varchar(50) NOT NULL,
  `TreatedBy` varchar(255) DEFAULT NULL,  
  PRIMARY KEY (`OrderID`),
  KEY `CustomerID` (`CustomerID`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`CustomerID`) REFERENCES `Customer` (`CustomerID`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `Orders` WRITE;
/*!40000 ALTER TABLE `Orders` DISABLE KEYS */;
INSERT INTO `Orders` (`OrderID`, `OrderStatus`, `Products`, `CustomerID`, `State`, `Address`,`OrderDate`, `TreatedBy`) 
VALUES (2,'Queued', JSON_OBJECT('product_ids', JSON_ARRAY(1, 4, 3), 'quantities', JSON_ARRAY(2, 1, 1)),1,'Ontario','124 missi','2024-09-16 16:33:35',''),
(3,'Queued', JSON_OBJECT('product_ids', JSON_ARRAY(4, 3), 'quantities', JSON_ARRAY(1, 1)),2,'Ontario','12, maddison','2024-09-10 16:33:35',''),
(4,'Queued', JSON_OBJECT('product_ids', JSON_ARRAY(2, 6), 'quantities', JSON_ARRAY(2, 1)),3,'Ontario','21, benfield','2024-09-16 12:46:23',''),
(5,'Queued', JSON_OBJECT('product_ids', JSON_ARRAY(6, 1), 'quantities', JSON_ARRAY(3, 1)),3,'Ontario','34, Arkansas','2024-09-14 8:13:35',''),
(6,'Queued', JSON_OBJECT('product_ids', JSON_ARRAY(1, 5), 'quantities', JSON_ARRAY(1, 1)),4,'Ontario','32, Detriote','2024-09-09 18:20:35',''),
(7,'Queued', JSON_OBJECT('product_ids', JSON_ARRAY(2, 4), 'quantities', JSON_ARRAY(2, 3)),1,'Ontario','30, London','2024-09-11 11:33:35',''),
(8,'Queued', JSON_OBJECT('product_ids', JSON_ARRAY(3, 5), 'quantities', JSON_ARRAY(2, 2)),2,'Ontario','29, denver','2024-09-16 6:43:35',''),
(9,'Queued', JSON_OBJECT('product_ids', JSON_ARRAY(5, 2), 'quantities', JSON_ARRAY(1, 3)),3,'Ontario','20, prodigy','2024-09-10 15:33:35',''),
(10,'Queued', JSON_OBJECT('product_ids', JSON_ARRAY(2, 4), 'quantities', JSON_ARRAY(2, 7)),1,'Ontario','32, north york','2024-09-05 7:50:35',''),
(11,'Queued', JSON_OBJECT('product_ids', JSON_ARRAY(1, 3), 'quantities', JSON_ARRAY(1, 1)),2,'Ontario','12, bishop','2024-09-04 16:33:35','');
/*!40000 ALTER TABLE `Orders` ENABLE KEYS */;
UNLOCK TABLES;



CREATE TABLE `Activity` (
  `ActivityID` int(11) NOT NULL AUTO_INCREMENT,
  `OrderID` int(11) NOT NULL,
   `Staff` int(11) NOT NULL,
  `StartTime` TIMESTAMP NULL,
  `EndTime` TIMESTAMP NULL,
  `Duration` FLOAT,
  `CheckedBy` int(11),
  PRIMARY KEY (`ActivityID`),
  FOREIGN KEY (`CheckedBy`) REFERENCES `Customer`(`CustomerID`) ON DELETE CASCADE,
  FOREIGN KEY (`OrderID`) REFERENCES `Orders`(`OrderID`) ON DELETE CASCADE,
  FOREIGN KEY (`Staff`) REFERENCES `Customer`(`CustomerID`) ON DELETE CASCADE
)ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;


ALTER TABLE Activity MODIFY StartTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
