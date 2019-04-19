-- \i /home/globik/sex_for_many/sql/cladr.sql

drop table cladr if exists;
create table cladr(
id serial primary key,
name  text not null references busers(bname),
cadr varchar(34) not null, -- client btc address
padr varchar(34)  not null, -- public btc adress
inv varchar(70) not null, -- invoice
pc varchar(70) not null, -- payment code
btc_amt numeric NOT NULL default 0, -- btc payment amount by address
btc_all numeric not null default 0, -- total amount received by address
is_t boolean not null default true -- is btc test
);
