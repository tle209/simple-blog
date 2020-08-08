
# Simple-blog: Le Nguyen Huu Thuan

## Feature status:
|Index|Features|Function|Done?|
|:----|--------|--------|-----|
|0    | Authenticate | register | No |
|0    | Authenticate | login | No |
|1    | Authenticate | login-google | No |
|2    | Authenticate | login-facebook | No|
|2    | Authenticate | logout | No|
|2    | Post | create (api + ui) | Yes|
|2    | Post | get list (api + ui) | Yes|
|2    | Post | get detail (api + ui) | Yes|
|2    | Post | update (api + ui) | Yes|
|2    | Post | delete (api + ui) | Yes|
|2    | Comment | create (api + ui) | No (only api)|
|2    | Comment | get list (api + ui) | Yes|
|2    | Comment | update (api + ui) | Yes|
|2    | Comment | delete (api + ui) | Yes|

## How to run:
1. **Install Nodejs + npm + Docker:** (Ubuntu)
- Step 1: Install node via nvm
```
$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
```
- Step 2: check nvm version
```
$ nvm --version
```
- Step 3: Install node lts (long term support)
```
$ nvm install --lts
```
- Step 4: Install docker with guideline [hehe]([https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-18-04))
2. **Start mongodb via docker**
- Step 1: Make sure your docker was installed correctly
```
$ docker ps
CONTAINER ID  IMAGE COMMAND  CREATED STATUS  PORTS  NAMES
```
- Step 2: Run docker mongoDB
```
$ docker run --name simpleblog_db -p 27017:27017 -v $HOME/mongo:/data/db --rm -d mongo:4.0.4
```
3. **Start server API** (dev mode)
```
$ npm run start:dev
```
4. **Start UI** (dev mode)
```
$ npm install && npm start
```

## Test:
```
$ npm run test
```
## Lint:
```
$ npm run lint
```
