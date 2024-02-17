import * as THREE from 'three'
import gsap from 'gsap'

export default class BD{
  constructor(scene, camera){
    this.scene = scene
    this.camera = camera

    this.plane1
    this.plane2
    this.playButton = document.getElementById('playBD')
    this.audioId = 0
    this.lookAt = {
      x: 0,
      y: 0,
      z: 0
    }
    this.zoom = 1
    this.audioList = [
      {
        lookAt: [-1.65, 1.05, 2],
        audio: new Audio(require("../BD/audio/test.mp3")),
        zoom: 6
      },
      {
        lookAt: [-0.85, 1.1, 2],
        audio: new Audio(require("../BD/audio/2.mp3")),
        zoom: 5.5
      },
      {
        lookAt: [-1.2, 0.3, 2],
        audio: new Audio(require("../BD/audio/3.mp3")),
        zoom: 4
      },
      {
        lookAt: [-1.75, -0.4, 2],
        audio: new Audio(require("../BD/audio/4.mp3")),
        zoom: 6
      },
      {
        lookAt: [-1.75, -1.1, 2],
        audio: new Audio(require("../BD/audio/5.mp3")),
        zoom: 6
      },
      {
        lookAt: [-0.85, -0.65, 2],
        audio: new Audio(require("../BD/audio/6.mp3")),
        zoom: 3.5
      },
      {
        lookAt: [0.8, 1.1, 2],
        audio: new Audio(require("../BD/audio/7.mp3")),
        zoom: 6
      },
      {
        lookAt: [1.5, 1.1, 2],
        audio: new Audio(require("../BD/audio/8.mp3")),
        zoom: 6
      },
      {
        lookAt: [1, 0.4, 2],
        audio: new Audio(require("../BD/audio/9.mp3")),
        zoom: 3
      },
      {
        lookAt: [1, -0.8, 2],
        audio: new Audio(require("../BD/audio/10.mp3")),
        zoom: 3.5
      }
    ]

    this.populate()
    this.buttonEvent()
    this.setAudioEvents()
  }

  populate(){
    const textureLoader = new THREE.TextureLoader()
    const geometry = new THREE.PlaneGeometry(2, 3) 

    this.plane1 = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        map: textureLoader.load(require('../BD/PAGE01low.jpg'))
      })
    )
    this.plane2 = new THREE.Mesh(
      geometry,
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0,
        map: textureLoader.load(require('../BD/PAGE02low.jpg'))
      })
    )

    this.plane1.position.x = -1.2
    this.plane2.position.x = 1.2

    this.plane1.position.z = 2
    this.plane2.position.z = 2
  }

  buttonEvent(){
    this.playButton.addEventListener('click', () => {
      this.closeButton()
      this.newAudio(0)
    })
  }

  setAudioEvents(){
    for(let i = 0; i < this.audioList.length - 1; i++){
      this.audioList[i].audio.addEventListener('ended', () => {
        this.audioList[i].audio.currentTime = 0
        this.newAudio(i + 1)

        if(i == 8){
          setTimeout(() => {
            this.animateCamera([1.5, -0.8, 2])
          }, 1500)
        }
      })
    }

    this.audioList[this.audioList.length - 1].audio.addEventListener('ended', () => {
      this.audioList[this.audioList.length - 1].audio.currentTime = 0
      this.openButton()
      this.clearAudio()
    })
  }

  newAudio(id){
    this.audioList[id].audio.play()

    //Target
    this.animateCamera(this.audioList[id].lookAt)

    // Zoom
    this.zoomCamera(this.audioList[id].zoom)
  }

  zoomCamera(zoom){
    const local = this
    
    gsap.to(this, {
      zoom: zoom,
      duration: 1,
      ease: "power1.out",
      onUpdate:function(){
        local.camera.zoom = local.zoom
        local.camera.updateProjectionMatrix()
      }
    })
  }

  animateCamera(target){
    const local = this
    gsap.to(this.lookAt, {
      x: target[0],
      y: target[1],
      z: target[2],
      duration: 1,
      ease: "power1.inOut",
      onUpdate:function(){
        local.camera.lookAt(local.lookAt.x, local.lookAt.y, local.lookAt.z)
      }
    })
  }

  openButton(){
    this.playButton.style.opacity = 1
    this.playButton.style.pointerEvents = "all"
  }
  closeButton(){
    this.playButton.style.opacity = 0
    this.playButton.style.pointerEvents = "none"
  }

  open(){
    // Display Button
    this.openButton()
    this.audioId = 0

    const materials = [this.plane1.material, this.plane2.material]

    this.scene.add(this.plane1)
    this.scene.add(this.plane2)

    for(let material of materials){
      gsap.to(material, {
        opacity: 1,
        duration: 3,
        ease: "power1.in",
      })
    }
  }

  close(){    
    const materials = [this.plane1.material, this.plane2.material]
    this.closeButton()

    this.scene.add(this.plane1)
    this.scene.add(this.plane2)

    for(let material of materials){
      gsap.to(material, {
        opacity: 0,
        duration: 3,
        ease: "power1.in",
      })
    }
  }
  
  clearAudio(){
    for(let audio of this.audioList){
      audio.audio.pause()
      audio.audio.currentTime = 0
    }
    this.animateCamera([0, 0, 0])
    this.zoomCamera(1)
  }

  dispose(){
    const meshes = [this.plane1, this.plane2]

    for(let mesh of meshes){
      mesh.material.dispose()
      mesh.geometry.dispose()
      this.scene.remove(mesh)
      mesh = undefined
    }
  }
}