-- \i /home/globik/sex_for_many/sql/busers.sql
create extension if not exists pgcrypto;
drop type if exists brole_type_enum cascade;
create type brole_type_enum as enum('admin', 'superadmin', 'moder','non','ban');
drop table if exists busers;
CREATE TABLE IF NOT EXISTS busers(
id serial PRIMARY KEY,
email VARCHAR (100) UNIQUE CHECK(email ~*'^.+@.+\..+$'),
pwd VARCHAR (355) NOT NULL,
bname varchar(50) UNIQUE NOT NULL, --unique nickname of a user
brole brole_type_enum NOT NULL default 'non', -- admin,superadmin,moder, non, ban 
age numeric not null check(age >= 18),
agever boolean NOT NULL default false,
verif boolean NOT NULL default false, -- is email address verified
cron TIMESTAMP NOT NULL default now()::timestamp, -- when has registred 
buser_d jsonb not null default '{}');

-- insert into busers(email,pwd,bname,age) values('ag1@yandex.ru',crypt('1234', gen_salt('bf',8)),'Globik', 20) returning id;

-- sudo mv /home/globik/postgres/contrib/pgcrypto/pgcrypto.control /usr/local/pgsql/share/extension
-- sudo mv /home/globik/postgres/contrib/pgcrypto/pgcrypto.so /usr/local/pgsql/lib

-- sudo mv /home/globik/postgres/contrib/pgcrypto/pgcrypto--1.3.sql /usr/local/pgsql/share/extension
-- sudo mv /home/globik/postgres/contrib/pgcrypto/pgcrypto--unpackaged--1.0.sql /usr/local/pgsql/share/extension
