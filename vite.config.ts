import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Plugin to simulate Netlify functions locally
const apiMockPlugin = () => ({
  name: 'api-mock',
  configureServer(server: any) {
    server.middlewares.use(async (req: any, res: any, next: any) => {
      if (req.url === '/api/send-email' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk: string) => { body += chunk })
        req.on('end', async () => {
          try {
            const func = await import('./api/send-email.ts')
            // Populate process.env with Vite envs (from .env file)
            const env = loadEnv('', process.cwd(), '')
            Object.assign(process.env, env)

            const webReq = new Request(`http://localhost${req.url}`, {
              method: 'POST',
              headers: req.headers,
              body: body || null
            })
            
            const webRes: Response = await func.default(webReq)
            
            res.statusCode = webRes.status
            webRes.headers.forEach((value: string, key: string) => res.setHeader(key, value))
            res.end(await webRes.text())
          } catch (e) {
            console.error(e)
            res.statusCode = 500
            res.end('Internal Server Error')
          }
        })
        return
      }
      next()
    })
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), vue(), apiMockPlugin()],
})
