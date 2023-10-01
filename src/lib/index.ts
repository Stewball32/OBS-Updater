// place files you want to import through the `$lib` alias in this folder.
import { writable } from "svelte/store"


export const allPlayers = writable<Array<string>>([])
export const currentPlayers = writable<Array<string>>([])
export const playerOne = writable<string>("")
export const playerTwo = writable<string>("")
export const playerThree = writable<string>("")
export const playerFour = writable<string>("")
