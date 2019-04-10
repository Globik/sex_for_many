-- \i /home/globik/sex_for_many/test/event.sql

create table event(id serial primary key, alt text);
CREATE OR REPLACE FUNCTION notify_event() RETURNS TRIGGER AS $$
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
		PERFORM pg_notify('events', notification::text);
		RETURN NULL;
		END;
		$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS notif_event ON event;
CREATE TRIGGER notif_event
AFTER INSERT OR UPDATE OR DELETE ON event
FOR EACH ROW EXECUTE PROCEDURE notify_event();
	
