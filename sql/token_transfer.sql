-- \i /home/globik/sex_for_many/sql/token_transfer.sql

create or replace function on_token_transfer(tom varchar(16),fro varchar(16), amt int) returns void
language plpgsql as $$
begin
update buser set items=items-on_token_transfer.amt where buser.bname=on_token_transfer.fro;
update buser set items=items+on_token_transfer.amt  where buser.bname=on_token_transfer.tom;
end;
$$;

-- select on_token_transfer('Globi','lo20',30);
