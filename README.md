# sex_for_many
A site of video translations on demand based on WebRTC MediaRecorder API, node.js, koa.js, BTC smart contract as tokens, postgreSQL.
Vanilla.js on frontend.

# Demo

[https://globikon.space](https://globikon.space)

# Yandex Money


Forms

[https://yandex.ru/dev/money/doc/payment-buttons/reference/forms-docpage/](https://yandex.ru/dev/money/doc/payment-buttons/reference/forms-docpage/)

Notifications. POST to '/api/cb/yam'

[https://yandex.ru/dev/money/doc/payment-buttons/reference/notifications-docpage/](https://yandex.ru/dev/money/doc/payment-buttons/reference/notifications-docpage/)

 Build https POST notifications(hooks):
 
[https://money.yandex.ru/transfer/myservices/http-notification](https://money.yandex.ru/transfer/myservices/http-notification)

# Privat rooms based on WebRTC.

STUN and TURN servers at xirsys.com
API Credentials on [https://global.xirsys.net/dashboard/services](https://global.xirsys.net/dashboard/services) 

``` https://ident:secret@api path/_turn/channel ```

# SSL Certificate for https

1. my_cert.pem (SSL sertificate -----BEGIN CERTIFICATE----- ...)
2. my_key.pem (Private key of Certificate - BEGIN RSA PRIVATE KEY - ...)
3. my_ca.cert (-----BEGIN CERTIFICATE----- ... -----END CERTIFICATE----------BEGIN CERTIFICATE-----...-----END CERTIFICATE-----)
 Цепочка SSL сертификатов. Сначала промежуточный сертификат, затем корневой с новой строки без пробелов.

# PostgreSQL

## pgexport

# Mails

Based on nodemailer.js and sendmail as a transport.

``` sudo apt-get install sendmail ```

# Process environments

XIRSYS_SECRET, YANDEX_SEC

# domain on reg.ru

# deploy to dedicated server to ihor.ru instructions

``` 
    sudo apt-get install screen 
    ssh root@45.89.67.145 
    enter your password
    screen -r 
    
```

```

sudo apt-get install curl
curl -sL https://deb.nodesource.com/setup_8.x | sudo bash -
sudo apt-get install -y nodejs

sudo apt install postgresql postgresql-contrib
21.6 mB
sudo -u postgres createuser --interactive
(suka or globi  - superuser)
sudo -u postgres createdb globi
sudo -u postgres psql globi
create role root;
grant root to globi;
alter role root with login;
grant all privileges  on database globi to globi;
alter user globi with password 'globi';
alter role globi with login;
psql globi
-- sudo -u suka psql globi --
sudo apt-get install git (76.3 mB)
git --version (2.17.1)
sudo apt-get install sendmail (5,229kB)

```

```
sudo vi /etc/environment
i
blablabla
Ctrl+C (2 times)
:wq (or with no change=> :q!)

```
restart vds
ssh root@91.217.80.183
--sudo -u postgres createdb globi
psql postgres
create database globi ENCODING 'UTF-8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8';
===============

```

 sudo pg_dropcluster --stop 10  main
 sudo pg_createcluster --locale ru_RU.UTF-8 --start 10 main

sudo -u postgres psql postgres
\list
create user globi;
create role root;
\q

sudo -u postgres psql postgres
alter role root with login;
\q


sudo -u postgres psql postgres


create database globi;
\q
psql globi
\q
sudo -u postgres psql postgres
alter user globi with password 'globi';
grant all privileges  on database globi to globi;
\q
sudo -u postgres psql globi
grant all privileges on all tables in schema public to globi;
grant all privileges on all sequences in schema public to globi;
grant all privileges on all functions in schema public to globi;

```



