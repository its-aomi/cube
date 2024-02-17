import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { startTextAnimation, stopTextAnimation } from '../animateText.js'
import shader from '../shader/particles.js'

import gsap from 'gsap'

export default class Cube{
  constructor(scene){

    this.scene = scene

    this.cube
    this.particles
    this.ambientLight
    this.pointLight
    
    this.mixer
    this.actionList = []
    this.speed = 8
    
    this.preloadCube()
  }  

  preloadCube(){
    const laoder = new GLTFLoader()

    // Cube
    laoder.load('./Cube.glb', (gltf) => {
      this.cube = gltf.scene

      this.cube.traverse(child => {
        if(child instanceof THREE.Mesh){
          child.material.transparent = true
          child.material.opacity = 0
        }
      })
      this.cube.scale.set(0.4, 0.4, 0.4)

      // Animation
      this.mixer = new THREE.AnimationMixer(this.cube)
      for (let anim of gltf.animations){
        const action = this.mixer.clipAction(anim)
        this.actionList.push(action)
      }
    })
  } 

  render(deltaTime, elapsed){    
    // Mixer  
    if(this.mixer){
      this.mixer.update(deltaTime / this.speed)
    }

    // Particles
    this.particles.material.uniforms.uTime.value = elapsed
    this.particles.rotation.y = elapsed * 0.1
  }

  iniScene(){
    this.createParticles()
    this.createLights()
    this.createCubeScene()

    this.open()
  }
    
  createCubeScene(){
    // Cube
    this.scene.add(this.cube)
  }

  createLights(){
    // Light
    this.ambientLight = new THREE.AmbientLight( 0xffffff, 2 )
    this.scene.add(this.ambientLight)

    this.pointLight = new THREE.PointLight(0xffffff, 10)
    this.pointLight.position.set(10, 10, 10)
    this.scene.add(this.pointLight)
  }

  createParticles() {
    const count = 2000
    const expand = 100
  
    const positions = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * expand
    }
  
    // Geometry
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  
    // Material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 20 },
        uSpeed: { value: 0.005 },
        uStrenght: { value: 1 },
        uFrequency: { value: 2 },
        uAlpha: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      vertexShader: shader.vertex,
      fragmentShader: shader.fragment
    })
  
    this.particles = new THREE.Points(geometry, material)
    this.scene.add(this.particles)
  }

  open(){
    // Display Cube
    this.cube.traverse(child => {
      if(child instanceof THREE.Mesh){
        gsap.to(child.material, {
          opacity: 1,
          duration: 5,
          ease: "power1.in",
        })
      }
    })

    // Display Particles
    gsap.to(this.particles.material.uniforms.uAlpha, {
      value: 1,
      duration: 3,
      ease: "power1.in"
    })

    // Start Animations
    for (let action of this.actionList){
      action.reset()
      action.play()
    }

    // Start Looping Text
    startTextAnimation(this.speed)
  }

  close(){
    // Stop TextAnimation
    stopTextAnimation()

    // Hide Cube
    this.cube.traverse(child => {
      if(child instanceof THREE.Mesh){
        gsap.to(child.material, {
          opacity: 0,
          duration: 3
        })
      }
    })

    // Hide Particles
    gsap.to(this.particles.material.uniforms.uAlpha, {
      value: 0,
      duration: 3
    })
  }
  
  dispose(){
    // Stop animations
    for (let action of this.actionList){
      action.stop()
    }

    // Delete Meshes
    this.particles.geometry.dispose()
    this.particles.material.dispose()
    this.scene.remove(this.particles)
    this.particles = undefined
    
    this.scene.remove(this.cube)

    // Clear Lights
    const lightList = [this.ambientLight, this.pointLight]
    for (let light of lightList){
      light.dispose()
      this.scene.remove(light)
      light = undefined
    }   
  }
}