import * as THREE from 'three'
import gsap from 'gsap'

export default class RoadMap{
  constructor(scene){
    this.scene = scene
    this.globalGroup = new THREE.Group()
    this.isHold = false
    this.road = [
      [
        "End of July 2022:",
        "Release of nft + Staking live +marketing event"
      ],
      [
        "End of August 2022:",
        "Release of medium and hard puzzle "
      ],
      [
        "End of September 2022:",
        "Release of impossible puzzle + huge marketing event on it"
      ],
      [
        "End of October 2022:",
        "New merch+Halloween Event "
      ],
      [
        "End of November 2022:",
        "Animated song"
      ],
      [
        "End of December 2022:",
        "Tome 1 comic book+Christmas event "
      ],
      [
        "End of January 2023:",
        "New year event"
      ],
      [
        "End of February 2023:",
        "Tome 2 comic book"
      ],
      [
        "End of March 2023:",
        "Meet up with the community"
      ],
      [
        "End of April 2023:",
        "Easter event "
      ],
      [
        "May 2023:",
        "Anime movie Sneak peak"
      ],
      [
        "July 2023:",
        "Anime movie release"
      ],
      [
        "August 2023:",
        "Album of animated songs"
      ],
      [
        "September 2023-February 2024:",
        "Nft play focus(Second release of a ultra impossible puzzle "
      ],
      [
        "2024-2026:",
        "Hyped focus event and project"
      ],
    ]
    this.offset = 1.2
    this.lastY = null
    this.maxY = this.road.length * this.offset
    this.posY = 0
    this.anim
    this.boxMaterial
    this.textMaterial
    this.lights = []
  }
  
  populate(font){
    // Box assets
    const boxGeometry = new THREE.BoxGeometry(5, 0.8, 0.2)
    this.boxMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    })

    // Text assets
    this.textMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0
    })

    let i = 0
    this.meshList = []

    // Title
    const groupTop = new THREE.Group()
    const textTop = new THREE.Mesh(
      new THREE.TextGeometry("Roadmap: Click and scroll down to navigate", {
        font: font,
        size: 0.15,
        height: 0.03,
        curveSegments: 12,
        bevelEnabled: false,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 5
      }),
      this.boxMaterial
    )
    textTop.position.x = -2
      
    groupTop.position.y = 1
    groupTop.position.z = 1
    groupTop.add(textTop)
    this.globalGroup.add(groupTop)

    for (let line of this.road){
      // Box Group
      const group = new THREE.Group()

      // Create Box
      const box = new THREE.Mesh(
        boxGeometry,
        this.boxMaterial
      )
      group.add(box)

      // Create Date
      const date = new THREE.Mesh(
        new THREE.TextGeometry(line[0], {
          font: font,
          size: 0.08,
          height: 0.01,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5
        }),
        this.textMaterial
      )
      date.position.x = -(line[0].length * 0.025)
      date.position.y = 0.1
      date.position.z = 0.27
      group.add(date)

      // Create Text
      const text = new THREE.Mesh(
        new THREE.TextGeometry(line[1], {
          font: font,
          size: 0.1,
          height: 0.015,
          curveSegments: 12,
          bevelEnabled: false,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5
        }),
        this.textMaterial
      )
      text.position.x = -(line[1].length * 0.035)
      text.position.y = -0.1
      text.position.z = 0.27
      group.add(text)

      group.position.y = -i * this.offset
      group.position.z = 1
      i += 1

      this.globalGroup.add(group)    
    }

    const group = new THREE.Group()
    const lineGeometry = new THREE.BoxGeometry(0.2, this.maxY - 0.6, 0.2)
    const line = new THREE.Mesh(
      lineGeometry,
      this.boxMaterial
    )
      
    group.position.y = -(this.maxY / 2) + 0.6
    group.position.z = 1
    group.add(line)
    this.globalGroup.add(group)

    this.scene.add(this.globalGroup)

    this.addLights()
    this.animate()
  }

  addLights(){
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1.5 )
    directionalLight.position.set(-1, 0.33, 0.47)

    const ambiantLight = new THREE.AmbientLight(0xffffff, 0.3)

    this.lights.push(directionalLight, ambiantLight)
    this.scene.add(directionalLight)
    this.scene.add(ambiantLight)
  }

  animate(){
    document.addEventListener('mousedown', () => {
      this.isHold = true
    })
    document.addEventListener('mouseup', () => {
      this.isHold = false
      this.lastY = null
    })
    document.addEventListener('touchdown', () => {
      this.isHold = true
    })
    document.addEventListener('touchup', () => {
      this.isHold = false
      this.lastY = null
    })
    
    document.addEventListener('mousemove', event => {
      this.drag(event.clientY)
    })
    document.addEventListener('touchmove', event => {
      this.drag(event.changedTouches[0].clientY)
    })
  }

  drag(y){
    if(this.isHold){
      if(this.lastY){
        const movement = y - this.lastY
        
        const newPos = this.posY - movement * 0.01
        if(newPos < this.maxY && newPos > 0){
          this.posY = newPos

          if(this.anim){
            this.anim.kill()
          }

          this.anim = gsap.to(this.globalGroup.position, {
            y: this.posY,
            duration: 1,
            ease: "power1.out",
          })
        }
      }
      this.lastY = y
    }
  }

  display(){
    gsap.to(this.boxMaterial, {
      opacity: 1,
      duration: 2,
      ease: "power1.in",
    })
    gsap.to(this.textMaterial, {
      opacity: 1,
      duration: 2,
      ease: "power1.in",
    })
  }

  hide(){
    gsap.to(this.boxMaterial, {
      opacity: 0,
      duration: 2,
      ease: "power1.out",
    })
    gsap.to(this.textMaterial, {
      opacity: 0,
      duration: 2,
      ease: "power1.out",
    })
  }

  dispose(){
    for(let group of this.globalGroup.children){
      for (let mesh of group.children){
        mesh.material.dispose()
        mesh.geometry.dispose()
      }
      group = undefined
    }
    this.scene.remove(this.globalGroup)

    for(let light of this.lights){
      light.dispose()
      this.scene.remove(light)
    }
  }
}
