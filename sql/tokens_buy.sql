-- \i /home/globik/sex_for_many/sql/tokens_buy.sql
-- '/api/bitaps_callback/:userid' in pubrouter.js

drop table if exists tokens_buy;
CREATE TABLE IF NOT EXISTS tokens_buy(
us_id int not null, -- user id
amount int not null, -- satoshi or btc
tok int not null, -- tokens to buy
crat timestamptz not null default now() -- when created at
);
-- us_id, code, amount
create or replace function bitaps_cb(usid int, bcode varchar(100),amt int) returns void
language plpgsql as $$
declare 
ptokens int;
begin
if exists(select 1 from bitaps_tmp where bitaps_tmp.pc=bitaps_cb.bcode) then
select trunc(bitaps_cb.amt/80000) into ptokens;
update buser set items = buser.items + ptokens where buser.id = bitaps_cb.usid;
delete from bitaps_tmp where bitaps_tmp.pc=bitaps_cb.bcode;
insert into tokens_buy(us_id, amount, tok) values(bitaps_cb.usid,bitaps_cb.amt,ptokens);
perform pg_notify('token_buy', json_build_object('us_id', bitaps_cb.usid,'items', ptokens,'amt', bitaps_cb.amt)::text);
else
end if;
end;
$$;
