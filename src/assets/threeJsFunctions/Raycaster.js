import * as THREE from 'three'

export default class Raycaster{
  constructor(){  
    this.mouseEvent = null
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()

    this.listenMouseEvent()
  } 
  
  listenMouseEvent(){
    document.addEventListener('mousemove', event => {
      this.mouseEvent = {
        x: event.clientX,
        y: event.clientY
      }
    })
    document.addEventListener('touchmove', event => {
      this.mouseEvent = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY
      }
    })
  } 

  raycast(sizes, camera, elemToCatch, classWaiting){
    const interserct = this.getElem(sizes, camera, elemToCatch)
    classWaiting.raycastCallBack(interserct)
  }

  getElem(sizes, camera, elemToCatch){
    if(!this.mouseEvent){
      return
    }
    
    this.mouse.x = ( this.mouseEvent.x / sizes.width ) * 2 - 1
    this.mouse.y = - ( this.mouseEvent.y / sizes.height ) * 2 + 1

    this.raycaster.setFromCamera( this.mouse, camera )
    
    return this.raycaster.intersectObjects(elemToCatch)[0]
  }
}