-- \i /home/globik/sex_for_many/sql/primary_adress.sql
-- heroku pg:psql --app frozen-atoll-47887
drop table if exists prim_adr;
create table prim_adr(
adr varchar(40) not null,
tadr varchar(60) not null, -- test address 
						type boolean ,-- btc test true, else false
						xir jsonb);
insert into prim_adr(adr,tadr,type,xir) values('ww','dd',false,'{"f":1}');
-- alter table prim_adr add column tadr varchar(60);
-- alter table prim_adr add column xir jsonb

-- update prim_adr set xir='{"fig":12,"serv":[{"mama":"dat","papat":"net"}]}';
