<template>
  <div class="wrapper">
		<h1>Game Settings</h1>
    <div id="gameSettings">
      <div class="singleOption">
        <div class="singleOptionText">Score to Win</div>
        <button id="score3" @click="this.setScoreToWin(3);" class>3</button>
        <button id="score5" @click="this.setScoreToWin(5);" class>5</button>
        <button id="score10" @click="this.setScoreToWin(10);" class="selected">10</button>
        <button id="score15" @click="this.setScoreToWin(15);" class>15</button>
        <button id="score20" @click="this.setScoreToWin(20);" class>20</button>
      </div>
      <div class="singleOption">
        <div class="singleOptionText">Enable PowerUps</div>
        <button id="powerupYes" @click="this.setPowerUp(true);" class>Yes</button>
        <button id="powerupNo" @click="this.setPowerUp(false);" class="selected">No</button>
      </div>
      <div class="singleOption">	
        <div class="singleOptionText">Enable slower serve</div>
        <button id="slowServeYes" @click="this.setSlowServe(true);" class>Yes</button>
        <button id="slowServeNo" @click="this.setSlowServe(false);" class="selected">No</button>
      </div>
      <div class="singleOption">
        <div class="singleOptionText">Who serves after score</div>
        <button id="lastScored" @click="this.setServing(this.Serving.LAST_SCORED);" class>Last Scored</button>
        <button id="alternate" @click="this.setServing(this.Serving.ALTERNATE);" class>Alternate</button>
        <button id="random" @click="this.setServing(this.Serving.RANDOM);" class="selected">Random</button>
      </div>
    </div>
		<div id="startGame">
      <h1>Start Game</h1>
      <div>
        <div v-if="(this.user != null)" class="startGameElem">
          <h2>VS</h2>
          <UserSummary :user = this.user> </UserSummary>
        </div>
      </div>
      <div>
        <button id="invitePlayer" class="epicButton" @click="this.startWait();">
          <span v-if="this.userId">Invite Player</span>
          <span v-else>Join Queue</span>
        </button>
      </div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Settings } from '@/models/gameSettings';
import { Socket } from 'socket.io-client'
import UserSummary from '@/components/Profile/UserSummary.vue';
import User from '@/models/user';
import VueAxios from 'axios';
import { API_URL } from '@/defines';


enum Serving {
	LAST_SCORED,
	ALTERNATE,
	RANDOM
}

