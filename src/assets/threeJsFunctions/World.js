import  * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js'

import Cloud from './Cloud.js'
import Password from './Password.js'
import Navigator from './Navigator.js'
import Raycaster from './Raycaster.js'
import Cube from './Cube.js'
import RoadMap from './RoadMap.js'
import BD from './Bd.js'
import Art from './Art.js'

import dat from 'dat.gui'
import gsap from 'gsap'

export default class World{
  constructor(){

    this.canvas = document.getElementById('canvas')
    this.scene = new THREE.Scene()
    this.camera
    this.renderer

    this.speed = 3
    this.cameraZ = 5
    this.renderCubeScene = false
    this.renderCloudScene = true
    this.renderCloudHole = true
    this.renderNavigation = false
    this.renderArt = false
    this.activePage = ""

    // Assets
    this.cube
    this.particles
    this.mixer
    this.controls
    this.gui
    this.sizes
    this.effectComposer
    this.unrealBloomPass

    // Ini
    this.createCamera()
    this.createRenderer()
    this.orbitControl()
    this.postProcessing()
    this.navButtonEvent()

    // Sub Classes
    this.Cloud = new Cloud({
      canvas: this.canvas,
      scene: this.scene
    })
    this.Password = new Password(this.scene, this.camera)
    this.Raycaster = new Raycaster()
    this.Cube = new Cube(this.scene)
    this.Navigator = new Navigator(this)
    this.RoadMap = new RoadMap(this.scene)
    this.Bd = new BD(this.scene, this.camera)
    this.Art = new Art(this.scene, this.camera)
    this.openGame

    this.checkDevMode()

    // ==== //
    // Loop //
    // ==== //
    this.date = new THREE.Clock()
    this.lastTime

    const tick = () => {
      this.render()
      requestAnimationFrame(tick)
    }
    tick()

    // ====== //
    // Resize //
    // ====== //
    this.resize()
    
    window.addEventListener('resize', () => {
      this.resize()
    })
  }

  // ====== //
  // Camera //
  // ====== //
  createCamera(){
    this.camera = new THREE.PerspectiveCamera(75, 0, 0.01, 1000)
    this.camera.position.z = this.cameraZ
  }    

