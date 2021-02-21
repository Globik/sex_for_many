-- \i /home/globik/sex_for_many/sql/bitaps_tmp.sql
-- for btc payment(tokens purchase) '/api/get_bitaps_invoice_2' in /routes/pubrouter.js
drop table if exists bitaps_tmp;
CREATE TABLE IF NOT EXISTS bitaps_tmp(
bname varchar(16) not null references buser(bname),
us_id int not null, -- user id
inv varchar(100) unique not null, -- invoice
pc varchar(100) not null, -- payment code
adr varchar(100) not null, -- btc address to pay
st int not null default 0, -- status => 0 = begin, 1 = confirming, 2 = confirmed
crat timestamptz not null default now(), -- when created at
lm timestamptz not null default now() -- last modified
);

-- insert into bitaps_tmp(bname,us_id,inv,pc,adr) values('Globi',1,'inv','3344fr5','qwwe44');--name,id,invoice,payment code, address

-- drop function get_address(int,int,text);
create or replace function get_address(usid int, st int, zeit text) -- check if address there are in database already
returns table(adr varchar(100), bname varchar(16), us_id int) as $$
begin
return query select bitaps_tmp.adr, bitaps_tmp.bname, bitaps_tmp.us_id
from bitaps_tmp where bitaps_tmp.us_id = get_address.usid and crat > now() - ($3 || ' minutes')::interval;
end;
$$ 
language plpgsql;
-- select*from get_address(10,0,'59');

CREATE OR REPLACE FUNCTION expire_address() RETURNS trigger --  на случай, eсли юзер так и не решится токены купить
LANGUAGE plpgsql AS $$
BEGIN
delete from bitaps_tmp where crat < now() - '59 minutes'::interval and st = 0;
RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS expire_address_trigger ON bitaps_tmp;
CREATE TRIGGER expire_address_trigger AFTER INSERT ON bitaps_tmp FOR EACH ROW EXECUTE PROCEDURE expire_address();
