/*
    Path + Filename: src/index.ts
*/

import {fetchMatchHistory} from './fetchMatch.js'

let x = await fetchMatchHistory('EUW1_6313527480', 'euw1')

console.log("DISPLAYING")
console.log(x)