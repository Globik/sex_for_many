-- \i /home/globik/sex_for_many/sql/token_payout.sql
drop table if exists token_payout;
create table if not exists token_payout(id int generated by default as identity,
tom varchar(16) not null references buser(bname),
suma numeric not null, -- rubles
ost int not null, -- how much ostalos token'
cr_at TIMESTAMP NOT NULL default now()::timestamp,
cn int not null -- card number
);
grant all privileges
