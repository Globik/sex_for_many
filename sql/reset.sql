-- \i /home/globik/sex_for_many/sql/reset.sql
-- sudo -u postgres psql globi
-- alter user suka with superuser
create extension if not exists "uuid-ossp";
-- drop table basic_auth.tokens;
drop table tokens;

drop type if exists token_type_enum cascade;
create type token_type_enum as enum('validation', 'reset');

create table if not exists tokens(
token uuid primary key, 
token_type token_type_enum not null,
email text not null references buser(email) on delete cascade on update cascade,
created_at timestamptz  not null default current_date);

create or replace function request_password_reset(email text) returns uuid
-- void
language plpgsql as $$
declare
tok uuid;
begin
delete from tokens where token_type = 'reset' and tokens.email = request_password_reset.email;
select uuid_generate_v4() into tok;

insert into tokens(token, token_type, email) values(tok, 'reset', request_password_reset.email);

-- perform pg_notify('reset',
-- json_build_object('email', request_password_reset.email, 'token', tok, 'token_type', 'reset')::text);
return tok;
end;
$$;
/*  
80c95cfd-8a5f-4799-9c1f-28bd49f53b7a
select reset_password('your_mail@example.ru','80c95cfd-8a5f-4799-9c1f-28bd49f53b7a','yor password');

*/
create or replace function reset_password(email text, token uuid, pwd text) returns void
language plpgsql as $$
declare
tok uuid;
begin
if exists(select 1 from tokens
where tokens.email = reset_password.email
and tokens.token = reset_password.token
and token_type = 'reset') then
--update buser set pwd=crypt(reset_password.pwd, gen_salt('bf', 8)) where buser.email = reset_password.email;
update buser set pwd=reset_password.pwd where buser.email=reset_password.email;
delete from tokens where tokens.email = reset_password.email
and tokens.token = reset_password.token
and token_type = 'reset';
else
raise invalid_password using message = 'Invalid email or token';
end if;

delete from tokens where token_type = 'reset' and tokens.email = reset_password.email;

select uuid_generate_v4() into tok;
insert into tokens(token, token_type, email) values(tok, 'reset', reset_password.email);

-- perform pg_notify('reset',
-- json_build_object(
-- 'email', reset_password.email,
-- 'token', tok, 'token_type', 'reseted')::text);
end;
$$;
