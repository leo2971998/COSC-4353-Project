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


CREATE TABLE event (
    event_id INT AUTO_INCREMENT PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    event_location VARCHAR(255) NOT NULL,
    urgency ENUM('high', 'medium', 'low') NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    description TEXT,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES login(id)
)

CREATE TABLE volunteer_history (
  history_id INT AUTO_INCREMENT PRIMARY KEY,
  volunteer_id INT NOT NULL,
  event_id INT NOT NULL,
  participation_date DATE NOT NULL,
  hours_served DOUBLE NOT NULL,
  feedback TEXT,
  rating INT,
  event_status ENUM('attended', 'upcoming', 'missed'),
  FOREIGN KEY (volunteer_id) REFERENCES login(id),
  FOREIGN KEY (event_id) REFERENCES event_details(event_id)
);
