-- \i /home/globik/sex_for_many/sql/profile.sql 
-- psql test
drop table if exists profile;
create table profile(id serial PRIMARY KEY,
					bname  text unique not null references busers(bname),
					dob date not null);
-- insert into profile(bname, dob) values('Globi','1973-09-25');
-- select age('1973-09-25'::date); select age(dob) from profile; select date_part('year', age(dob)) from profile;
-- date_part('year',interval '45 years 11 mons 27 days'); 45
-- select date_part('year', age(dob)) as dob, bname from profile;