  // ======== //
  // Renderer //
  // ======== //
  createRenderer(){
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    })
    this.renderer.physicallyCorrectLight = true
  }
   
  orbitControl(){
    // Control
    this.controls = new OrbitControls(this.camera, this.canvas)
    this.controls.zoomSpeed = 0.5
    this.controls.enableDamping = true
    this.controls.enablePan = false
    this.controls.enabled = false
  }
  
  render(){
    const elapsed = this.date.getElapsedTime()
    const deltaTime = elapsed - this.lastTime
    this.lastTime = elapsed

    // Render Cube Scene
    if(this.renderCubeScene){
      this.Cube.render(deltaTime, elapsed)

      // Control
      this.controls.update()
    }

    // Render Cloud Scene
    if(this.renderCloudScene){
      this.Cloud.plane.material.uniforms.uTime.value = elapsed
    }
    if(this.renderCloudHole){
      this.Raycaster.raycast(this.sizes, this.camera, [this.Cloud.hitbox], this.Cloud)
    }

    // Render Navigation Scene
    if(this.renderNavigation){
      this.Raycaster.raycast(this.sizes, this.camera, this.Navigator.hitBoxList, this.Navigator)
    }

    // Render Art
    if(this.renderArt){
      this.Raycaster.raycast(this.sizes, this.camera, this.Art.meshList, this.Art)
    }

    // Render
    this.effectComposer.render(this.scene, this.camera)
  }


  resize(){
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    // Update Camera position
    if(this.sizes.width > this.sizes.height){
      this.cameraZ = 5
    }
    else{      
      this.cameraZ = 7
    }

    const updateCamera = this.renderNavigation || this.renderCloudHole || this.activePage === "roadmap" 
    if(updateCamera && this.camera.position.z !== this.cameraZ){
      this.camera.position.z = this.cameraZ
    }

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height
    this.camera.updateProjectionMatrix()

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // Resize Composer
    this.effectComposer.setSize(this.sizes.width, this.sizes.height)
    this.effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    if(this.renderCloudScene){
      this.Cloud.resize(this.sizes)
    }
  }

  checkDevMode(){
    if(window.location.hash.match('dev')){
      this.gui = new dat.GUI()
      this.Cloud.devPanel(this.gui)

      const postProcessingFolder = this.gui.addFolder('PostProcessing')
      postProcessingFolder.add(this.unrealBloomPass, 'strength', 0, 1, 0.001).name('Strength')
      postProcessingFolder.add(this.unrealBloomPass, 'radius', 0, 3, 0.001).name('Radius')
      postProcessingFolder.add(this.unrealBloomPass, 'threshold', 0, 2, 0.001).name('Threshold')
    }
  }

  postProcessing(){
    this.effectComposer = new EffectComposer(this.renderer)

    const renderPass = new RenderPass(this.scene, this.camera)
    this.effectComposer.addPass(renderPass)

    // Bloom
    this.unrealBloomPass = new UnrealBloomPass()
    this.unrealBloomPass.strength = 0.11
    this.unrealBloomPass.radius = 0.1
    this.unrealBloomPass.threshold = 0
    this.effectComposer.addPass(this.unrealBloomPass)
      
    // Antialias
    const smaaPass = new SMAAPass()
    this.effectComposer.addPass(smaaPass)
  }

  navButtonEvent(){    
    const homeButton = document.getElementById('homeButton')
    homeButton.addEventListener('click', () => {
      this.hideNavButton()

      // Close the current Page
      if(this.activePage === "cube"){
        this.Cube.close()

        // Controls
        this.resetControls()

        setTimeout(() => {
          // Cloud
          this.Cloud.open()
          this.renderCloudScene = true

          // Cube
          this.renderCubeScene = false
          this.Cube.dispose()
        }, 3000)
      }
      else if(this.activePage === "roadmap"){
        this.RoadMap.hide()
        setTimeout(() => {
          this.RoadMap.dispose()   
        }, 2000)
      }
      else if(this.activePage === "bd"){
        this.Bd.close()
        this.Bd.clearAudio()

        setTimeout(() =>{
          this.Bd.dispose()
        }, 3000)
      }
      else if(this.activePage === "art"){
        this.renderArt = false

        this.Art.close()
      }
      
      setTimeout(() => {
        this.renderNavigation = true
        this.Navigator.openNavigation()
      }, 3000) 
    })
  }

  resetControls(){
    const local = this
    this.controls.enabled = false

    gsap.to(this.camera.position, {
      x: 0,
      y: 0,
      z: 5,
      duration: 2,
      ease: "power1.inOut",
      onUpdate:function(){
        local.camera.lookAt(0, 0, 0)
      }
    })
  }

  displayNavButton(){
    const homeButton = document.getElementById('homeButton')

    homeButton.style.opacity = 1
    homeButton.style.pointerEvents = "all"
  }

  hideNavButton(){
    const homeButton = document.getElementById('homeButton')

    homeButton.style.opacity = 0
    homeButton.style.pointerEvents = "none"
  }

  //Open CubePage
  openCubePage(){
    this.World.controls.enabled = true
    this.World.Cloud.close()

    setTimeout(() => {
      this.World.displayNavButton()
      this.World.activePage = "cube"

      this.World.Cube.iniScene()
      this.World.renderCloudScene = false
      this.World.renderCubeScene = true
    }, 3000)
  }

  //Open RoadMap
  openRoadmap(){
    setTimeout(() => {
      this.World.displayNavButton()
      this.World.activePage = "roadmap"
  
      this.World.RoadMap.populate(this.World.Password.font)
      this.World.RoadMap.display()
    }, 2000)
  }

  // Open BD
  openBD(){
    setTimeout(() => {
      this.World.displayNavButton()
      this.World.activePage = "bd"
  
      this.World.Bd.open()      
    }, 2000)
  }

  // Open Art
  openArt(){
    setTimeout(() => {
      this.World.displayNavButton()
      this.World.activePage = "art"
  
      this.World.Art.open()      
      this.World.renderArt = true
    }, 2000)
  }
}