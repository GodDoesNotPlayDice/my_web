/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '@tsparticles/vue3' {
  import type { App } from 'vue'
  const Particles: {
    install: (app: App, options?: { init?: (engine: unknown) => Promise<void> }) => void
  }
  export default Particles
}
