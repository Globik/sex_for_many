-- \i /home/globik/sex_for_many/sql/buser.sql
create extension if not exists pgcrypto;
drop type if exists brole_type_enum cascade;
create type brole_type_enum as enum('admin', 'superadmin', 'moder','non','ban');
drop table if exists buser cascade;
CREATE TABLE IF NOT EXISTS buser(
id serial PRIMARY KEY,
pwd VARCHAR (355) NOT NULL,
bname varchar(16) UNIQUE NOT NULL, --unique nickname of a user
brole brole_type_enum NOT NULL default 'non', -- admin, superadmin, moder, non, ban 
dob date check(dob < now() - interval '18 years') not null, -- date of birth
wreg TIMESTAMP NOT NULL default now()::timestamp, -- when has registred 
ll TIMESTAMP  NOT NULL default now()::timestamp -- last logined
)

-- insert into buser(pwd,bname, dob) values(crypt('1234', gen_salt('bf',8)),'Globi', '1973-09-25');
-- returning id;
-- update buser set brole='superadmin';

-- dob date check(dob < now() - interval '18 years') not null);
-- select age('1973-09-25'::date); select age(dob) from buser; select date_part('year', age(dob)) from buser;
-- date_part('year',interval '45 years 11 mons 27 days'); 45
-- select date_part('year', age(dob)) as dob, bname from buser;

-- sudo mv /home/globik/postgres/contrib/pgcrypto/pgcrypto.control /usr/local/pgsql/share/extension
-- sudo mv /home/globik/postgres/contrib/pgcrypto/pgcrypto.so /usr/local/pgsql/lib

-- sudo mv /home/globik/postgres/contrib/pgcrypto/pgcrypto--1.3.sql /usr/local/pgsql/share/extension
-- sudo mv /home/globik/postgres/contrib/pgcrypto/pgcrypto--unpackaged--1.0.sql /usr/local/pgsql/share/extension
