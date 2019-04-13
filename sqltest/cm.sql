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

CREATE TABLE `db_user` (
  `db_user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `balance` decimal(10,2) NOT NULL,
  PRIMARY KEY (`db_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
insert into db_user(name,balance) values('alik',0.5);
insert into db_user(name,balance) values('vadik',0.5);
insert into db_user(name,balance) values('masha',0.5);
CREATE TABLE `db_comment` (
  `db_comment_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `db_user_id` int(10) unsigned NOT NULL,
  `text` text NOT NULL,
  PRIMARY KEY (`db_comment_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;
insert into db_comment(db_user_id,text) values(1,'alik');
insert into db_comment(db_user_id,text) values(1,'alik2');
insert into db_comment(db_user_id,text) values(1,'alik3');
insert into db_comment(db_user_id,text) values(2,'v');
insert into db_comment(db_user_id,text) values(2,'v2');
insert into db_comment(db_user_id,text) values(2,'v3');
insert into db_comment(db_user_id,text) values(3,'m');
insert into db_comment(db_user_id,text) values(3,'m2');


select u.name, c.text from db_user u left join(select db_comment.db_user_id,
max(db_comment.db_comment_id) as l
from db_comment group by db_comment.db_user_id)uc
on u.db_user_id=uc.db_user_id left join db_comment c on c.db_comment_id=uc.l where c.text NOT LIKE '';
