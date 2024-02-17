import * as THREE from 'three'
import gsap from 'gsap'

export default class Art{
  constructor(scene, camera){

    this.scene = scene
    this.camera = camera
    this.lookAt = {
      x: 0,
      y: 0,
      z: 0
    }
    this.zoom = 1
    this.isOpen = false
    this.play = null
    this.videoList = [
      {
        element: document.getElementById('video1'),
        x: -1,
        y: 1
      },
      {
        element: document.getElementById('video2'),
        x: 1,
        y: 1
      },
      {
        element: document.getElementById('video3'),
        x: -1,
        y: -1
      },
      {
        element: document.getElementById('video4'),
        x: 1,
        y: -1
      },
    ]
    this.meshList = []
    this.currentVideo

    this.populate()
    this.addEvent()
  }

  populate(){
    const geometry = new THREE.PlaneGeometry(1.5, 1.5)
    let id = 0

    for(let video of this.videoList){
      const texture = new THREE.VideoTexture(video.element);
      const mesh = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0 
        })
      )
      
      mesh.position.set(video.x, video.y, 2)
      mesh.lookAt(0, 0, 4)
      video.mesh = mesh

      mesh.name = id
      id += 1
      this.meshList.push(mesh)

      // Loop
      video.element.addEventListener('ended', () => {        
        gsap.to(mesh.material, {
          opacity: 0,
          duration: 0.5,
          ease: "power1.inOut",
          onComplete:function(){       
            video.element.play()     
            gsap.to(mesh.material, {
              opacity: 1,
              duration: 0.5,
              ease: "power1.inOut"
            })
          }
        })
      })
    }
  }

  addEvent(){
    document.addEventListener('click', () => {
      document.getElementById('artMessage').style.opacity = 0
      
      if(this.isOpen){
        if(this.play){          
          this.currentVideo.element.pause()
          this.currentVideo = null
          this.play = null

          this.animCamera(0, 0, 0)
          this.zoomCamera(1)
        }
        else if(this.currentVideo){
          this.play = this.currentVideo
          this.play.element.play()

          this.animCamera(this.currentVideo.x, this.currentVideo.y, 2)
          this.zoomCamera(3)
        }
      }
    })
  }

  open(){
    document.getElementById('artMessage').style.opacity = 1

    this.isOpen = true
    for(let video of this.videoList){
      this.scene.add(video.mesh)
      
      video.element.play()
      video.element.pause()
      
      gsap.to(video.mesh.material, {
        opacity: 1,
        duration: 3,
        ease: "power1.in"
      })
    }
  }

  close(){
    document.getElementById('artMessage').style.opacity = 0
    const local = this
    this.isOpen = false
    document.getElementById('app').style.cursor = "default"
    this.animCamera(0, 0, 0)
    this.zoomCamera(1)

    for(let video of this.videoList){      
      video.element.pause()
      
      gsap.to(video.mesh.material, {
        opacity: 0,
        duration: 3,
        ease: "power1.in",
        onComplete:function(){
          local.scene.remove(video.mesh)
        }
      })
    }
  }

  raycastCallBack(object){
    if(object){
      document.getElementById('app').style.cursor = "pointer"
      this.currentVideo = this.videoList[Number(object.object.name)]
    }
    else {
      document.getElementById('app').style.cursor = "default"
      this.currentVideo = null
    }
  }

  animCamera(x, y, z){
    const local = this
    gsap.to(this.lookAt, {
      x: x,
      y: y,
      z: z,
      duration: 1,
      ease: "power1.inOut",
      onUpdate:function(){
        local.camera.lookAt(local.lookAt.x, local.lookAt.y, local.lookAt.z)
      }
    })
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
}