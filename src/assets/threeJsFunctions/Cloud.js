import * as THREE from 'three'
import shader from '../shader/cloud.js'
import gsap from 'gsap'

export default class Cloud{
  constructor(payload){
    this.canvas = payload.canvas
    this.scene = payload.scene

    this.plane
    this.hitbox

    this.buildPlane()
    this.buildHitBox()
  }

  buildPlane(){
    const geometry = new THREE.PlaneGeometry(1, 1, 100, 100)
    const material = new THREE.ShaderMaterial({
      vertexShader: shader.vertex,
      fragmentShader: shader.fragment,
      transparent: true,
      uniforms: {
        uTime: {value: 0},
        uSpeed: {value: 0.3},
        uFrequency: {value: 8},
        uHoleFactor: {value: 0},
        uAlphaFactor: {value: 1},
        uMousePos: { value: new THREE.Vector2(0, 0) }
      }
    })

    this.plane = new THREE.Mesh(
      geometry,
      material
    )
    this.scene.add(this.plane)    
  }

  buildHitBox(){
    this.hitbox = new THREE.Mesh(
      this.plane.geometry,
      new THREE.MeshBasicMaterial({
        color: 0xff0000
      })
    )
    this.hitbox.visible = false
    this.scene.add(this.hitbox)
  }

  devPanel(gui){
    const cloud = gui.addFolder('Cloud')

    cloud.add(this.plane.material.uniforms.uSpeed, 'value', 0, 10, 0.01).name('Speed')
    cloud.add(this.plane.material.uniforms.uFrequency, 'value', 0, 20, 0.01).name('Frequency')
  }

  resize(sizes){
    const scaleX = sizes.width * 0.02
    const scaleY = sizes.height * 0.02

    this.plane.scale.set(scaleX, scaleY, 1)
    this.hitbox.scale.set(scaleX, scaleY, 1)
  }

  closeHole(){
    gsap.to(this.plane.material.uniforms.uHoleFactor, {
      value: 1,
      ease: "power1.out",
      duration: 2
    })
  }

  open(){
    this.plane.visible = true

    gsap.to(this.plane.material.uniforms.uAlphaFactor, {
      value: 1,
      ease: "power1.out",
      duration: 2
    })
  }

  close(){
    const plane = this.plane

    gsap.to(this.plane.material.uniforms.uAlphaFactor, {
      value: 0,
      ease: "power1.out",
      duration: 2,
      onComplete:function(){
        plane.visible = false
      }
    })
  }

  raycastCallBack(callback){
    if(callback){
      gsap.to(this.plane.material.uniforms.uMousePos.value, {
        x: callback.point.x,
        y: callback.point.y,
        ease: "power1.out",
        duration: 5
      })
    }
  }
}