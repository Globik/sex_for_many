-- \i /home/globik/sex_for_many/sql/blog.sql
drop table if exists blog;
CREATE TABLE IF NOT EXISTS blog(
id serial PRIMARY KEY,
auth varchar(20) not null,
title text not null unique,
slug text not null,
body text not null,
descr text, -- for meta tags social
cr_at timestamp not null default now());
-- insert into blog(auth,title,slug,body) values('Globi','title','title-title','hello body');
-- select*from blog limit 5 offset 10;