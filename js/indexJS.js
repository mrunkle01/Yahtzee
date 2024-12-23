const Dice = {
    amt: 5,
    isChecked: [false, false, false, false, false],
    currentDie: [],
    die: [
        {img: '<i class="fa-solid fa-dice-one"></i>', value: 1},
        {img: '<i class="fa-solid fa-dice-two"></i>', value: 2},
        {img: '<i class="fa-solid fa-dice-three"></i>', value: 3},
        {img: '<i class="fa-solid fa-dice-four"></i>', value: 4},
        {img: '<i class="fa-solid fa-dice-five"></i>', value: 5},
        {img: '<i class="fa-solid fa-dice-six"></i>', value: 6}
    ],
    roll: function () {
        const rollIndex = Math.floor(Math.random() * this.die.length);
        return this.die[rollIndex];

    },
    resetDie() {
        for (let dice of Dice.diceButtons) {
            dice.innerHTML = Dice.die[0].img;
        }
        this.currentDie = Array(this.amt).fill({value: 1});
    },
    createDie() {
        for (let i = 0; i < this.amt; i++) {
            let di = document.createElement("button");
            di.setAttribute("class", "dice");
            di.id = `dice-${i + 1}`;
            di.innerHTML = this.die[0].img;
            di.disabled = true;
            Game.diceBoardDom.appendChild(di);
        }
        this.currentDie = Array(this.amt).fill({value: 1});
        this.diceButtons = Game.diceBoardDom.children;
    },
    updateDieUI() {
        let die = Game.diceBoardDom.children;
        for (let i = 0; i < this.currentDie.length; i++) {
            die[i].innerHTML = this.die[Dice.currentDie[i].value - 1].img;
        }
    },
    updateDieUIColor() {
        for (let i = 0; i < this.diceButtons.length; i++) {
            if (this.isChecked[i])
                this.diceButtons[i].classList.add("clickedDie")
            else {
                this.diceButtons[i].classList.remove('clickedDie')
            }
        }
    },
    resetCheckStatus() {
        for (let i = 0; i < this.isChecked.length; i++) {
            this.isChecked[i] = false;
        }
        this.updateDieUIColor();
    },
    enableDice() {
        for (let button of this.diceButtons) {
            button.disabled = false;
        }
    },
    disableDice() {
        for (let button of this.diceButtons) {
            button.disabled = true;
        }
    },
    setupDiceClickHandlers() {
        for (let i = 0; i < this.diceButtons.length; i++) {
            this.diceButtons[i].addEventListener("click", () => {
                Dice.isChecked[i] = !Dice.isChecked[i];
                Dice.updateDieUIColor();
            });
        }
    }
}


