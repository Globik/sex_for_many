-- \i /home/globik/sex_for_many/sql/profile.sql 
-- psql test
drop table if exists profile;
create table profile(id serial PRIMARY KEY,
					 bname  varchar(16) unique not null references buser(bname),
					 age int check(age >=18) not null default 18,
					 msg text, -- message to all
					 ava text, -- base 64
					 isava boolean not null default false -- checked
					 );
                    
-- insert into profile(bname,msg,ava) values('Globi','msg','sse45dd');
