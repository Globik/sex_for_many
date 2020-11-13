-- \i /home/globik/sex_for_many/sql/primary_adress.sql
-- heroku pg:psql --app frozen-atoll-47887
drop table if exists prim_adr;
create table prim_adr(adr varchar(40) not null, 
						type boolean ,-- btc test true, else false
						xir jsonb);
-- alter table prim_adr add column xir jsonb
-- update prim_adr set xir='{"fig":12,"serv":[{"mama":"dat","papat":"net"}]}';
