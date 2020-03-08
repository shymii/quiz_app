<template>
	<div id="app">
		<div v-if="loginCode" id="code-page">
			<div class="code-title">
				<h2 class="code-title-text">Hejka quiz ZSTI</h2>
			</div>
			<div class="code-card">
				<label for="code" class="code-card-label">Podaj kod</label>
				<input type="text" id="code" class="code-card-input" v-model="code">
				<button @click="checkCode()" class="code-card-button">START</button>
			</div>
		</div>
		<div v-if="start" id="login-page">
			<div class="login-title">
				<h2 class="login-title-text">Hejka quiz ZSTI</h2>
			</div>
			<div class="login-card">
				<label for="login" class="login-card-label">Podaj imię</label>
				<input type="text" id="login" class="login-card-input" v-model="login">
				<button @click="checkName()" class="login-card-button">START</button>
			</div>
		</div>
		<div id="waiting-page" v-if="logged">
			<h1 class="category-title">Waiting for players</h1>
		</div>
		<div id="question" v-if="category" :key="currQuestNum">
			<h1 :bind="currQuestNum" class="question-number">Pytanie {{currQuestNum + 1}}</h1> 
			<h2 :bind="myJson" class="question-content">{{ myJson[questionNum].question_content }}</h2>
			<div class="question-answers">
				<h3 :bind="myJson" class="question-answer" @click="answerChosen(myJson[questionNum].answer_a.is_true)">{{ myJson[questionNum].answer_a.answer_content }}</h3>
				<h3 :bind="myJson" class="question-answer" @click="answerChosen(myJson[questionNum].answer_b.is_true)">{{ myJson[questionNum].answer_b.answer_content }}</h3>
				<h3 :bind="myJson" class="question-answer" @click="answerChosen(myJson[questionNum].answer_c.is_true)">{{ myJson[questionNum].answer_c.answer_content }}</h3>
			</div>
		</div>
		<div id="result" v-if="result">
			<h1 class="result-header">So basically u got</h1>
			<h2 :bind="allAnswers" class="result-number">{{ allAnswers }}/5</h2>
			<h3 :bind="time">Łączny czas {{ time/1000 }}s</h3>
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
			socket: io('http://localhost:81'),	
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
		width: 80%;
		margin: auto;
		margin-top: 20%;
		#login-page{
			width: 100%;
			.login-title{
				padding: .5em;
				.login-title-text{
					text-align: center;
					font-weight: 200;
					font-size: 2em;
					font-family: 'Montserrat', sans-serif;
				}
			}
			.login-card{
				margin-top: 3em;
				padding: .5em;
				label{
					display: block;
					font-family: 'Montserrat', sans-serif;
					text-align: center;
					font-size: 1.5em;
					margin-bottom: .5em;
				}
				input{
					display: block;
					width: 40%;
					margin: auto;
					height: 2em;
					margin-bottom: .5em;
					&:focus{
						outline-color: #57ACC9;
					}
				}
				button{
					display: block;
					margin: auto;
					width: 25%;
					height: 3em;
					border: 1px solid #222;
					border-radius: .5em;
					background: none;
				}
			}
		}
		#category-page{
			width: 100%;
			*{
				margin: auto;
				margin-bottom: .5em;
				width: 60%;
				padding: .6em;
				text-align: center;
				font-family: 'Montserrat', sans-serif;
			}
			h3{
				background-color: #eee;
			}
		}
		#question{
			*{
				font-family: 'Montserrat', sans-serif;
			}
		}
		#result{
			*{
				font-family: 'Montserrat', sans-serif;
			}
		}
	}
</style>
