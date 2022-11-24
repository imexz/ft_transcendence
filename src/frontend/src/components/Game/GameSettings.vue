<template>
  <div class="wrapper">
		<h1>Game Settings</h1>
		<div class="singleOption">
			Score to Win
			<br>
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
			<button id="lastScored" @click="this.setServing(1);" class>Last Scored</button>
			<button id="alternate" @click="this.setServing(0);" class>Alternate</button>
			<button id="random" @click="this.setServing(2);" class="selected">Random</button>
		</div>
		<div class="singleOption">
			<h1>Start Game</h1>
      <div v-if="this.userId">
        <UserSummary :user= this.user> </UserSummary>
        <button id="invitePlayer" @click="this.startWait();">Invite Player</button>
      </div>
			<button v-else id="joinQueue" @click="this.startWait();">Join Queue</button>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PongGame from './PongGame.vue';
import GameSettings from './GameSettings.vue'
import { Settings } from '@/models/gameSettings';
import { io, Socket } from 'socket.io-client'
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
            user: User
        }
    },
    props: {
        userId: String,
        socket: Socket
    },
    components: {
        UserSummary
    },
    created() {
        console.log("created Game Settings");
        
        // this.user = undefined
        this.settings = new Settings()
        // if(this.userId != undefined) {
        //     this.fetchUser()
        // }
        if(this.userId != this?.user.id) {
            this.fetchUser()
        }
    },
    updated() {
        // console.log("updated GAmeSettings");
        
        // console.log("userId", this.userId);
        
        
        if(this.userId != this?.user.id) {
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
            .then(ret => this.user = ret.data)
            .catch(error => console.log(error))
            
        },
        setScoreToWin(score: number) {
                document.getElementById("score3").classList.remove("selected");
                document.getElementById("score5").classList.remove("selected");
                document.getElementById("score10").classList.remove("selected");
                document.getElementById("score15").classList.remove("selected");
                document.getElementById("score20").classList.remove("selected");
                switch (score) {
                    case 3:
                        document.getElementById("score3").classList.add("selected");
                        break;
                    case 5:
                        document.getElementById("score5").classList.add("selected");
                        break;
                    case 10:
                        document.getElementById("score10").classList.add("selected");
                        break;
                    case 15:
                        document.getElementById("score15").classList.add("selected");
                        break;
                    case 20:
                        document.getElementById("score20").classList.add("selected");
                        break;
                }
                this.settings.scoreToWin = score;
                console.log("scoreToWin set to",this.settings.scoreToWin);
                
            },
            setPowerUp(isSet: boolean) {
                document.getElementById("powerupYes").classList.remove("selected");
                document.getElementById("powerupNo").classList.remove("selected");
                if (isSet)
                    document.getElementById("powerupYes").classList.add("selected");
                else
                    document.getElementById("powerupNo").classList.add("selected");
                this.settings.enablePowerUp = isSet;
            },
            setSlowServe(isSet: boolean) {
                document.getElementById("slowServeYes").classList.remove("selected");
                document.getElementById("slowServeNo").classList.remove("selected");
                if (isSet)
                    document.getElementById("slowServeYes").classList.add("selected");
                else
                    document.getElementById("slowServeNo").classList.add("selected");
                this.settings.enableSlowServe = isSet;
            },
            setServing(option: number) {
                document.getElementById("lastScored").classList.remove("selected");
                document.getElementById("alternate").classList.remove("selected");
                document.getElementById("random").classList.remove("selected");
                switch (option) {
                    case 0:
                        document.getElementById("alternate").classList.add("selected");
                        this.settings.serving = Serving.ALTERNATE;
                        break;
                    case 1:
                        document.getElementById("lastScored").classList.add("selected");
                        this.settings.serving = Serving.LAST_SCORED;
                        break;
                    case 2:
                        document.getElementById("random").classList.add("selected");
                        this.settings.serving = Serving.RANDOM;
                        break;
                }
            },
            async startWait() {
                if(this.userId != undefined) {

                    console.log("settings", this.settings, this.user);
                    this.socket.emit('GameRequestBackend', {settings: this.settings , id: this.userId}, (r) => {
                        // if (r.game != undefined) {
                        //     this.$emit('viewGame', r.game)
                        // }
                        if(r) {
                            console.log("emit setWait");
                            this.$emit('setWait')
                        } else {
                            this.$emit('reset')
                        }
                    })
                } else {
                    this.socket.emit('joinOrCreatGame', {settings: this.settings}, () => {
                    });
                    console.log("emit setWait");
                    this.$emit('setWait')
                }

                // this.$store.state.isCustomized = this.isCustomized();
                // this.$store.state.showGame = true;
            }
            // isCustomized(): boolean {
            //     if (this.settings.scoreToWin != 10 ||
            //         this.settings.enablePowerUp == true ||
            //         this.settings.enableSlowServe == true ||
            //         this.settings.serving != Serving.RANDOM
            //         ) return true;
            //     else return false;
            // },
    }
})

</script>

<style scoped>

.singleOption {
    margin-top: 14px
  }

  .singleOptionText {
    font-size: 25px;
    font-weight: bold;
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
  

</style>