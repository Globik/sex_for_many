-- \i /home/globik/sex_for_many/sql/token_order.sql
drop table token_order;
create table if not exists token_order(
id int generated by default as identity,
bname varchar(16) not null references buser(bname),
tok int not null, -- количество токенов
order_id int not null, -- номер операции
tsum numeric not null, -- sum in rubles сколько получателю пришло
wsum numeric not null, -- withdraw_amount сколько сняли с отправителя
cr_at TIMESTAMP NOT NULL default now()::timestamp,
st text, -- status comment
red_at TIMESTAMP NOT NULL default now()::timestamp ); -- when edited

create or replace function on_token_order(bname varchar(16),tok int, tsum numeric, wsum numeric, order_id int) returns void
language plpgsql as $$
begin
insert into token_order(bname,tok,order_id,tsum,wsum)  
values(on_token_order.bname, on_token_order.tok, on_token_order.order_id, on_token_order.tsum, on_token_order.wsum);
update buser set items=items+on_token_order.tok where buser.bname=on_token_order.bname;
end;
$$;
-- select on_token_order('Globi', 100, 98, 100, 200);
-- await db.query('select on_token_order($1,$2,$3,$4,$5)',[label,66,amount,666, operation_id])	
