CREATE TABLE users (
  id SERIAL NOT NULL,
  username varchar(256),
  email varchar(256),
  password varchar(256),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  PRIMARY KEY (id)
);
