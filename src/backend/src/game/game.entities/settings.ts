export enum Serving {
	LAST_SCORED,
	ALTERNATE,
	RANDOM
}

export class Settings {
    constructor(scoreToWin: number = 10,
				enablePowerUp: boolean = false,
				enableSlowServe: boolean = false,
				serving: Serving = Serving.RANDOM
	) {
		this.scoreToWin = scoreToWin
		this.enablePowerUp = enablePowerUp
		this.enableSlowServe = enableSlowServe
		this.serving = serving
    }

    scoreToWin: number
    enablePowerUp: boolean
    enableSlowServe: boolean
    serving: Serving
}