export default defineComponent({
    data() {
        return {
            settings: Settings,
            user: null as User,
            // user: null as User,
            Serving
        }
    },
    props: {
        userId: String,
        socket: Socket
    },
    components: {
        UserSummary
    },

   async created() {
        console.log("GameSettings created")
        this.settings = new Settings()
        console.log("userId & user",this.userId, this.user);
        if(this.userId != this.user?.id) {
        // if(this.user == null || this.userId != this.user?.id) {
            // console.log("1", this.user);
            this.fetchUser()
            // while (this.user == null) {
		  	    //   await new Promise(r => {setTimeout(r, 10);
            //   console.log("fetchuser wait")})
            // }
            // console.log("2", this.user);
        }
    },
    updated() {
        if(this.userId != this.user?.id) {
            this.fetchUser()
        }
    },
    methods: {
        fetchUser() {
            VueAxios({
                url: '/users/find/' + this.userId,
                baseURL: API_URL,
                method: 'GET',
                withCredentials: true,
            })
            // .then(ret => {console.log("ret.data =", ret.data); this.user = new User(ret.data)})
            .then(ret => this.user = ret.data)
            .catch(error =>  {this.dispatch('triggerToast', {mode: 'error', show: true, msg: 'Could not load User Data'})})
        },
        setScoreToWin(score: number) {
                document.getElementById("score3").classList.remove("selected")
                document.getElementById("score5").classList.remove("selected")
                document.getElementById("score10").classList.remove("selected")
                document.getElementById("score15").classList.remove("selected")
                document.getElementById("score20").classList.remove("selected")
                switch (score) {
                    case 3:
                        document.getElementById("score3").classList.add("selected")
                        break
                    case 5:
                        document.getElementById("score5").classList.add("selected")
                        break
                    case 10:
                        document.getElementById("score10").classList.add("selected")
                        break
                    case 15:
                        document.getElementById("score15").classList.add("selected")
                        break
                    case 20:
                        document.getElementById("score20").classList.add("selected")
                        break
                }
                this.settings.scoreToWin = score
                console.log("scoreToWin set to",this.settings.scoreToWin)
                
        },
        setPowerUp(isSet: boolean) {
            document.getElementById("powerupYes").classList.remove("selected")
            document.getElementById("powerupNo").classList.remove("selected")
            if (isSet)
                document.getElementById("powerupYes").classList.add("selected")
            else
                document.getElementById("powerupNo").classList.add("selected")
            this.settings.enablePowerUp = isSet
        },
        setSlowServe(isSet: boolean) {
            document.getElementById("slowServeYes").classList.remove("selected")
            document.getElementById("slowServeNo").classList.remove("selected")
            if (isSet)
                document.getElementById("slowServeYes").classList.add("selected")
            else
                document.getElementById("slowServeNo").classList.add("selected")
            this.settings.enableSlowServe = isSet
        },
        setServing(option: number) {
            document.getElementById("lastScored").classList.remove("selected")
            document.getElementById("alternate").classList.remove("selected")
            document.getElementById("random").classList.remove("selected")
            switch (option) {
                case Serving.ALTERNATE:
                    document.getElementById("alternate").classList.add("selected")
                    this.settings.serving = Serving.ALTERNATE
                    break
                case Serving.LAST_SCORED:
                    document.getElementById("lastScored").classList.add("selected")
                    this.settings.serving = Serving.LAST_SCORED
                    break
                case Serving.RANDOM:
                    document.getElementById("random").classList.add("selected")
                    this.settings.serving = Serving.RANDOM
                    break
            }
        },
        async startWait() {
            if(this.userId != undefined) {
                console.log("settings", this.settings, this.user)
                this.socket.emit('GameRequestBackend', {settings: this.settings , id: this.userId}, (r) => {
                    if(r) {
                        console.log("emit setWait")
                        this.$emit('setWait')
                    } else {
                        this.$emit('reset')
                    }
                })
            } else {
                this.socket.emit('joinOrCreatGame', {settings: this.settings})
                console.log("emit setWait");
                this.$emit('setWait')
            }
        }
    }
})

</script>

<style scoped>

#gameSettings {
  border-top: 2px solid var(--ft_cyan);
  border-bottom: 2px solid var(--ft_cyan);
  padding-bottom: 40px;
}
.singleOption {
    margin-top: 20px
  }

  .singleOptionText {
    font-size: 25px;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .singleOption>button {
    width: 130px;

    color: var(--ft_cyan);
    background-color: var(--ft_dark);
    
    border: 1px solid var(--ft_cyan);
    border-radius: 5px;
    
    padding: 5px 8px;
    margin-left: 2px;
    margin-right: 2px;
    font-size: 20px;

  }

  .singleOption>button:hover {
    color: var(--ft_dark);
    background-color: var(--ft_cyan);
    border-color: var(--ft_cyan);
  }
  
  .singleOption>button.selected {
    color: var(--ft_pink);
    background-color: var(--ft_dark);
    border-color: var(--ft_pink);
  }
  .singleOption>button.selected:hover {
    color: var(--ft_dark);
    background-color: var(--ft_pink);
    border-color: var(--ft_pink);
  }
  

  .startGameElem {
    width: 400px;
    margin: auto;
    margin-top: 50px;

  }
  
  .epicButton {
    
    border: 1px solid var(--ft_red);
    border-radius: 10px;

    color: var(--ft_white);
    background-color: var(--ft_red);
    padding: 14px 24px;
  
    
    margin-top: 20px;
    
    font-size: 30px;
    font-weight: bold;
  }
  
  .epicButton:hover {
    animation: vibe 75ms forwards infinite;
  }
  
  @keyframes vibe {
    0% {
      transform: translateX(0px);
      transform: translateY(0px);
    }
    50% {
      transform: translateX(0px);
      transform: translateY(2px);
    }
    100% {
      transform: translateX(0px);
      transform: translateY(0px);
    }
  }

  #startGame {

    display: grid;
    grid-template-rows: 100px 230px auto;
  }
  
  </style>