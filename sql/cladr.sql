-- \i /home/globik/sex_for_many/sql/cladr.sql
-- heroku pg:psql --app frozen-atoll-47887

--drop table cladr if exists;
create table cladr(
id serial primary key,
name  text not null references busers(bname),
cadr varchar(40) not null, -- client btc address
padr varchar(40)  not null, -- public btc adress
inv varchar(70) not null, -- invoice
pc varchar(70) not null, -- payment code
btc_amt numeric NOT NULL default 0, -- btc payment amount by address
btc_all numeric not null default 0, -- total amount received by address
is_t boolean not null default true -- is btc test
);

CREATE OR REPLACE FUNCTION notify_smart() RETURNS TRIGGER AS $$
DECLARE 
	data json;
	notification json;
BEGIN
	IF(TG_OP = 'DELETE') THEN
		data = row_to_json(OLD);
		ELSE
		data=row_to_json(NEW);
		END IF;
		notification = json_build_object('table', TG_TABLE_NAME, 'action', TG_OP, 'data',data);
		PERFORM pg_notify('on_smart_cb', notification::text);
		RETURN NULL;
		END;
		$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS notif_smart ON cladr;
CREATE TRIGGER notif_smart
AFTER UPDATE ON cladr
FOR EACH ROW EXECUTE PROCEDURE notify_smart();