const ScoreBoard = {
    bonusTarget: 60,//change this to check the bonus easier :)
    bonusPoints: 0,
    totalTopScore: 0,
    bonusAchieved: false,
    scoredCtr: 0,
    scoringSpaces: 8,
    scoringButtonsTop:
        [{id: 'ones', searchV: 1}, {id: 'twos', searchV: 2},
            {id: 'threes', searchV: 3}, {id: 'fours', searchV: 4},
            {id: 'fives', searchV: 5}, {id: 'sixes', searchV: 6}],
    scoringButtonsBottom: [{id: 'three-of-kind'}, {id: 'full-house'}],
    updateBonus() {
        if (this.totalTopScore >= this.bonusTarget) {
            this.totalTopScore = this.bonusTarget;
            if (!this.bonusAchieved) {
                this.bonusPoints = 35;
                Game.updateTotal(this.bonusPoints);
                this.bonusAchieved = true;
            }
        }
        this.bonusDom.innerHTML =
            `<div class="bonusNums">Target Score: ${this.bonusTarget}</div>
                 <div class="bonusNums">Bonus Score: ${this.bonusPoints}</div>  
                 <div class="bonusNums">Points Needed: ${this.bonusTarget - this.totalTopScore}</div>`;
    },
    setupScoringButtonHandlers() {
        this.scoringButtonsTop.forEach((scoreObj) => {
            document.getElementById(scoreObj.id).addEventListener('click', function () {
                let ttl = ScoreBoard.scoreTop(scoreObj.searchV);
                ScoreBoard.updateScoreButton(scoreObj, ttl);
                ScoreBoard.totalTopScore += ttl;
                ScoreBoard.isComplete();
                Game.nextTurn();
                ScoreBoard.updateBonus();
            })
        })
        const TOKScoreValue = 30;
        const FHScoreValue = 40;
        const threeOfKindID = this.scoringButtonsBottom[0].id;
        const fullHouseID = this.scoringButtonsBottom[1].id;
        let score = 0;
        document.getElementById(threeOfKindID).addEventListener('click', () => {
            if (ScoreBoard.isThree()) {
                score = TOKScoreValue
                Game.updateTotal(TOKScoreValue);
            }
            ScoreBoard.updateScoreButton(document.getElementById(threeOfKindID), score);
            score = 0;
            ScoreBoard.isComplete();
            Game.nextTurn();
        })
        document.getElementById(fullHouseID).addEventListener('click', () => {
            if (ScoreBoard.isFull()) {
                score = FHScoreValue
                Game.updateTotal(FHScoreValue);
            }
            ScoreBoard.updateScoreButton(document.getElementById(fullHouseID), score);
            score = 0;
            ScoreBoard.isComplete();
            Game.nextTurn();
        });

        this.disableAllScoreButtons();
    },
    isThree() {
        let count = Array(6).fill(0);
        Dice.currentDie.forEach(die => {
            count[die.value - 1]++;
        })
        return count.includes(3);
    },
    isFull() {
        let count = Array(6).fill(0);
        Dice.currentDie.forEach(die => {
            count[die.value - 1]++;
        })
        return (count.includes(3) && count.includes(2));
    },
    updateScoreButton(scoreObj, val) {
        let dom = document.getElementById(scoreObj.id);
        dom.innerText = val;
        dom.disabled = true;
    },
    disableAllScoreButtons() {
        this.scoringButtonsTop.forEach((scoreObj) => {
            document.getElementById(scoreObj.id).disabled = true;
        })
        this.scoringButtonsBottom.forEach((scoreObj) => {
            document.getElementById(scoreObj.id).disabled = true;
        })

    },
    enableNonScored() {
        this.scoringButtonsTop.forEach((scoreObj) => {
            let button = document.getElementById(scoreObj.id);
            if (button.innerText === "Score") {
                button.disabled = false;
            }
        });
        this.scoringButtonsBottom.forEach((scoreObj) => {
            let button = document.getElementById(scoreObj.id);
            if (button.innerText === "Score") {
                button.disabled = false;
            }
        });
    },
    scoreTop(searchValue) {
        let sum = 0;
        Dice.currentDie.forEach(die => {
            if (die.value === searchValue) {
                sum += die.value;
            }
        })
        Game.updateTotal(sum);
        return sum;
    },
    isComplete() {
        if (++this.scoredCtr === this.scoringSpaces) {
            Game.endGame();
        }
    },
    resetScoringButtons() {
        this.scoringButtonsTop.forEach((scoreObj) => {
            let button = document.getElementById(scoreObj.id);
            button.innerText = "Score";
            button.disabled = true;
        });
        this.scoringButtonsBottom.forEach((scoreObj) => {
            let button = document.getElementById(scoreObj.id);
            button.innerText = "Score";
            button.disabled = true;
        })
    }
}

