-- \i /home/globik/sex_for_many/sql/vroom.sql
drop table if exists vroom;
create table vroom(
us_id int not null,
nick varchar(16) unique not null references buser(bname),
src text, -- video src
p text, -- video poster
descr text, -- video stream description
crat TIMESTAMP  NOT NULL default now()::timestamp, -- created at
typ varchar(6) not null default 'activ', -- activ, fake, noview, all ,priv
v int not null default 1 -- how much users views the stream
); 
				-- grant all privileges on table video to suka;
-- insert into vroom(us_id,nick,src,p,descr,typ) values(2,'mickey','mickey.webm','mickey.jpg','I kill my pussy','fake');

-- insert into vroom(us_id,nick,src,p,descr,typ) values(3,'sveta','sveta.webm','sveta.jpg','fick mich','fake');
-- insert into vroom(us_id,nick,src,p,descr,typ) values(4,'natasha','natasha.webm','natasha.jpg','I fucking my asshole','fake');
-- insert into vroom(us_id,nick,src,p,typ) values(2,'sveta','sveta.webm','sveta.jpg','fake');
-- alter table vroom add column descr text;
