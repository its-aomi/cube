<template>
  <div>
    <div id="passwordHolder" v-if="isLock">
      <div id="passwordBox">
        <p>
          Hidden Password
        </p>
        <div id="textBox">
        <input type="text" id="userPassword" @keyup="checkPassword" autocomplete="off">
        <button class="how-modal-button" @click="showHowToFindPassword">How to find Password</button>
        </div>
        <div class="modal" v-if="showModal">
          <span class="close" @click="closeModal">&times;</span>
          <video class="modal-video" autoplay muted loop>
            <source :src="require('../assets/video/how.mp4')" type="video/mp4">
              Your browser does not support the video tag.
          </video>
          <p class="modal-text">Move the cursor / finger throughout the screen to find the password.</p>
        </div>
      </div>
    </div>
    <div id="ui">
      <p v-for="text of list" :key="text" class= "textLine">{{ text }}</p>
    </div>
    <div id="homeButton">
      <p>
        &#60;
      </p>
    </div>
    <div id="playBD">
      <p>
        Play
      </p>
    </div>
    <div id="artMessage">
      <p>
        Click to Open/Close the art 
      </p>
    </div>
    <canvas id="canvas" ></canvas>
    <video width="320" height="240" id="video1" class="video">
      <source :src="require('../assets/video/roboanimationwblur20000-0125.mp4')" type="video/mp4">
    </video>
    <video width="320" height="240" id="video2" class="video">
      <source :src="require('../assets/video/roboanimationwblur30000-0125.mp4')" type="video/mp4">
    </video>
    <video width="320" height="240" id="video3" class="video">
      <source :src="require('../assets/video/roboanimationwblur440000-0125.mp4')" type="video/mp4">
    </video>
    <video width="320" height="240" id="video4" class="video">
      <source :src="require('../assets/video/roboanimationwblur4450000-0125.mp4')" type="video/mp4">
    </video>
  </div>
  <div v-if="displayGame">
    <div id="closeWraper">
      <button id="close" @click="displayGame = false">X</button>
    </div>
    <iframe id="game" src="https://i.simmer.io/@Critics/~81c5da01-b0bc-f77e-514d-fc35efdffda2"></iframe>
  </div>
</template>

<script>
import World from '../assets/threeJsFunctions/World.js'
import { generatePassword } from '../assets/password.js'

export default {
  name: 'Password',
  data() {
    return {
      isLock: true,
      list: require('../assets/textList.json')['list'],
      password: "",
      World: null,
      displayGame: false,
      showModal: false // Add showModal property to control modal visibility
    }
  },
  methods: {
    checkPassword() {
      const value = document.getElementById('userPassword').value
      const passwordBox = document.getElementById('passwordBox')

      if (value === this.password) {
        passwordBox.style.opacity = 0

        this.World.Password.dispose()
        this.World.Cloud.closeHole()
        this.World.Navigator.openNavigation()

        this.World.renderCloudHole = false

        setTimeout(() => {
          this.World.renderNavigation = true
        }, 3000)

        setTimeout(() => {
          this.isLock = false
        }, 500)
      }
    },
    // Method to toggle modal visibility
    showHowToFindPassword() {
      this.showModal = !this.showModal; // Toggle showModal property
    },
    // Method to close modal
    closeModal() {
      this.showModal = false;
    }
  },
  mounted() {
    this.password = generatePassword()

    this.World = new World()
    const local = this
    function openGame() {
      local.displayGame = true
    }
    this.World.Navigator.navList[4].callBack = openGame
  },
}
</script>




<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap');
#ui
{
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;

  height: 100vh;
  width: 100vw;

  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: none;
  font-family: 'Open Sans', sans-serif;

  transition-duration: 2000ms;
  opacity: 0;
}
.textLine
{    
  margin-bottom: 40vh;

  position: absolute;
  text-align: center;
  font-size: 2.5em;
  padding: 0 10vw; 

  transition-duration: 500ms;
  transform: translateY(30vh);
  transition-timing-function: ease-in-out;
  opacity: 0;
}
/* Password */
#passwordHolder
{
  position: absolute;
  top: 0;

  height: 100vh;
  width: 100vw;

  display: flex;
  align-items: center;
  justify-content: center;  
}
#passwordBox
{
  padding: 2vh;

  color: white;
  border: 1px solid white;

  transition-duration: 500ms;
}
#passwordBox p
{
  font-size: 2em;
  text-align: center;
  margin: 0;
}
#userPassword
{
  font-size: 1.5em;
  margin: 0.5em;
  padding: 0.5em;

  background-color: transparent;
  border: 2px solid white;
  color: #ffffff;

  outline: none;

  transition-duration: 500ms;
}
/* HomeButton */
#homeButton
{
  position: absolute;
  z-index: 10;
  top: 0;
  color: white;
  margin: 1vh;
  padding: 1vh;

  border: 1px solid white;
  cursor: pointer;

  transition-duration: 1000ms;
  opacity: 0;
  pointer-events: none;
}
#homeButton p
{
  margin: 0;
}
#playBD
{
  position: absolute;
  top: 0;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  height: 100vh;
  width: 100vw;

  transition-duration: 500ms;
  opacity: 0;
  pointer-events: none;
}
#playBD p
{
  font-size: 2em;
  width: min-content;

  color: white;
  border: 1px solid white;
  padding: 1em;

  cursor: pointer;
}
#artMessage
{
  position: absolute;
  top: 0;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  height: 100vh;
  width: 100vw;

  transition-duration: 3000ms;
  opacity: 0;
  pointer-events: none;
}
#artMessage p
{
  font-size: 2em;
  width: min-content;

  color: white;  
  white-space: nowrap;
}
#game
{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
}
#closeWraper
{
  width: 100vw;

  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  right: 0;

  z-index: 10;
}
#close
{
  margin: 5vh;
  background-color: transparent;
  border: 0;
  font-size: 2em;
  color: white;
  cursor: pointer;
}
.video
{
  display: none;
}
@media screen and (orientation: portrait){
  #artMessage p,
  #passwordBox p
  {
    font-size: 6vw;
  }
  #userPassword
  {
    font-size: 5vw;
  }
  .textLine
  {
    font-size: 3vw;
  }
}


.modal {
    position: fixed; /* Stay in place */
    z-index: 9999; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgba(0,0,0,0.6); /* Black w/ opacity */
  }

  .modal-video {
    display: block;
    margin: 0 auto;
    max-width: 80%; /* Adjust as needed */
    max-height: 50vh; /* Adjust as needed */
    margin-top: 200px; /* Adjust as needed */
  }

  .modal-text {
    text-align: center;
    color: white;
	  font-size: 17px !important;
	  margin-top: 20px !important;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 20px;
    color: white;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
  }

  .close:hover,
  .close:focus {
    color: #ccc;
    text-decoration: none;
    cursor: pointer;
  }
</style>