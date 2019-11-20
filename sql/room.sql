-- \i /home/globik/sex_for_many/sql/room.sql
create table room(room_id int not null, -- id of a room
					descr text, -- room description
					src text, -- 64based img src
					nick varchar(16),-- user's nick
					v int not null default 0); -- viewrs number
