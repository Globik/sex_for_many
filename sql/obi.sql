-- \i /home/globik/sex_for_many/sql/obi.sql
-- drop table obi if exists;
/*
create table obi(
id serial primary key,
ati timestamptz not null default now(),
bnick varchar(50) not null,
msg text not null
);
*/

CREATE OR REPLACE FUNCTION expire_obi_delete_old_rows() RETURNS trigger
LANGUAGE plpgsql AS $$
declare
_cnt int;
BEGIN
-- DELETE FROM chat WHERE us_id=NEW.us_id AND tz < NOW() - INTERVAL '12 minutes';
-- RETURN NEW;
select count(*) from obi  into _cnt;
if _cnt = 40 then
delete from obi where ati=(select min(ati) from obi);
elsif _cnt > 40 then
delete from obi where ati in (select ati from obi limit _cnt - 40);
end if;
RETURN NEW;
END;
$$;

-- DROP TRIGGER IF EXISTS expire_obi_delete_old_rows_trigger ON obi;
CREATE TRIGGER expire_obi_delete_old_rows_trigger AFTER INSERT ON obi FOR EACH ROW EXECUTE PROCEDURE expire_obi_delete_old_rows();
