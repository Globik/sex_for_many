-- \i /home/globik/sex_for_many/sql/chat.sql
drop table if exists chat;
 create table chat(			
					msg text,
					tz timestamptz not null default now(),
					us_id int not null,-- room id = us id
				    nick varchar(25) not null);
-- insert into chat(msg,nick) values('hello','globik');
CREATE OR REPLACE FUNCTION expire_chat_delete_old_rows() RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
DELETE FROM chat WHERE us_id=NEW.us_id AND tz < NOW() - INTERVAL '12 minutes';
RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS expire_chat_delete_old_rows_trigger ON chat;
CREATE TRIGGER expire_chat_delete_old_rows_trigger AFTER INSERT ON chat FOR EACH ROW EXECUTE PROCEDURE expire_chat_delete_old_rows();
