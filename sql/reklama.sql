-- \i /home/globik/sex_for_many/sql/reklama.sql
-- heroku pg:psql --app frozen-atoll-47887
 drop table if exists reklama;
 create table reklama(
 id serial primary key,
 src varchar(100) not null,
 href varchar(100) not null,
 anf date  NOT NULL, -- start time
 ed date  NOT NULL, -- end time
 nick varchar(20) UNIQUE not null,
 statu int not null default 1, -- 1 on start, 2 in action, 3 dead
 meta text, -- name of a firma, email
 typ int not null, -- 1 main banner, 2 aside banner
 price int not null, -- how much costs
 cr_at  TIMESTAMP  NOT NULL default now(), -- when created at
 cl int not null default 0 -- how much clicked
 );
-- insert into reklama(src, href,anf,ed,nick,statu,meta,typ,price) values('a2.jpg','https://yandex.ru','2020-01-01','2020-01-28','a2',2,'info',1,200);

-- insert into reklama(src, href,anf,ed,nick,statu,meta,typ,price) values('b2.jpg','https://yandex.ru','2020-01-01','2020-01-28','b2',2,'info',2,200);

-- table su insert into su(m) values('1999-01-08'); YYYY-MM-DD
