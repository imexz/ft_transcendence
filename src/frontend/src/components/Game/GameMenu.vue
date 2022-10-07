<template>
	<div class="wrapper" v-if="!showGame">
		<h1>Game Settings</h1>
		<div class="singleOption">
			Score to Win
			<br>
			<button id="score3" @click="setScoreToWin(3);" class>3</button>
			<button id="score5" @click="setScoreToWin(5);" class>5</button>
			<button id="score10" @click="setScoreToWin(10);" class="selected">10</button>
			<button id="score15" @click="setScoreToWin(15);" class>15</button>
			<button id="score20" @click="setScoreToWin(20);" class>20</button>
		</div>
		<div class="singleOption">
			Enable PowerUps
			<br>
			<button id="powerupYes" @click="setPowerUp(true);" class>Yes</button>
			<button id="powerupNo" @click="setPowerUp(false);" class="selected">No</button>
		</div>
		<div class="singleOption">
			Enable slower serve
			<br>
			<button id="slowServeYes" @click="setSlowServe(true);" class="selected">Yes</button>
			<button id="slowServeNo" @click="setSlowServe(false);" class>No</button>
		</div>
		<div class="singleOption">
			Who serves after score
			<br>
			<button id="lastScored" @click="setServing(1);" class>Last Scored</button>
			<button id="alternate" @click="setServing(0);" class="selected">Alternate</button>
			<button id="other" @click="setServing(2);" class>Other</button>
		</div>
		<div class="singleOption">
			<br>
			<br>
			<br>
			<h1>Start Game</h1>
			<br>
			<button id="joinQueue" @click="joinQueue();">Join Queue</button>
			<button id="invitePlayer" @click="invitePlayer();">Invite Player</button>
		</div>
	</div>
	<div v-else>
		<PongGame />
	</div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import PongGame from './PongGame.vue';
export default defineComponent({
	data() {
		return {
			showGame: false as boolean,
			scoreToWin: 10 as number,
			enablePowerUp: false as boolean,
			enableSlowServe: true as boolean,
			serving: "alternate" as string,
		};
	},
	methods: {
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
			this.scoreToWin = score;
		},
		setPowerUp(isSet: boolean) {
			document.getElementById("powerupYes").classList.remove("selected");
			document.getElementById("powerupNo").classList.remove("selected");
			if (isSet)
				document.getElementById("powerupYes").classList.add("selected");
			else
				document.getElementById("powerupNo").classList.add("selected");
			this.enablePowerUp = isSet;
		},
		setSlowServe(isSet: boolean) {
			document.getElementById("slowServeYes").classList.remove("selected");
			document.getElementById("slowServeNo").classList.remove("selected");
			if (isSet)
				document.getElementById("slowServeYes").classList.add("selected");
			else
				document.getElementById("slowServeNo").classList.add("selected");
			this.enableSlowServe = isSet;
		},
		setServing(option: number) {
			document.getElementById("lastScored").classList.remove("selected");
			document.getElementById("alternate").classList.remove("selected");
			document.getElementById("other").classList.remove("selected");
			switch (option) {
				case 0:
					document.getElementById("alternate").classList.add("selected");
					this.serving = "alternate";
					break;
				case 1:
					document.getElementById("lastScored").classList.add("selected");
					this.serving = "lastScored";
					break;
				case 2:
					document.getElementById("other").classList.add("selected");
					this.serving = "other";
					break;
			}
		},
		joinQueue() {
			this.showGame = true;
		},
		invitePlayer() {
		},
	},
	components: { PongGame }
})
</script>

<style>
.singleOption {
	margin-top: 14px
}

.singleOption>button {
	font-size: 20px;
	width: 102px;
	margin-left: 0;
	margin-right: 0;
	margin-top: 4px;
	padding-top: 5px
}

.singleOption>button.selected {
	font-size: 20px;
	width: 102px;
	background-color: lightgray;
	color: black;
	margin-left: 0;
	margin-right: 0
}
</style>
