const characterList = [
  "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "0" 
]
const minLenght = 4
const maxLenght = 6
let password = ""

export function generatePassword(){
  password = ""
  // Calculate Lenght
  const difference = maxLenght - minLenght
  const lenght = minLenght + Math.round(difference * Math.random())

  // Generate Password
  for (let i = 0; i < lenght; i++){
    const id = Math.round((characterList.length - 1) * Math.random())
    password += characterList[id]
  }

  return password
}

export function getPassword(){
  return password
}