-- \i /home/globik/sex_for_many/sql/profile.sql 
-- psql test
drop table if exists profile;
create table profile(id serial PRIMARY KEY,
					 bname  varchar(16) unique not null references buser(bname),
					 ich text, -- uber sich
					 dich text,-- ich suche dich
					 land varchar(20),
					 city varchar(20),
					 ava text, -- base 64
					 isava boolean not null default false, -- checked
					 lup timestamp not null default now() -- last updated
					 );
                    
-- insert into profile(bname,ich,dich,land,city,ava) values('Globi','ich','dich','Russland','Chely','sse45dd');
