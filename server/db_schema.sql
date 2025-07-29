CREATE TABLE login (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user','admin') DEFAULT 'user'
);

CREATE TABLE profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    address1 VARCHAR(100),
    address2 VARCHAR(100),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    skills VARCHAR(255),
    preferences TEXT,
    availability VARCHAR(255),
    is_complete TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES login(id)
);

CREATE TABLE eventManage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventName VARCHAR(255) NOT NULL,
    eventDescription TEXT,
    location TEXT,
    skills VARCHAR(255),
    urgency ENUM('low', 'medium', 'high') DEFAULT 'low',
    eventDate VARCHAR(255),
    user_id INT NOT NULL
)

CREATE TABLE IF NOT EXISTS eventManage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  eventName VARCHAR(100),
  eventDescription TEXT,
  location TEXT,
  skills VARCHAR(255),
  urgency ENUM('low', 'medium', 'high') DEFAULT 'low',
  eventDate VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES login(id)
);
