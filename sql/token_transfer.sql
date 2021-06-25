-- \i /home/globi/sex_for_many/sql/token_transfer.sql
-- ssh root@91.217.80.183

 DROP FUNCTION if exists on_token_transfer(character varying,character varying,integer);
create or replace function on_token_transfer(tom varchar(16),fro varchar(16), amt int) returns setof int
language plpgsql as $$
declare
minus_result int;
plus_result int;
begin
update buser set items=items-on_token_transfer.amt where buser.bname=on_token_transfer.fro returning items into minus_result;
update buser set items=items+on_token_transfer.amt  where buser.bname=on_token_transfer.tom returning items into plus_result;
return next minus_result;
return next plus_result;
end;
$$;

-- select on_token_transfer('Globi','dima',30);
