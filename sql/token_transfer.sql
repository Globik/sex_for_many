-- \i /home/globik/sex_for_many/sql/token_transfer.sql
drop table token_transfer;
create table if not exists token_transfer(
-- id int generated by default as identity
tom varchar(16) not null references buser(bname),
fro varchar(16) not null references buser(bname),
amt int not null, -- tokens
cr_at TIMESTAMP NOT NULL default now()::timestamp,
typ int not null default 0, -- 0 - translation, 1 - privat
pid text -- unique id of translation
);

create or replace function on_token_transfer(tom varchar(16),fro varchar(16), amt int, rub numeric, typ int, pid text) returns void
language plpgsql as $$
declare
p numeric;
begin
select proz from buser where buser.bname=on_token_transfer.tom into p;
update buser set items=items-on_token_transfer.amt where buser.bname=on_token_transfer.fro;
update buser set items=items+on_token_transfer.amt,rubls=rubls+on_token_transfer.rub*p/100 where buser.bname=on_token_transfer.tom;
insert into token_transfer(tom,fro,amt,typ,pid) 
values(on_token_transfer.tom,on_token_transfer.fro,on_token_transfer.amt,on_token_transfer.typ,on_token_transfer.pid);
end;
$$;

-- select on_token_transfer('Globi','lo20',30,0,'aaac');
