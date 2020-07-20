-- \i /home/globik/sex_for_many/sql/buser.sql
-- create extension if not exists pgcrypto;
drop type if exists brole_type_enum cascade;
create type brole_type_enum as enum('superadmin', 'moder','non','ban');
drop table if exists buser cascade;
CREATE TABLE IF NOT EXISTS buser(
id int generated by default as identity,
pwd VARCHAR (100) NOT NULL,
bname varchar(16) UNIQUE NOT NULL, --unique nickname of a user
email text check(email ~*'^.+@.+\..+$') unique,
items int not null default 0, -- how much tokens
proz int not null default 50, -- how much процентов отстегивать,
model boolean not null default false, -- а модель ли? одобрено ли быть таковой
brole brole_type_enum NOT NULL default 'non', -- superadmin, moder, non, ban, fake 
crat TIMESTAMP NOT NULL default now()::timestamp, -- created at
ll TIMESTAMP  NOT NULL default now()::timestamp -- last logined
);

grant all privileges on table buser to suka;
insert into buser(pwd,bname, email) values('1234','Globi','gru5@yandex.ru');
update buser set brole='superadmin';

-- dob date check(dob < now() - interval '18 years') not null);
-- select age('1973-09-25'::date); select age(dob) from buser; select date_part('year', age(dob)) from buser;
-- date_part('year',interval '45 years 11 mons 27 days'); 45
-- select date_part('year', age(dob)) as dob, bname from buser;

-- alter table buser add column email text check(email ~*'^.+@.+\..+$') unique;
-- alter table buser add column model boolean not null default false;
-- alter table buser add column items int not null default 0;
-- alter table buser add column rubls numeric not null default 0.00;
-- alter table buser add column proz int not null default 50;
