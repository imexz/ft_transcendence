![header](/readme_additions/header.png)

# ft_transcendence

This is our ft_transcendence, the last project from the common core of 42 school<br>
The project is the result of the colaboration between [shackbei](https://github.com/shackbei), [tgrossma](https://github.com/tobbel42), [mstrantz](https://github.com/imexz), [tblaase](https://github.com/tblaase) and kprzybyl.

<details>
  <summary>show result</summary>

  ![result](/readme_additions/result.png)<br>
</details>

## Contents
- [Overview](#overview)
- [Env File](#env-file)
- [How to launch](#how-to-launch)


## Overview
In this project we were challanged to create a website where you can play pong and interact with other users.<br>
For loggin into the page we had to use the OAuth system of [42 intra API](https://api.intra.42.fr/apidoc).<br>
The frontend had to be developed in a TypeScript framework of our choice.<br>
The backend had to be written in NestJS.<br>
As database we had to use PostgreSQL.<br>
All details are listed in our [requiremnts.txt](/requirements.txt).<br>
Here are some example pictures from our project:

<details>
  <summary>show login page</summary>

  ![login](/readme_additions/login.png)<br>
</details>

---

<details>
  <summary>show profile page</summary>

  ![profile](/readme_additions/profile.png)
</details>

---

<details>
  <summary>show profile settings page</summary>

![settings](/readme_additions/settings.png)
</details>

---

<details>
  <summary>show pregame page</summary>

![pregame](/readme_additions/pre_game.png)
</details>

---

<details>
  <summary>show ingame page</summary>

![ingame](/readme_additions/in_game.png)
</details>

---

<details>
  <summary>show after game page</summary>

![aftergame](/readme_additions/after_game.png)
</details>

---

<details>
  <summary>show scoreboard page</summary>

![scoreboard](/readme_additions/scoreboard.png)
</details>

---

<details>
  <summary>show chat page</summary>

![chat](/readme_additions/chat.png)
</details>

---

<details>
  <summary>show chat owner page</summary>

![chat_admin](/readme_additions/chat_owner.png)
</details>


## Env File
⚠️ The file has to be named `.env` and it has to have this path `/src/backend/.env`<br>
⚠️ NEVER publish this `.env` file since it may contain sensitive data as for example your API secret.<br>
Theses following variables have to be set inside the file:<br>
- `CLIENT_ID` can be found on intra
- `CLIENT_SECRET` can be found on intra
- `HOST` this will be the IP-address of your server, i.e. `http://localhost`
- `CALLBACK` this will be the same url as the callback-url in your intra,<br>
    i.e. `http://localhost:3000/auth/login/callback`
- `POSTGRES_USER` this will be the username for setting up and accessing the database (for some reason has to be the same as `PGDATABASE`)
- `POSTGRES_PASSWORD` this will be the password for the user above
- `PGDATABASE` this will be the name of your database (for some reason has to be the same as `POSTGRES_USER`)
- `JWT_PASSWORD` this will be the password of your JWT-service
- `TWO_FACTOR_AUTHENTICATION_APP_NAME` this will be name of your 2FA app


[here](/src/backend/env_example.txt) you can find a template for our `.env`<br>

## How to launch
You need:
- Docker
- 2.5GB of discspace for the Docker-Images/Containers/Volume
- 42 Intra API Key


Launch our project via the [Makefile](/Makefile) by using ```make``` or ```make all``` in the root directory of the repository.
This takes 90 seconds here in our school, times may vary depending on the download speed.


For shutting down the server but not deleting anything use ```make down``` in the root of the repo.


For deleting every docker container/image/volume that is currently not used, use ```make clean``` in the root of the repo.


![footer](/readme_additions/footer.png)
