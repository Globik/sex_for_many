-- \i /home/globik/sex_for_many/sql/vroom.sql
drop table if exists vroom;
create table vroom(
us_id int not null,
nick varchar(16) unique not null references buser(bname),
vsrc varchar(100) not null -- video src in this vroom
				); 
