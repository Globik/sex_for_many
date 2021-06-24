-- \i /home/globi/sex_for_many/sql/prim_adr.sql
-- heroku pg:psql --app frozen-atoll-47887
drop table if exists prim_adr;
create table prim_adr(
adr varchar(40) not null,
tadr varchar(60) not null, -- test address 
type boolean ,-- btc test true, else false
ya_sec text, -- yandex secret
xir_sec text, -- xirsys secret
xir jsonb);

-- insert into prim_adr(adr,tadr,type,xir,gmailpass) values('ww','dd',false,'{"f":1}','123');
-- alter table prim_adr add column tadr varchar(60);
-- alter table prim_adr add column xir jsonb;
-- alter table prim_adr add column gmailpass varchar(60);
-- update prim_adr set xir='{"fig":12,"serv":[{"mama":"dat","papat":"net"}]}';

-- alter table prim_adr drop column gmailpass;
-- alter table prim_adr add column ya_sec text;
-- alter table prim_adr add column xir_sec text;
