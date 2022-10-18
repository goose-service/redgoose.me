import { writable } from 'svelte/store'

export const error = writable(<ServiceError>undefined)
