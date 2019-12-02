-- \i /home/globik/sex_for_many/sql/room.sql
drop table if exists room;
create table room(
us_id int not null,
nick varchar(16) unique not null references buser(bname),
v int not null default 1 -- how much people in this room
				); 
-- insert into room(us_id,nick) values(1,'Globi') on conflict(nick) do nothing returning *;

-- select us_id,nick,age,ava,isava from room left join profile on room.nick=profile.bname;
-- select us_id,nick,age,ava,isava from room left join profile on room.nick=profile.bname where room.nick='Globi';
-- insert into room(us_id,nick) values($1,$2) on conflict(nick) do nothing
