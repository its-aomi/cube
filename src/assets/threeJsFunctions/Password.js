import * as THREE from 'three'
import { getPassword } from '../password.js'

export default class Password{
  constructor(scene, camera){
    this.scene = scene
    this.camera = camera
    
    this.font
    this.textMesh
    this.text = getPassword()

    this.loadFont()
  }

  loadFont(){
    const loader = new THREE.FontLoader()
    loader.load(
      './font.json',(font) =>
      {
        this.font = font
        this.createText()
        this.animText()
      }    
    )
  }

  createText(){
    const geometry = new THREE.TextGeometry(this.text, {
      font: this.font,
      size: 1,
      height: 0.01,
      curveSegments: 12,
      bevelEnabled: false,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5
    })

    const material = new THREE.MeshBasicMaterial({
      color: 0x303030
    })

    this.textMesh = new THREE.Mesh(
      geometry,
      material
    )

    this.textMesh.position.z = -10
    this.textMesh.lookAt(this.camera.position)

    this.scene.add(this.textMesh)
  }

  animText(){
    while(Math.abs(this.textMesh.position.x) < 1.5){
      this.textMesh.position.x = (Math.random() - 0.5) * (window.innerWidth * 0.01)
    }
    while(Math.abs(this.textMesh.position.y) < 1.5){
      this.textMesh.position.y = (Math.random() - 0.5) * (window.innerHeight * 0.01)
    }
    
    this.textMesh.rotation.z = (Math.random() - 0.5) * 2
  }

  dispose(){
    this.textMesh.geometry.dispose()
    this.textMesh.material.dispose()
    this.scene.remove(this.textMesh)
    this.textMesh = undefined
  }
}