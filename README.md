# sex_for_many
A site of video translations on demand based on WebRTC MediaRecorder API, node.js, koa.js, BTC smart contract as tokens, postgreSQL.
Vanilla.js on frontend.

# Demo

There's no demo at the moment.

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
``` sudo apt-get install screen ```
```ssh root@45.89.67.145 
enter your password
screen -r ```