const Game = {
    total: 0,
    turn: 0,
    maxRolls: 3,
    setGameButtons() {
        this.diceBoardDom = document.getElementById('dice-board');
        this.rollButton = document.getElementById("roll");
        this.saveButton = document.getElementById("save");
        this.loadButton = document.getElementById("load");
        this.resetButton = document.getElementById('reset');
        ScoreBoard.bonusDom = document.getElementById('bonus')

        this.resetButton.addEventListener("click", this.reset);
        this.rollButton.addEventListener("click", this.rollDie);
        this.saveButton.addEventListener("click", this.saveGame);
        this.loadButton.addEventListener('click',this.loadGame);
    },
    init() {
        this.setGameButtons();
        Dice.createDie();
        Dice.setupDiceClickHandlers();
        ScoreBoard.updateBonus();
        ScoreBoard.setupScoringButtonHandlers();
        ScoreBoard.disableAllScoreButtons();

        this.hideReset();
    },
    showReset() {
        this.rollButton.style.display = 'none';
        this.saveButton.style.display = 'none';
        this.loadButton.style.display = 'none';
        this.resetButton.style.display = 'inline';
    },
    hideReset() {
        this.resetButton.style.display = 'none';
        this.rollButton.style.display = 'inline';
        this.saveButton.style.display = 'inline';
        this.loadButton.style.display = 'inline';
    },
    rollDie() {
        if (Game.turn++ < Game.maxRolls) {
            if (Game.turn === 1) {
                Dice.enableDice();
                ScoreBoard.enableNonScored();
            }
            for (let i = 0; i < Dice.currentDie.length; i++) {
                if (!Dice.isChecked[i]) {
                    const rolledDie = Dice.roll();
                    Dice.currentDie[i] = {value: rolledDie.value};
                }
            }
            Dice.updateDieUI();

        } else {
            alert("Out of Rolls!!! Must score!")
        }
    },
    updateTotal(sum) {
        Game.total += sum;
        document.getElementById('total-score').innerHTML = `Total Score: ${Game.total}`;
    },
    nextTurn() {
        Dice.resetDie();
        Dice.disableDice();
        Dice.resetCheckStatus();
        ScoreBoard.disableAllScoreButtons();
        this.turn = 0;

    },
    endGame() {
        this.showReset();
    },
    reset() {
        this.total = 0;
        this.turn = 0;
        document.getElementById("total-score").innerText = `Total Score: ${this.total}`;

        Dice.resetDie();
        Dice.resetCheckStatus();
        Dice.disableDice();

        ScoreBoard.scoredCtr = 0;
        ScoreBoard.totalTopScore = 0;
        ScoreBoard.bonusPoints = 0;
        ScoreBoard.updateBonus();
        ScoreBoard.bonusAchieved = false;
        ScoreBoard.resetScoringButtons();
        localStorage.removeItem('gameState');

        Game.hideReset();
        alert("Game Reset!")

    },
    saveGame() {
        const gameState = {
            dice: {
                currentDie: Dice.currentDie,
                isChecked: Dice.isChecked
            },
            game: {
                total: Game.total,
                turn: Game.turn
            },
            scoreboard: {
                totalTopScore: ScoreBoard.totalTopScore,
                bonusAchieved: ScoreBoard.bonusAchieved,
                bonusPoints: ScoreBoard.bonusPoints,
                scoredValues: ScoreBoard.scoringButtonsTop.map(scoreObj => ({
                    id: scoreObj.id,
                    value: document.getElementById(scoreObj.id).innerText
                })),
                scoredBottom: ScoreBoard.scoringButtonsBottom.map(scoreObj => ({
                    id: scoreObj.id,
                    value: document.getElementById(scoreObj.id).innerText
                }))
            }
        };

        localStorage.setItem('gameState', JSON.stringify(gameState));
        alert("Game saved");
    },
    loadGame() {
        const savedState = JSON.parse(localStorage.getItem('gameState'));
        if (!savedState) {
            alert("No saved game found");
            return
        }
        Dice.currentDie = savedState.dice.currentDie;
        Dice.isChecked = savedState.dice.isChecked;
        Dice.updateDieUI();
        Dice.updateDieUIColor();

        Game.total = savedState.game.total;
        Game.turn = savedState.game.turn;
        document.getElementById('total-score').innerHTML = `Total Score: ${Game.total}`;

        ScoreBoard.totalTopScore = savedState.scoreboard.totalTopScore;
        ScoreBoard.bonusAchieved = savedState.scoreboard.bonusAchieved;
        ScoreBoard.bonusPoints = savedState.scoreboard.bonusPoints;
        ScoreBoard.updateBonus();

        savedState.scoreboard.scoredValues.forEach(score => {
            const button = document.getElementById(score.id);
            button.innerText = score.value;
            button.disabled = (score.value !== "Score");
        });

        savedState.scoreboard.scoredBottom.forEach(score => {
            const button = document.getElementById(score.id);
            button.innerText = score.value;
            button.disabled = (score.value !== "Score");
        });
        alert("Game loaded");
    }
}

document.addEventListener('DOMContentLoaded', () => {
    Game.init();
})



