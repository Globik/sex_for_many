-- \i /home/globik/sex_for_many/sql/vroom.sql
drop table if exists vroom;
create table vroom(
us_id int not null,
nick varchar(16) unique not null references buser(bname),
src text
); 
				-- grant all privileges on table video to suka;
