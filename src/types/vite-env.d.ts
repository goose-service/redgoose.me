/// <reference types="svelte" />
/// <reference types="vite/client" />

import type { SvelteComponent } from 'svelte'

declare global {

  export interface Window {
    app: SvelteComponent
  }

  export interface Route {
    breadcrumbs?: any[]
    from?: string
    match: string
    params: { [ key: string ]: string }
    pattern: string
    query: { [ key: string ]: string }
    subscribe(): void
    url: string
  }

  export interface UnknownObject {
    [key: string]: string|number
  }

}

export {}
