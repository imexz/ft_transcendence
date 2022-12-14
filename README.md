# ft_transcendence

This is our ft_transcendence, the last project from the common core of 42 school<br>
The project is the result of the colaboration between [shackbei](https://github.com/shackbei), [tgrossma](https://github.com/tobbel42), [mstrantz](https://github.com/imexz) and [tblaase](https://github.com/tblaase).


# Contents
- [Overview](#overview)
- [Env File](#env-file)
- [How to launch](#how-to-launch)


## Overview
In this project we were challanged to create a website where you can play pong and interact with other users.<br>
For loggin into the page we had to use the [42 intra API](https://api.intra.42.fr/apidoc).<br>
Here is some example pictures from our project:

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

![ingame](/readme_additions/after_game.png)
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
- `CALLBACK` this will be the same url as the callback-url in your intra, i.e. `http://localhost:3000/auth/login/callback`
- `POSTGRES_USER` this will be the username for seting up and accessing the database
- `POSTGRES_PASSWORD` this will be the password for the user above
- `PGDATABASE` this will be the name of your database
- `JWT_PASSWORD` this will be the password of your JWT-service
- `TWO_FACTOR_AUTHENTICATION_APP_NAME` this will be name of your 2FA app


[here](/src/backend/env_example.txt) you can find an example `.env`<br>

## How to launch
You need:
- Docker
- 2gb of discspace for the Docker-Images
- 42Intra API Key


Compile the program via the Makefile by using ```make``` or ```make all``` in the root directory of the repository.


For shutting down the server but not deleting anything use ```make down``` in the root of the repo.


For deleting every docker conatiner/image/volume that is currently not used, use ```make clean``` in the root of the repo.
