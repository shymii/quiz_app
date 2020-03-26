<template>
	<div id="app">
		<div v-if="loginCode" id="code-page">
			<div class="code-title">
				<p class="code-title-text">Quiz App</p>
			</div>
			<div class="code-card">
				<label for="code" class="code-card-label">CODE:</label>
				<input type="text" id="code" class="code-card-input" v-model="code" placeholder="Type in code">
				<button @click="checkCode()" class="code-card-button">START</button>
			</div>
		</div>
		<div v-if="start" id="login-page">
			<div class="login-card">
				<label for="login" class="login-card-label">Enter your name:</label>
				<input type="text" id="login" class="login-card-input" v-model="login" placeholder="Type your name">
				<button @click="checkName()" class="login-card-button">PLAY</button>
			</div>
		</div>
		<div id="waiting-page" v-if="logged">
			<p class="category-title">Waiting for players...</p>
		</div>
		<div id="question" v-if="category" :key="currQuestNum">
			<p :bind="currQuestNum" class="question-number">Pytanie {{currQuestNum + 1}}</p> 
			<p :bind="myJson" class="question-content">{{ myJson[questionNum].question_content }}</p>
			<div class="question-answers">
				<p :bind="myJson" class="question-answer" @click="answerChosen(myJson[questionNum].answer_a.is_true)">{{ myJson[questionNum].answer_a.answer_content }}</p>
				<p :bind="myJson" class="question-answer" @click="answerChosen(myJson[questionNum].answer_b.is_true)">{{ myJson[questionNum].answer_b.answer_content }}</p>
				<p :bind="myJson" class="question-answer" @click="answerChosen(myJson[questionNum].answer_c.is_true)">{{ myJson[questionNum].answer_c.answer_content }}</p>
                <p :bind="myJson" class="question-answer" @click="answerChosen(myJson[questionNum].answer_c.is_true)">{{ myJson[questionNum].answer_c.answer_content }}</p>
			</div>
		</div>
		<div id="result" v-if="result">
			<p class="result-header">Your score</p>
			<p :bind="allAnswers" class="result-number">{{ allAnswers }}/5</p>
			<p>in</p>
			<p :bind="time" class="result-time">{{ time/1000 }}sec</p>
		</div>
	</div>
</template>

<script>
import catA from './data/categorya.json'
import catB from './data/categoryb.json'
import catC from './data/categoryc.json'
import io from 'socket.io-client'

export default {
	data(){
		return{
			socket: io('http://localhost:4000'),	
			myJson: null,		
			login: '',
			code: '',
			loginCode: true,			
			start: false,		
			logged: false,		
			result: false,
			category: false,		
			questions: [],
			questionNum: 0,
			currQuestNum: 0,
			questTimeout: null,
			timeInterval: null,
			currAnswer: null,
			allAnswers: 0,
			time: 0
		}
	},
	methods: {
		//sprawdza czy jest nick, jak tak to startuje quiz
		checkName(){
			if(this.login.length > 3){
				this.startQuiz()
			} else{
				alert('Wpisz imię dluzsze niz 3 litery')
			}
		},
		checkCode(){
			this.socket.emit('code', this.code);
		},
		//start quizu usuwa pole logowania i zmienia na pytanie pierwsze z arraya wylosowanych pytan
		startQuiz(){
			this.start = false
			this.logged = true
			this.socket.emit('login', this.login)
		},
		startTimeout(){
			this.questTimeout = setTimeout(() => {
				clearInterval(this.timeInterval)
				this.startInterval()
				if(this.currAnswer == true){
					this.allAnswers++
				}
				this.currAnswer = null;
				this.currQuestNum++;
				this.questionNum = this.questions[this.currQuestNum];
				if(this.currQuestNum != 4){
					this.startTimeout();
				} else {
					this.endTimeout();
				}
			}, 10000);
		},
		endTimeout(){
			setTimeout(() => {
				clearInterval(this.timeInterval)
				if(this.currAnswer == true){
					this.allAnswers++
				}
				this.currAnswer = null;
				this.category = false;
				this.result = true;
			}, 10000);
		},
		answerChosen(isTrue){
			if(this.currAnswer == null){
				this.currAnswer = isTrue;
			}
			clearInterval(this.timeInterval)
		},
		startInterval(){
			this.timeInterval = setInterval(() => {
				this.time += 5;
			}, 5)
		}
	},
	created(){
		//po utworzeniu komponentu losuje 5 pytan z bazy i wrzuca je do arraya i laczy sie z serwerem
		this.socket.on('code', () => {
			this.loginCode = false;
			this.start = true;
		})

		this.socket.on('login', () => {
			this.category = true;
			this.logged = false;
			this.questionNum = this.questions[this.currQuestNum];
			this.startTimeout();
			this.startInterval();
		})

		this.socket.on('randomNums', data => {
			this.questions = data;
		})

		this.socket.on('category', data => {
			if(data == 'categoryA'){
				this.myJson = catA
			} else if(data == 'categoryB'){
				this.myJson = catB
			} else if(data == 'categoryC'){
				this.myJson = catC
			}
		})


	}
}
</script>

