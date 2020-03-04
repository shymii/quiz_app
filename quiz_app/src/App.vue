<template>
	<div id="app">
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
		<div id="category-page" v-if="logged">
			<h1 class="category-title">Kategorie</h1>
			<h3 class="category-option" @click="categoryChosen()">xyz</h3>
			<h3 class="category-option" @click="categoryChosen()">xyz</h3>
			<h3 class="category-option" @click="categoryChosen()">xyz</h3>
		</div>
		<div id="question" v-if="category" :key="question">
			<h1 :bind="question" class="question-number">Pytanie {{question + 1}}</h1> 
			<h2 :bind="fullQuestion" class="question-content">{{fullQuestion.question_content}}</h2>
			<div class="question-answers">
				<h3 class="question-answer" :bind="fullQuestion" @click="nextQuestion(fullQuestion.answer_a.is_true)">{{fullQuestion.answer_a.answer_content}}</h3>
				<h3 class="question-answer" :bind="fullQuestion" @click="nextQuestion(fullQuestion.answer_b.is_true)">{{fullQuestion.answer_b.answer_content}}</h3>
				<h3 class="question-answer" :bind="fullQuestion" @click="nextQuestion(fullQuestion.answer_c.is_true)">{{fullQuestion.answer_c.answer_content}}</h3>
			</div>
		</div>
		<div id="result" v-if="result">
			<h1 class="result-header">So basically u got</h1>
			<h2 :bind="trueAnswers" class="result-number">{{trueAnswers}}/5</h2>
			<h3 :bind="time">W czasie {{this.time}}s</h3>
		</div>
	</div>
</template>

<script>
import json from './data/data.json'

export default {
	data(){
		return{
			timeout: null,		
			interval: null,		
			myJson: json,		
			login: '',			
			start: true,		
			logged: false,		
			result: false,
			category: false,		
			questions: [],		
			question: 0,		
			currQuestion: '',	
			fullQuestion: 0,	
			playerScore: [],	
			trueAnswers: 0,		
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
		//start quizu usuwa pole logowania i zmienia na pytanie pierwsze z arraya wylosowanych pytan
		startQuiz(){
			this.start = false
			this.logged = true
		},
		//funkcja ktora zamienia pytanie na ekranie
		questionUpdate(question){
			clearInterval(this.interval)
			clearTimeout(this.timeout)
			switch(question){
			case 1:
				this.fullQuestion = this.myJson.questions.one
				this.startInterval()
				this.startTimeout()
				break;
			case 2:
				this.fullQuestion = this.myJson.questions.two
				this.startInterval()
				this.startTimeout()
				break;
			case 3:
				this.fullQuestion = this.myJson.questions.three
				this.startInterval()
				this.startTimeout()
				break;
			case 4:
				this.fullQuestion = this.myJson.questions.four
				this.startInterval()
				this.startTimeout()
				break;
			case 5:
				this.fullQuestion = this.myJson.questions.five
				this.startInterval()
				this.startTimeout()
				break;
			case 6:
				this.fullQuestion = this.myJson.questions.six
				this.startInterval()
				this.startTimeout()
				break;
			case 7:
				this.fullQuestion = this.myJson.questions.seven
				this.startInterval()
				this.startTimeout()
				break;
			case 8:
				this.fullQuestion = this.myJson.questions.eight
				this.startInterval()
				this.startTimeout()
				break;
			case 9:
				this.fullQuestion = this.myJson.questions.nine
				this.startInterval()
				this.startTimeout()
				break;
			case 10:
				this.fullQuestion = this.myJson.questions.ten
				this.startInterval()
				this.startTimeout()
				break;
			case 11:
				this.fullQuestion = this.myJson.questions.eleven
				this.startInterval()
				this.startTimeout()
				break;
			case 12:
				this.fullQuestion = this.myJson.questions.twelve
				this.startInterval()
				this.startTimeout()
				break;
			case undefined:
			//tutaj sie dzieje wszystko po odpowiedzi na ostatnie pytanie, czyli przechodzi do result i wysyla na serwer
				for(let i=0; i<this.playerScore.length; i++){
					if(this.playerScore[i]===true){
						this.trueAnswers++
					}
				}
				this.category = false
				this.result = true
				this.time = this.time/1000
			}
		},
		categoryChosen(){
			this.logged = false
			this.category = true
			this.currQuestion = this.questions[this.question]
			this.questionUpdate(this.currQuestion)
		},
		//zmiana pytania po kliknieciu odpowiedzi
		nextQuestion(isTrue){
			this.playerScore.push(isTrue)
			this.question++
			this.currQuestion = this.questions[this.question]
			this.questionUpdate(this.currQuestion)
		},
		//czas na jedno pytanie
		startTimeout(){
            this.timeout = setTimeout(() => {
                this.playerScore.push(false)
                this.question++
				this.currQuestion = this.questions[this.question]
				this.questionUpdate(this.currQuestion)
            }, 5000)
		},
		//zliczanie czasu na odpowiedzi
		startInterval(){
			this.interval = setInterval(() => {
					this.time += 5;
			}, 5)
		}
	},
	created(){
		//po utworzeniu komponentu losuje 5 pytan z bazy i wrzuca je do arraya i laczy sie z serwerem
		for(let i = 0; i<5; i++){
			let random = Math.floor(Math.random() * 12) + 1;
			if(!this.questions.includes(random)){
				this.questions.push(random);
			} else{
				i--;
			}
		}
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
