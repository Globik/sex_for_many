-- \i /home/globik/sex_for_many/sqltest/cm.sql

--create table luser(us_id serial primary key, name text, bal decimal(10,2))
-- insert into luser(name,bal) values('alik',1.3);
create table com(com_id serial primary key,us_id int references luser(us_id),txt text);
-- alik=1,vadik=2,masha=3
-- insert into com(us_id, txt) values(1, 'alik');
update com set txt='alik' where txt='hi';
update com set txt='masha' where txt='no';
update com set txt='vadik' where txt='yes';
select us_id,max(com_id) as l from com group by us_id;
select us_id,txt,max(com_id) from com group by us_id,txt;
-- https://ru.stackoverflow.com/questions/565319/Как-получит-пользователей-с-последними-комментариями-mysql
select u.name,u.us_id,c.txt from luser u left join(select com.us_id,max(com.com_id) as l
from com group by com.us_id)uc on u.us_id=uc.us_id left join com c on c.com_id=uc.l where c.txt NOT like ''; -- no coment also outputs
