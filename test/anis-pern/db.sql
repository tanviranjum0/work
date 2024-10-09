create database bookDB;

create table book (
  id serial unique PRIMARY KEY,
  name varchar(255) NOT NULL,
  description varchar(255) NOT NULL
);

insert into book (name,description) 
values 
(x,nice book),
(x,beautiful book);