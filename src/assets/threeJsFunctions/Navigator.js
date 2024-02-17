import * as THREE from 'three'
import gsap from 'gsap'

export default class Navigator{
  constructor(World){

    this.World = World
    this.font
    this.scene = this.World.scene
    this.currentObject = null
    this.meshGroup = new THREE.Group()
    this.hitBoxList = []
    this.navList = [
      {
        name: "Story",
        color: 0xffffff,
        callBack: this.World.openBD,
        World: this.World
      },
      {
        name: "Art",
        color: 0xffffff,
        callBack: this.World.openArt,
        World: this.World
      },
      {
        name: "Faq",
        color: 0xffffff,
        callBack: this.World.openCubePage,
        World: this.World
      },
      {
        name: "Roadmap",
        color: 0xffffff,
        callBack: this.World.openRoadmap,
        World: this.World
      },
      {
        name: "Game",
        color: 0xffffff,
        callBack: null,
        World: this.World
      },
    ]

    this.lastOverCube
    this.loadFont()
    this.clickEvent()
  }

  loadFont(){
    const loader = new THREE.FontLoader()
    loader.load(
      './font.json',(font) =>
      {
        this.font = font
        this.createCube()
      }    
    )
  }

  createCube(){
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
    
    let id = 0
    for (let cube of this.navList){
      const group = new THREE.Group()
      
      // Cube
      const cubeMesh = new THREE.Mesh(
        cubeGeometry,
        new THREE.MeshBasicMaterial({
          color: cube.color,
          transparent: true,
          opacity: 0
        })
      )
      
      // Text  
      const textMesh = new THREE.Mesh(
        new THREE.TextGeometry(cube.name, {
          font: this.font,
          size: 0.5,
          height: 0.2,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5
        }),
        new THREE.MeshBasicMaterial({
          color: 0x303030,
          transparent: true,
          opacity: 0
        })
      )
      textMesh.scale.set(0.25, 0.25, 0.25)

      textMesh.position.x = -0.4
      textMesh.position.y = -0.4
      textMesh.position.z = 0.5

      // HitBox
      cubeMesh.name = id
      id += 1
      
      this.hitBoxList.push(cubeMesh)

      // Merge Groups
      group.add(textMesh)
      group.add(cubeMesh)
      this.meshGroup.add(group)
    }

    // Cube Positions
    this.meshGroup.children[0].position.set(-1.2, 1.2, 0)
    this.meshGroup.children[1].position.set(1.2, 1.2, 0)
    this.meshGroup.children[2].position.set(-1.2, -1.2, 0)
    this.meshGroup.children[3].position.set(1.2, -1.2, 0)

    this.meshGroup.visible = false
    this.scene.add(this.meshGroup)

    for (let child of this.meshGroup.children){
      child.lookAt(0, 0, 3)
    }
  }

  openNavigation(){
    this.meshGroup.visible = true

    for(let cubeGroup of this.meshGroup.children){
      for(let mesh of cubeGroup.children){
        gsap.to(mesh.material, {
          opacity: 0.5,
          ease: "power1.inOut",
          duration: 3
        })
      }
    }

    gsap.to(this.meshGroup.position, {
      z: 2,
      ease: "power1.inOut",
      duration: 3
    })
  }

  closeNavigation(){
    this.World.renderNavigation = false

    // Fade Cube
    for(let cubeGroup of this.meshGroup.children){
      for(let mesh of cubeGroup.children){
        gsap.to(mesh.material, {
          opacity: 0,
          ease: "power1.inOut",
          duration: 3
        })
      }
    }
    
    // Move Group
    const local = this
    gsap.to(this.meshGroup.position, {
      z: 1,
      ease: "power1.inOut",
      duration: 3,
      onComplete:function(){
        local.meshGroup.visible = false
      }
    })
  }

  raycastCallBack(cubeOvered){
    if(!cubeOvered){
      if(this.lastOverCube){
        document.getElementById('app').style.cursor = "default"
        this.offCube(this.lastOverCube)
      }
      this.lastOverCube = null
      this.currentObject = null
    }
    else{
      const overGroup = this.meshGroup.children[cubeOvered.object.name]
      this.currentObject = this.navList[cubeOvered.object.name]

      if(overGroup !== this.lastOverCube){
        this.onMesh(overGroup)
        document.getElementById('app').style.cursor = "pointer"
  
        if(this.lastOverCube){
          this.offCube(this.lastOverCube)
        }
      }

      this.lastOverCube = overGroup
    }
  }

  onMesh(group){
    for (let child of group.children){
      gsap.to(child.material, {
        opacity: 1,
        duration: 0.5
      })
    }
  }
  
  offCube(group){
    for (let child of group.children){
      gsap.to(child.material, {
        opacity: 0.5,
        duration: 0.5
      })
    }
  }

  clickEvent(){
    document.addEventListener('click', () => {
      setTimeout(() => {
        if(this.currentObject){
          if(this.currentObject.name != "Game"){
            this.closeNavigation()
          }

          this.currentObject.callBack()
          
          this.currentObject = null
          document.getElementById('app').style.cursor = "default"
        }
      }, 200)
    })
  }
}