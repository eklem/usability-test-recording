# usability-test-recording
Remote and on-premises usability testing and recording of test.

## Overview of possible setup

![mockup of setup](https://github.com/eklem/usability-test-recording/blob/trunk/design/first-overview-mockup.png?raw=true)


## Server setup

### Create a Digital Ocean server

* Debian 11
* Minimal size

### Add user

Loog in as root and add the CouchDB-user and give it `sudo` rights.

```console
adduser couchpotato
usermod -a -G sudo couchpotato
```

### Enabling package repository for CouchDB

```console
sudo apt update && sudo apt install -y curl apt-transport-https gnupg
curl https://couchdb.apache.org/repo/keys.asc | gpg --dearmor | sudo tee /usr/share/keyrings/couchdb-archive-keyring.gpg >/dev/null 2>&1
source /etc/os-release
echo "deb [signed-by=/usr/share/keyrings/couchdb-archive-keyring.gpg] https://apache.jfrog.io/artifactory/couchdb-deb/ ${VERSION_CODENAME} main" \
    | sudo tee /etc/apt/sources.list.d/couchdb.list >/dev/null
```

### Get a Debian server on Digital Ocean and install CouchDB, nginx, snapd and certbot:

```console
sudo apt update && sudo apt upgrade -y
sudo apt install -y couchdb
sudo apt install nginx
sudo apt install snapd
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo snap set certbot trust-plugin-with-root=ok
```

### Certbot name.com plugin

```console
sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B432D3AA229EF90
echo "deb [ arch=amd64 ] https://packages.kaelshipman.me/public/deb jammy main" | sudo tee -a /etc/apt/sources.list.d/kaelshipman.me.list >/dev/null
sudo apt-get update
sudo apt install certbot-dns-namecom
```

### Certificate setup

Go to `https://www.name.com/resellersolutions`, click `Start with an API Token`, add a token name and click generate. Copy the token. SSH to the server and type `sudo apt install certbot-dns-namecom`. Paste the token when asked for. Also on the name.com webpage, whitelist the IP-address of the webserver. Turn name.com API access on.


### setting up nginx

```console
sudo mv /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup
sudo nano /etc/nginx/sites-enabled/default
```

Add to default:
```txt
ssl on;
ssl_certificate PATH_TO_YOUR_PUBLIC_KEY.pem;
ssl_certificate_key PATH_TO_YOUR_PRIVATE_KEY.key;
ssl_protocols SSLv3;
ssl_session_cache shared:SSL:1m;

location / {
    proxy_pass http://localhost:5984;
    proxy_redirect off;
    proxy_set_header Host $host;
    proxy_buffering off;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Ssl on;
}

```



### Or setup CouchDB with ssl directly
https://docs.couchdb.org/en/stable/config/http.html#https-ssl-tls-options