<style lang="scss">
	#app{
        height: 100vh;
        width: 100vw;
        color: #707070;
        overflow: hidden;
        #code-page{
            width: 100%;
            font-family: 'Montserrat', sans-serif;
            .code-title{
                font-size: 40px;
                font-weight: 600;
                text-align: center;
                margin-top: 170px;
            }
            .code-card{
                label{
                    display: block;
                    font-size: 40px;
                    text-align: center;
                    font-weight: 600;
                    margin-top: 3em;
                }
                input{
                    display: block;
                    height: 47px;
                    width: 186px;
                    border-radius: 5px;
                    border: 1px solid #dddddd;
                    background-color: rgba(255, 255, 255, .5);
                    margin: auto;
                    text-align: center;
                    font-size: 20px;
                    font-weight: 500;
                    margin-top: .5em;
                    color: #707070;
                }
                button{
                    display: block;
                    border-radius: 5px;
                    border: 1px solid #707070;
                    background-color: rgba(255, 255, 255, .5);
                    width: 155px;
                    height: 62px;
                    margin: auto;
                    margin-top: 3em;
                    font-size: 24px;
                    font-weight: 600;
                    color: #707070;
                }
            }
        }
        #login-page{
            font-family: 'Montserrat', sans-serif;
            .login-card{
                label{
                    display: block;
                    font-size: 35px;
                    text-align: center;
                    font-weight: 600;
                    width: 60%;
                    margin: auto;
                    margin-top: 3em;
                }
                input{
                    display: block;
                    height: 47px;
                    width: 186px;
                    border-radius: 5px;
                    border: 1px solid #dddddd;
                    background-color: rgba(255, 255, 255, .5);
                    margin: auto;
                    text-align: center;
                    font-size: 20px;
                    font-weight: 500;
                    margin-top: 10em;
                    color: #707070;
                }
                button{
                    display: block;
                    border-radius: 5px;
                    border: 1px solid #707070;
                    background-color: rgba(255, 255, 255, .5);
                    width: 155px;
                    height: 62px;
                    margin: auto;
                    margin-top: 3em;
                    font-size: 24px;
                    font-weight: 600;
                    color: #707070;
                }
            }
        }
        #waiting-page{
            font-family: 'Montserrat', sans-serif;
            font-size: 35px;
            font-weight: 600;
            width: 60%;
            text-align: center;
            margin: 5em auto;
        }
        #question{
            font-family: 'Montserrat', sans-serif;
            .question-number{
                font-size: 35px;
                font-weight: 600;
                text-align: center;
                margin-top: 3em;
                margin-bottom: 2em;
            }
            .question-content{
                font-size: 20px;
                font-weight: 600;
                width: 80%;
                margin: auto;
            }
            .question-answers{
                width: 80%;
                margin: auto;
                margin-top: 1em;
                p{
                    padding-left: .5em;
                    height: 50px;
                    margin-top: 1em;
                    text-align: left;
                    line-height: 50px;
                    border-radius: 5px;
                    border: 1px solid #dddddd;
                    background-color: rgba(255, 255, 255, .5);
                }
            }
        }
        #result{
            font-family: 'Montserrat', sans-serif;
            p{
                font-size: 35px;
                font-weight: 600;
                text-align: center;
                margin-top: 3em;
            }
        }
    }
</style>
