<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

export interface TechItem {
  id: string
  name: string
  category: 'frontend' | 'backend' | 'database' | 'devops' | 'architecture'
  color: string // hex
  iconType: string
  level?: string
}

const props = withDefaults(
  defineProps<{
    selectedCategory?: string
  }>(),
  {
    selectedCategory: 'all',
  }
)

const emit = defineEmits<{
  (e: 'selectTech', tech: TechItem | null): void
}>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const isAutoRotating = ref(true)
const hoveredTech = ref<TechItem | null>(null)

// 24 Full-stack technologies tailored to Vicente's profile
const techList: TechItem[] = [
  // Frontend
  { id: 'vue', name: 'Vue.js 3', category: 'frontend', color: '#42b883', iconType: 'vue' },
  { id: 'typescript', name: 'TypeScript', category: 'frontend', color: '#3178c6', iconType: 'ts' },
  { id: 'nuxt', name: 'Nuxt 3', category: 'frontend', color: '#00dc82', iconType: 'nuxt' },
  { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', color: '#38bdf8', iconType: 'tw' },
  { id: 'javascript', name: 'JavaScript ES6+', category: 'frontend', color: '#f7df1e', iconType: 'js' },
  { id: 'gsap', name: 'GSAP Motion', category: 'frontend', color: '#88ce02', iconType: 'gsap' },

  // Backend
  { id: 'python', name: 'Python', category: 'backend', color: '#3776ab', iconType: 'python' },
  { id: 'fastapi', name: 'FastAPI', category: 'backend', color: '#059669', iconType: 'fastapi' },
  { id: 'django', name: 'Django (BFF)', category: 'backend', color: '#092e20', iconType: 'django' },
  { id: 'node', name: 'Node.js', category: 'backend', color: '#68a063', iconType: 'node' },

  // Databases
  { id: 'supabase', name: 'Supabase', category: 'database', color: '#3ecf8e', iconType: 'supabase' },
  { id: 'postgres', name: 'PostgreSQL', category: 'database', color: '#336791', iconType: 'postgres' },
  { id: 'mongodb', name: 'MongoDB', category: 'database', color: '#47a248', iconType: 'mongo' },
  { id: 'mysql', name: 'MySQL', category: 'database', color: '#00758f', iconType: 'mysql' },

  // DevOps & Cloud
  { id: 'linux', name: 'Linux', category: 'devops', color: '#fcc624', iconType: 'linux' },
  { id: 'docker', name: 'Docker', category: 'devops', color: '#2496ed', iconType: 'docker' },
  { id: 'gcp', name: 'Google Cloud', category: 'devops', color: '#ea4335', iconType: 'gcp' },
  { id: 'netlify', name: 'Netlify & CI/CD', category: 'devops', color: '#00c7b7', iconType: 'netlify' },
  { id: 'git', name: 'Git & GitHub', category: 'devops', color: '#f05032', iconType: 'git' },

  // Architecture & Tools
  { id: 'clean', name: 'Clean Architecture', category: 'architecture', color: '#a78bfa', iconType: 'clean' },
  { id: 'ddd', name: 'DDD Domain-Driven', category: 'architecture', color: '#c084fc', iconType: 'ddd' },
  { id: 'scraping', name: 'Playwright & Scraper', category: 'architecture', color: '#45ba4b', iconType: 'scraping' },
  { id: 'datascience', name: 'Data Science', category: 'architecture', color: '#fb923c', iconType: 'datascience' },
]

// SVG Icons matching each technology (clean vector icons)
const techSvgIcons: Record<string, string> = {
  vue: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#42b883" d="M2 3h3.5L12 15L18.5 3H22L12 21z"/><path fill="#35495e" d="M6.5 3h3.5L12 7.5L14 3h3.5L12 12z"/></svg>',
  ts: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="4" fill="#3178c6"/><path fill="#ffffff" d="M10.8 13.6h-2.1v6H6.9v-6H4.8v-1.6h6v1.6zm4.7 4.2c.5.3 1.1.5 1.7.5.8 0 1.2-.3 1.2-.8 0-.5-.4-.7-1.4-1.1-1.3-.5-2.2-1.2-2.2-2.3 0-1.4 1.1-2.4 2.8-2.4 1 0 1.8.3 2.4.7l-.6 1.5c-.5-.3-1.1-.5-1.7-.5-.7 0-1.1.3-1.1.7 0 .5.4.7 1.4 1.1 1.4.5 2.2 1.2 2.2 2.4 0 1.5-1.1 2.4-2.9 2.4-1.1 0-2.1-.4-2.7-.9l.7-1.3z"/></svg>',
  nuxt: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#00dc82" d="M10.5 4a1.5 1.5 0 0 0-1.3.75l-7.5 13A1.5 1.5 0 0 0 3 20h6a1.5 1.5 0 0 0 1.3-.75l2.2-3.8l2.2 3.8A1.5 1.5 0 0 0 16 20h5a1.5 1.5 0 0 0 1.3-2.25l-4.5-7.8a1.5 1.5 0 0 0-2.6 0l-2.2 3.8l-3.2-5.5A1.5 1.5 0 0 0 10.5 4zm0 3.5l4.5 7.8h-9l4.5-7.8zm5.5 5.5l3.2 5.5h-6.4l3.2-5.5z"/></svg>',
  tw: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#38bdf8" d="M12 6c-2.4 0-3.9 1.2-4.5 3.6 1-.8 2.1-1.1 3.3-.9 0.7 0.1 1.2 0.7 1.8 1.2 0.9 1 2 2.1 4.4 2.1 2.4 0 3.9-1.2 4.5-3.6-1 0.8-2.1 1.1-3.3 0.9-0.7-0.1-1.2-0.7-1.8-1.2-0.9-1-2-2.1-4.4-2.1zm-6 6c-2.4 0-3.9 1.2-4.5 3.6 1-.8 2.1-1.1 3.3-.9 0.7 0.1 1.2 0.7 1.8 1.2 0.9 1 2 2.1 4.4 2.1 2.4 0 3.9-1.2 4.5-3.6-1 0.8-2.1 1.1-3.3 0.9-0.7-0.1-1.2-0.7-1.8-1.2-0.9-1-2-2.1-4.4-2.1z"/></svg>',
  js: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="4" fill="#f7df1e"/><path fill="#000000" d="M12.5 15.5c0 1.9-1.1 2.9-2.8 2.9-1.3 0-2.1-.6-2.5-1.5l1.6-.9c.3.5.6.8 1 .8.5 0 .8-.3.8-.8v-5.4h1.9v4.9zm4.2-4.9c1.6 0 2.6.9 2.6 2.3 0 1.3-.8 2.1-2 2.4l-.6.1c-.6.2-.9.4-.9.7 0 .4.3.6.8.6.6 0 1-.3 1.3-.7l1.3 1c-.6.8-1.4 1.3-2.6 1.3-1.6 0-2.7-.9-2.7-2.3 0-1.2.7-2.1 2-2.4l.6-.1c.6-.2.8-.4.8-.7 0-.3-.3-.5-.7-.5-.5 0-.9.2-1.1.6l-1.3-1c.6-.8 1.4-1.3 2.6-1.3z"/></svg>',
  gsap: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#88ce02"/><path fill="#ffffff" d="M12 6a6 6 0 1 0 6 6h-2a4 4 0 1 1-4-4v2l4-3l-4-3v2z"/></svg>',
  python: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#387eb8" d="M11.9 2c-4.8 0-4.5 2.1-4.5 2.1l.1 2.2h4.5v.7H5.6s-3.6-.4-3.6 4.8c0 5.2 3.1 5 3.1 5h1.9v-2.6s-.1-3.1 3-3.1h5.1s2.9 0 2.9-2.9V4.9s.4-2.9-6.1-2.9zm-2.4 1.5c.5 0 .9.4.9.9s-.4.9-.9.9s-.9-.4-.9-.9s.4-.9.9-.9z"/><path fill="#ffe052" d="M12.1 22c4.8 0 4.5-2.1 4.5-2.1l-.1-2.2h-4.5v-.7h6.4s3.6.4 3.6-4.8c0-5.2-3.1-5-3.1-5h-1.9v2.6s.1 3.1-3 3.1H8.9s-2.9 0-2.9 2.9v3.2s-.4 2.9 6.1 2.9zm2.4-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9s.9.4.9.9s-.4.9-.9.9z"/></svg>',
  fastapi: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#059669"/><path fill="#ffffff" d="M12 4l-5 9h4l-2 7l7-10h-4z"/></svg>',
  django: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="4" fill="#092e20"/><path fill="#ffffff" d="M11.6 4.7h2.2v9.8c-.4.2-1 .3-1.6.3-2.1 0-3.3-1.3-3.3-3.4c0-2.2 1.4-3.6 3.1-3.6c.5 0 .9.1 1.2.2V4.7zm0 5.1c-.2-.1-.5-.1-.7-.1c-.9 0-1.6.7-1.6 1.9c0 1.1.6 1.8 1.6 1.8c.3 0 .5 0 .7-.1V9.8zM14.9 7.6h2.2v10.5h-2.2V7.6z"/></svg>',
  node: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#68a063" d="M12 2l9 5.2v10.4l-9 5.2l-9-5.2V7.2L12 2zm0 2.3L4.8 8.5v7l7.2 4.2l7.2-4.2v-7L12 4.3z"/><circle cx="12" cy="12" r="3" fill="#ffffff"/></svg>',
  supabase: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#3ecf8e" d="M21.36 15.37L12.77 23.4a.8.8 0 0 1-1.34-.67l.88-9.08H3.26a.8.8 0 0 1-.6-1.32L11.25.6a.8.8 0 0 1 1.34.67l-.88 9.08h8.05a.8.8 0 0 1 .6 1.32z"/></svg>',
  postgres: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#336791" d="M23.559 14.723a.527.527 0 0 0-.056-.119c-.14-.263-.477-.342-1.008-.232-1.653.341-2.293.131-2.525-.019 1.342-2.048 2.445-4.522 3.04-6.83.272-1.05.799-3.523.123-4.731a1.564 1.564 0 0 0-.151-.235C21.693.909 19.801.025 17.51 0c-1.495-.016-2.77.346-3.116.48a9.45 9.45 0 0 0-.516-.082 8.044 8.044 0 0 0-1.311-.128c-1.183-.018-2.204.264-3.05.84-.858-.32-4.79-1.645-7.222.08C.936 2.152.309 3.873.43 6.304c.041.818.507 3.334 1.242 5.744.46 1.506.94 2.702 1.434 3.582.553.994 1.126 1.593 1.714 1.79.447.149 1.133.144 1.858-.728.802-.964 1.59-1.826 1.945-2.207.435.236.906.363 1.39.377a.057.057 0 0 0 0 .004 11.031 11.031 0 0 0-.247.306c-.339.43-.41.52-1.5.744-.31.064-1.135.234-1.147.812a.54.54 0 0 0 .092.327c.227.423.922.61 1.015.633 1.335.333 2.505.092 3.372-.679-.017 2.231.077 4.418.345 5.088.221.553.762 1.904 2.47 1.904.25 0 .526-.029.829-.094 1.782-.382 2.556-1.17 2.855-2.906.15-.87.402-2.875.539-4.101.017-.07.036-.12.057-.136.001 0 .07-.047.427.03a.367.367 0 0 0 .045.008l.253.022.015.001c.847.038 1.912-.143 2.532-.431.643-.299 1.805-1.032 1.595-1.67zM2.371 11.876c-.744-2.435-1.178-4.885-1.212-5.571-.109-2.172.417-3.683 1.562-4.493C4.558.514 7.56 1.272 8.828 1.683a.35.35 0 0 1-.01.01c-2.023 2.043-1.975 5.535-1.97 5.749 0 .082.006.199.016.36.035.586.1 1.68-.074 2.917-.16 1.151.194 2.277.973 3.09.08.084.165.163.252.237-.347.371-1.1 1.193-1.903 2.158-.567.682-.96.551-1.088.508-.392-.13-.813-.587-1.238-1.322-.48-.84-.964-2.032-1.416-3.513zm6.007 5.088c-.171-.043-.327-.114-.432-.178.089-.039.237-.09.483-.14 1.283-.265 1.482-.451 1.914-1 .1-.127.212-.27.368-.444.025-.045.05-.09.073-.13.171-.15.273-.11.437-.041.156.064.308.26.37.475.029.101.062.294-.045.444-.905 1.266-2.222 1.25-3.168 1.013zm2.094-3.989l-.052.142c-.133.356-.257.688-.334 1.003-.667-.002-1.317-.287-1.81-.802-.628-.656-.913-1.567-.783-2.5.183-1.309.115-2.448.08-3.06-.006-.085-.01-.16-.013-.22.296-.261 1.666-.995 2.643-.772.446.103.718.406.83.928.585 2.704.078 3.83-.33 4.736-.084.187-.163.363-.23.545z"/></svg>',
  mongo: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#47a248" d="M12 1.5s-5.5 5.5-5.5 11c0 4.1 3 7.8 5.5 9.5c2.5-1.7 5.5-5.4 5.5-9.5c0-5.5-5.5-11-5.5-11zm.6 18.9v-7.9c1.6.4 2.7 1.6 2.7 3.3c0 2.1-1.3 3.9-2.7 4.6zm-1.2-16.7c.3.5 1.2 1.8 1.2 3.1v4.7c-1.4-.3-2.6-1.4-2.6-3.1c0-1.8.9-3.7 1.4-4.7z"/></svg>',
  mysql: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><path fill="#00758f" d="M117.688 98.242c-6.973-.191-12.297.461-16.852 2.379-1.293.547-3.355.559-3.566 2.18.711.746.82 1.859 1.387 2.777 1.086 1.754 2.922 4.113 4.559 5.352 1.789 1.348 3.633 2.793 5.551 3.961 3.414 2.082 7.223 3.27 10.504 5.352 1.938 1.23 3.859 2.777 5.75 4.164.934.684 1.563 1.75 2.773 2.18v-.195c-.637-.812-.801-1.93-1.387-2.777l-2.578-2.578c-2.52-3.344-5.719-6.281-9.117-8.719-2.711-1.949-8.781-4.578-9.91-7.73l-.199-.199c1.922-.219 4.172-.914 5.949-1.391 2.98-.797 5.645-.59 8.719-1.387l4.164-1.187v-.793c-1.555-1.594-2.664-3.707-4.359-5.152-4.441-3.781-9.285-7.555-14.273-10.703-2.766-1.746-6.184-2.883-9.117-4.363-.988-.496-2.719-.758-3.371-1.586-1.539-1.961-2.379-4.449-3.566-6.738-2.488-4.793-4.93-10.023-7.137-15.066-1.504-3.437-2.484-6.828-4.359-9.91-9-14.797-18.687-23.73-33.695-32.508-3.195-1.867-7.039-2.605-11.102-3.57l-6.543-.395c-1.332-.555-2.715-2.184-3.965-2.977C16.977 3.52 4.223-3.312.539 5.672-1.785 11.34 4.016 16.871 6.09 19.746c1.457 2.012 3.32 4.273 4.359 6.539.688 1.492.805 2.984 1.391 4.559 1.438 3.883 2.695 8.109 4.559 11.695.941 1.816 1.98 3.727 3.172 5.352.727.996 1.98 1.438 2.18 2.973-1.227 1.715-1.297 4.375-1.984 6.543-3.098 9.77-1.926 21.91 2.578 29.137 1.383 2.223 4.641 6.98 9.117 5.156 3.918-1.598 3.043-6.539 4.164-10.902.254-.988.098-1.715.594-2.379v.199l3.57 7.133c2.641 4.254 7.324 8.699 11.297 11.699 2.059 1.555 3.68 4.242 6.344 5.152v-.199h-.199c-.516-.805-1.324-1.137-1.98-1.781-1.551-1.523-3.277-3.414-4.559-5.156-3.613-4.902-6.805-10.27-9.711-15.855-1.391-2.668-2.598-5.609-3.77-8.324-.453-1.047-.445-2.633-1.387-3.172-1.281 1.988-3.172 3.598-4.164 5.945-1.582 3.754-1.789 8.336-2.375 13.082-.348.125-.195.039-.398.199-2.762-.668-3.73-3.508-4.758-5.949-2.594-6.164-3.078-16.09-.793-23.191.59-1.836 3.262-7.617 2.18-9.316-.516-1.691-2.219-2.672-3.172-3.965-1.18-1.598-2.355-3.703-3.172-5.551-2.125-4.805-3.113-10.203-5.352-15.062-1.07-2.324-2.875-4.676-4.359-6.738-1.645-2.289-3.484-3.977-4.758-6.742-.453-.984-1.066-2.559-.398-3.566.215-.684.516-.969 1.191-1.191 1.148-.887 4.352.297 5.547.793 3.18 1.32 5.832 2.578 8.527 4.363 1.289.855 2.598 2.512 4.16 2.973h1.785c2.789.641 5.914.195 8.523.988 4.609 1.402 8.738 3.582 12.488 5.949 11.422 7.215 20.766 17.48 27.156 29.734 1.027 1.973 1.473 3.852 2.379 5.945 1.824 4.219 4.125 8.559 5.941 12.688 1.816 4.113 3.582 8.27 6.148 11.695 1.348 1.801 6.551 2.766 8.918 3.766 1.66.699 4.379 1.43 5.949 2.379 3 1.809 5.906 3.965 8.723 5.945 1.402.992 5.73 3.168 5.945 4.957zm-88.605-75.52c-1.453-.027-2.48.156-3.566.395v.199h.195c.695 1.422 1.918 2.34 2.777 3.566l1.98 4.164.199-.195c1.227-.867 1.789-2.25 1.781-4.363-.492-.52-.562-1.164-.992-1.785-.562-.824-1.66-1.289-2.375-1.98zm0 0"/></svg>',
  linux: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="#fcc624" d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z"/></svg>',
  docker: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#2496ed" d="M13.9 8.2h2.2v2.2h-2.2zm-2.7 0h2.2v2.2h-2.2zm-2.7 0h2.2v2.2H8.5zm-2.7 0H8v2.2H5.8zm8.1-2.7h2.2v2.2h-2.2zm-2.7 0h2.2v2.2h-2.2zm-2.7 0h2.2v2.2H8.5zm5.4-2.7h2.2v2.2H14zm8.6 8.5c-.3-1.8-1.5-2.5-2.6-2.6c-.6 0-1.3.2-1.8.6c-.4-.1-1.3-.2-2.3.4c-.2.1-.5.3-.7.5h-13c-.3 1.3-.1 5.3 3.6 7.4c3.4 1.9 8.1 1.6 11.5-.7c2.6-1.8 3.5-4.1 3.7-5.6h1.6z"/></svg>',
  gcp: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#ea4335" d="M12 9.5c1.4 0 2.6.5 3.6 1.4l2.7-2.7C16.6 6.6 14.5 5.8 12 5.8c-3.7 0-6.8 2.1-8.3 5.2l3.2 2.5C7.7 11.2 9.7 9.5 12 9.5z"/><path fill="#4285f4" d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v4.1h5.5c-.2 1.3-1 2.4-2.1 3.1l3.3 2.5c1.9-1.8 3.1-4.4 3.1-7.7z"/><path fill="#fbbc05" d="M6.9 13.5c-.2-.7-.4-1.5-.4-2.2c0-.8.1-1.5.4-2.2L3.7 6.6C2.6 8.7 2 10.3 2 12c0 1.7.6 3.3 1.7 5.4l3.2-3.9z"/><path fill="#34a853" d="M12 18.2c2.4 0 4.5-.8 6-2.2l-3.3-2.5c-.8.6-1.8.9-2.7.9c-2.3 0-4.3-1.7-5.1-4l-3.2 2.5c1.5 3.1 4.6 5.3 8.3 5.3z"/></svg>',
  netlify: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#00c7b7" d="M17.4 9.6l-3.3-3.3L12 8.4l2.1 2.1l-3.6 3.6l-2.1-2.1l-2.1 2.1l4.2 4.2l7.9-7.9zm-10.8.8l2.1-2.1l-2.1-2.1l-2.1 2.1l2.1 2.1zm12.9 6.3l2.1-2.1l-2.1-2.1l-2.1 2.1l2.1 2.1z"/></svg>',
  git: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#f05032" d="M21.6 10.9L13.1 2.4a1.7 1.7 0 0 0-2.4 0L8.4 4.7l3 3a2 2 0 0 1 2.5 2.5l2.9 2.9a2 2 0 1 1-1.2 1.2l-2.8-2.8v4.2a2 2 0 1 1-1.7 0v-4.3a2 2 0 0 1-1.1-2.6l-3-3l-4.7 4.7a1.7 1.7 0 0 0 0 2.4l8.5 8.5a1.7 1.7 0 0 0 2.4 0l8.5-8.5a1.7 1.7 0 0 0 0-2.4z"/></svg>',
  clean: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#a78bfa" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#a78bfa" stroke-width="1.5"/><circle cx="12" cy="12" r="2.5" fill="#a78bfa"/></svg>',
  ddd: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#c084fc" d="M12 2L2 7l10 5l10-5l-10-5zm0 8.5L4.4 7L12 3.2L19.6 7L12 10.5zM2 17l10 5l10-5l-2.2-1.1L12 19.8l-7.8-3.9L2 17zm0-5l10 5l10-5l-2.2-1.1L12 14.8l-7.8-3.9L2 12z"/></svg>',
  scraping: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="#45ba4b" stroke-width="2"/><path fill="#45ba4b" d="M7 10l5 5l5-5H7z"/></svg>',
  datascience: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#fb923c" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H7v-5h3v5zm4 0h-3V7h3v10zm4 0h-3v-8h3v8z"/></svg>',
}

// In-memory cache for decoded icon images rendered onto Canvas2D
const iconImageCache = new Map<string, HTMLImageElement>()

function initIconCache() {
  if (typeof window === 'undefined') return
  Object.entries(techSvgIcons).forEach(([key, svg]) => {
    const img = new Image()
    img.src = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
    iconImageCache.set(key, img)
  })
}

interface Node3D {
  tech: TechItem
  phi: number // latitude
  theta: number // longitude
  // Projected screen coords
  projX: number
  projY: number
  projZ: number
  scale: number
  alpha: number
  radius: number
}

// Compute Fibonacci Sphere positions so items are evenly spaced across the 3D globe
const nodes: Node3D[] = []
const goldenRatio = (1 + Math.sqrt(5)) / 2
const totalNodes = techList.length

techList.forEach((tech, i) => {
  // y goes from 1 to -1
  const y = 1 - (i / (totalNodes - 1)) * 2
  const phi = Math.acos(y) // latitude angle [0, PI]
  const theta = (2 * Math.PI * i) / goldenRatio // golden angle increment [0, 2PI]

  nodes.push({
    tech,
    phi,
    theta,
    projX: 0,
    projY: 0,
    projZ: 0,
    scale: 1,
    alpha: 1,
    radius: 0,
  })
})

// Wireframe cached structure (10 latitude rings, 14 longitude meridians)
interface WireframeLine {
  points: { phi: number; theta: number }[]
}
const wireframeLines: WireframeLine[] = []

// Latitude rings
const latRings = 8
for (let r = 1; r < latRings; r++) {
  const phi = (Math.PI * r) / latRings
  const pts = []
  const segments = 32
  for (let s = 0; s <= segments; s++) {
    const theta = (2 * Math.PI * s) / segments
    pts.push({ phi, theta })
  }
  wireframeLines.push({ points: pts })
}

// Longitude meridians
const meridians = 12
for (let m = 0; m < meridians; m++) {
  const theta = (2 * Math.PI * m) / meridians
  const pts = []
  const segments = 24
  for (let s = 0; s <= segments; s++) {
    const phi = (Math.PI * s) / segments
    pts.push({ phi, theta })
  }
  wireframeLines.push({ points: pts })
}

// 3D Rotation State
let rotX = 0.25
let rotY = 0
let velX = 0
let velY = 0.003
let isDragging = false
let lastMouseX = 0
let lastMouseY = 0
let dragStartX = 0
let dragStartY = 0
let animId: number | null = null
let cssWidth = 0
let cssHeight = 0

function rotatePoint(
  phi: number,
  theta: number,
  r: number,
  rx: number,
  ry: number
): { x: number; y: number; z: number } {
  // Spherical to Cartesian
  let x = r * Math.sin(phi) * Math.sin(theta)
  let y = r * Math.cos(phi)
  let z = r * Math.sin(phi) * Math.cos(theta)

  // Rotate around Y axis (rotY)
  const cosY = Math.cos(ry)
  const sinY = Math.sin(ry)
  const x1 = x * cosY + z * sinY
  const z1 = -x * sinY + z * cosY

  // Rotate around X axis (rotX)
  const cosX = Math.cos(rx)
  const sinX = Math.sin(rx)
  const y2 = y * cosX - z1 * sinX
  const z2 = y * sinX + z1 * cosX

  return { x: x1, y: y2, z: z2 }
}

function drawBadgeIcon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  label: string,
  iconType: string,
  isHovered: boolean,
  isDimmed: boolean,
  alpha: number,
  isMobile: boolean
) {
  const fontBase = isMobile ? 9.5 : 11
  const heightBase = isMobile ? 22 : 28
  const padBase = isMobile ? 24 : 32
  const charWidth = isMobile ? 5.8 : 7.2

  const badgeWidth = Math.max(isMobile ? 62 : 82, label.length * charWidth + padBase) * (size / 24)
  const badgeHeight = heightBase * (size / 24)
  const radius = (isMobile ? 5 : 6) * (size / 24)

  ctx.save()
  // On mobile, fade back nodes more so foreground badges are crisp and legible
  const minAlpha = isMobile ? 0.08 : 0.14
  ctx.globalAlpha = Math.min(1, Math.max(minAlpha, alpha * (isDimmed ? 0.22 : 1)))

  // Outer glow if hovered or bright front
  if (isHovered) {
    ctx.shadowColor = color
    ctx.shadowBlur = isMobile ? 12 : 18
  } else if (!isDimmed && alpha > 0.72) {
    ctx.shadowColor = color
    ctx.shadowBlur = isMobile ? 5 : 8
  } else {
    ctx.shadowBlur = 0
  }

  // Capsule background
  ctx.beginPath()
  const bx = x - badgeWidth / 2
  const by = y - badgeHeight / 2
  ctx.roundRect(bx, by, badgeWidth, badgeHeight, radius)

  if (isHovered) {
    ctx.fillStyle = 'rgba(10, 20, 35, 0.95)'
    ctx.strokeStyle = color
    ctx.lineWidth = isMobile ? 1.5 : 2
  } else {
    ctx.fillStyle = 'rgba(7, 13, 24, 0.85)'
    ctx.strokeStyle = isDimmed ? 'rgba(255,255,255,0.06)' : `color-mix(in srgb, ${color} 40%, rgba(255,255,255,0.12))`
    ctx.lineWidth = 1
  }

  ctx.fill()
  ctx.stroke()

  // Draw Tech SVG Icon instead of single dot
  const iconImg = iconImageCache.get(iconType)
  const iconSize = (isMobile ? 12 : 15) * (size / 24)
  const iconX = bx + (isMobile ? 6 : 8) * (size / 24)
  const iconY = y - iconSize / 2

  if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
    ctx.drawImage(iconImg, iconX, iconY, iconSize, iconSize)
  } else {
    // Fallback to crisp circular dot if image hasn't loaded
    const dotRadius = (isMobile ? 3.5 : 4.5) * (size / 24)
    ctx.beginPath()
    ctx.arc(iconX + iconSize / 2, y, dotRadius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
  }

  // Text label
  const textX = iconX + iconSize + (isMobile ? 5 : 7) * (size / 24)
  ctx.font = `600 ${Math.round(fontBase * (size / 24))}px 'DM Mono', monospace`
  ctx.fillStyle = isHovered ? '#ffffff' : (isDimmed ? '#64748b' : '#e2e8f0')
  ctx.textAlign = 'left'
  ctx.textBaseline = 'middle'
  ctx.fillText(label, textX, y)

  ctx.restore()
}

let isVisibleOnScreen = true
let observer: IntersectionObserver | null = null
let cachedGlowGrad: CanvasGradient | null = null

function render() {
  if (!isVisibleOnScreen) {
    animId = null
    return
  }

  const canvas = canvasRef.value
  if (!canvas || cssWidth === 0 || cssHeight === 0) {
    animId = requestAnimationFrame(render)
    return
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    animId = requestAnimationFrame(render)
    return
  }

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const isMobile = cssWidth < 640

  // High-DPI transform & clear
  ctx.save()
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssWidth, cssHeight)

  const cx = cssWidth / 2
  const cy = cssHeight / 2
  const globeRadius = Math.min(cssWidth, cssHeight) * (isMobile ? 0.30 : 0.36)

  // Update rotation
  if (isAutoRotating.value && !isDragging) {
    rotY += velY
    velX *= 0.94
    rotX += velX
  } else if (!isAutoRotating.value && !isDragging) {
    velX *= 0.92
    velY *= 0.92
    rotX += velX
    rotY += velY
  }

  // Constrain vertical tilt to prevent gimbal lock
  rotX = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, rotX))

  // 1. Globe Ambient Aura / Outer Rim Glow (cached gradient)
  if (!cachedGlowGrad) {
    cachedGlowGrad = ctx.createRadialGradient(cx, cy, globeRadius * 0.7, cx, cy, globeRadius * 1.15)
    cachedGlowGrad.addColorStop(0, 'rgba(0, 217, 255, 0.05)')
    cachedGlowGrad.addColorStop(0.5, 'rgba(167, 139, 250, 0.03)')
    cachedGlowGrad.addColorStop(1, 'transparent')
  }
  ctx.fillStyle = cachedGlowGrad
  ctx.beginPath()
  ctx.arc(cx, cy, globeRadius * 1.15, 0, Math.PI * 2)
  ctx.fill()

  // 2. Globe Wireframe (batched into a single draw call)
  ctx.save()
  ctx.strokeStyle = 'rgba(0, 217, 255, 0.08)'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  for (let l = 0; l < wireframeLines.length; l++) {
    const line = wireframeLines[l]
    for (let i = 0; i < line.points.length; i++) {
      const pt = line.points[i]
      const { x, y } = rotatePoint(pt.phi, pt.theta, globeRadius, rotX, rotY)
      const sx = cx + x
      const sy = cy + y
      if (i === 0) {
        ctx.moveTo(sx, sy)
      } else {
        ctx.lineTo(sx, sy)
      }
    }
  }
  ctx.stroke()
  ctx.restore()

  // 3. Project 3D nodes
  const sortedNodes: Node3D[] = []
  for (let n = 0; n < nodes.length; n++) {
    const node = nodes[n]
    const { x, y, z } = rotatePoint(node.phi, node.theta, globeRadius * 1.05, rotX, rotY)
    node.projX = cx + x
    node.projY = cy + y
    node.projZ = z

    // Perspective depth ratio: z in [-globeRadius, globeRadius]
    const zNorm = z / globeRadius // -1 to 1
    node.scale = (isMobile ? 0.60 : 0.65) + (zNorm + 1) * (isMobile ? 0.30 : 0.35)
    node.alpha = (isMobile ? 0.15 : 0.2) + (zNorm + 1) * 0.4
    node.radius = (isMobile ? 20 : 24) * node.scale

    sortedNodes.push(node)
  }

  // Painter's algorithm: sort back to front (smallest z to largest z)
  sortedNodes.sort((a, b) => a.projZ - b.projZ)

  // 4. Draw Connecting constellations (batched into single draw call with squared distance)
  ctx.save()
  const maxConnDist = isMobile ? 85 : 130
  const maxConnDistSq = maxConnDist * maxConnDist
  ctx.strokeStyle = 'rgba(0, 217, 255, 0.12)'
  ctx.lineWidth = isMobile ? 0.7 : 1
  ctx.beginPath()
  for (let i = 0; i < sortedNodes.length; i++) {
    const n1 = sortedNodes[i]
    if (n1.projZ < 0) continue

    for (let j = i + 1; j < sortedNodes.length; j++) {
      const n2 = sortedNodes[j]
      if (n2.projZ < 0) continue

      const dx = n1.projX - n2.projX
      const dy = n1.projY - n2.projY
      if (dx * dx + dy * dy < maxConnDistSq) {
        ctx.moveTo(n1.projX, n1.projY)
        ctx.lineTo(n2.projX, n2.projY)
      }
    }
  }
  ctx.stroke()
  ctx.restore()

  // 5. Draw Badges
  sortedNodes.forEach((node) => {
    const isHovered = hoveredTech.value?.id === node.tech.id
    const isDimmed =
      props.selectedCategory !== 'all' &&
      node.tech.category !== props.selectedCategory

    drawBadgeIcon(
      ctx,
      node.projX,
      node.projY,
      node.radius,
      node.tech.color,
      node.tech.name,
      node.tech.iconType,
      isHovered,
      isDimmed,
      node.alpha,
      isMobile
    )
  })

  ctx.restore()
  animId = requestAnimationFrame(render)
}

function handleResize() {
  const canvas = canvasRef.value
  const container = containerRef.value
  if (!canvas || !container) return

  const rect = container.getBoundingClientRect()
  cssWidth = rect.width
  cssHeight = rect.height
  cachedGlowGrad = null
  const dpr = Math.min(window.devicePixelRatio || 1, 2)

  canvas.width = Math.round(cssWidth * dpr)
  canvas.height = Math.round(cssHeight * dpr)
  canvas.style.width = `${cssWidth}px`
  canvas.style.height = `${cssHeight}px`
}

function getPointerPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
  const canvas = canvasRef.value
  if (!canvas) return { x: 0, y: 0 }
  const rect = canvas.getBoundingClientRect()
  if ('touches' in e && e.touches.length > 0) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    }
  } else if ('clientX' in e) {
    return {
      x: (e as MouseEvent).clientX - rect.left,
      y: (e as MouseEvent).clientY - rect.top,
    }
  }
  return { x: 0, y: 0 }
}

function findNodeAtPos(x: number, y: number): TechItem | null {
  const isMobile = cssWidth < 640
  const charWidth = isMobile ? 5.8 : 7.2
  const padBase = isMobile ? 24 : 32
  const heightBase = isMobile ? 22 : 28

  let found: TechItem | null = null
  const frontNodes = [...nodes].filter((n) => n.projZ > -10).sort((a, b) => b.projZ - a.projZ)

  for (const node of frontNodes) {
    const badgeW = Math.max(isMobile ? 62 : 82, node.tech.name.length * charWidth + padBase) * (node.radius / 24)
    const badgeH = heightBase * (node.radius / 24)

    const hitBuffer = isMobile ? 8 : 4
    if (
      x >= node.projX - badgeW / 2 - hitBuffer &&
      x <= node.projX + badgeW / 2 + hitBuffer &&
      y >= node.projY - badgeH / 2 - hitBuffer &&
      y <= node.projY + badgeH / 2 + hitBuffer
    ) {
      found = node.tech
      break
    }
  }

  hoveredTech.value = found
  emit('selectTech', found)
  return found
}

function checkHover(e: MouseEvent) {
  if (isDragging) return
  const { x, y } = getPointerPos(e)
  const found = findNodeAtPos(x, y)

  if (canvasRef.value) {
    canvasRef.value.style.cursor = found ? 'pointer' : (isDragging ? 'grabbing' : 'grab')
  }
}

function onMouseDown(e: MouseEvent) {
  isDragging = true
  const pos = getPointerPos(e)
  lastMouseX = pos.x
  lastMouseY = pos.y
  dragStartX = pos.x
  dragStartY = pos.y
  velX = 0
  velY = 0

  if (canvasRef.value) {
    canvasRef.value.style.cursor = 'grabbing'
  }
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging) {
    checkHover(e)
    return
  }

  const pos = getPointerPos(e)
  const deltaX = pos.x - lastMouseX
  const deltaY = pos.y - lastMouseY

  const sensitivity = cssWidth < 640 ? 0.004 : 0.005
  velY = deltaX * sensitivity
  velX = -deltaY * sensitivity

  rotY += velY
  rotX += velX

  lastMouseX = pos.x
  lastMouseY = pos.y
}

function onMouseUp(e: MouseEvent) {
  if (isDragging) {
    isDragging = false
    const pos = getPointerPos(e)
    const dist = Math.hypot(pos.x - dragStartX, pos.y - dragStartY)
    if (dist < 5 && hoveredTech.value) {
      emit('selectTech', hoveredTech.value)
    }
  }
  if (canvasRef.value) {
    canvasRef.value.style.cursor = hoveredTech.value ? 'pointer' : 'grab'
  }
}

// Touch support
function onTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    isDragging = true
    const pos = getPointerPos(e)
    lastMouseX = pos.x
    lastMouseY = pos.y
    dragStartX = pos.x
    dragStartY = pos.y
    velX = 0
    velY = 0
  }
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging || e.touches.length !== 1) return
  const pos = getPointerPos(e)
  const deltaX = pos.x - lastMouseX
  const deltaY = pos.y - lastMouseY

  // If horizontal drag is dominant, prevent browser scrolling so user can spin globe smoothly
  if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 4) {
    if (e.cancelable) e.preventDefault()
  }

  const sensitivity = cssWidth < 640 ? 0.004 : 0.005
  velY = deltaX * sensitivity
  velX = -deltaY * sensitivity

  rotY += velY
  rotX += velX

  lastMouseX = pos.x
  lastMouseY = pos.y
}

function onTouchEnd() {
  if (isDragging) {
    isDragging = false
    const dist = Math.hypot(lastMouseX - dragStartX, lastMouseY - dragStartY)
    // If was a quick tap (< 12px movement), select the tapped node on mobile!
    if (dist < 12) {
      findNodeAtPos(lastMouseX, lastMouseY)
    }
  }
}

function resetOrientation() {
  rotX = 0.25
  rotY = 0
  velX = 0
  velY = 0.003
  isAutoRotating.value = true
}

function toggleAutoRotate() {
  isAutoRotating.value = !isAutoRotating.value
  if (isAutoRotating.value && Math.abs(velY) < 0.001) {
    velY = 0.003
  }
}

onMounted(() => {
  initIconCache()
  handleResize()
  window.addEventListener('resize', handleResize)

  if (containerRef.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisibleOnScreen
        isVisibleOnScreen = entry.isIntersecting
        if (isVisibleOnScreen && !wasVisible && !animId) {
          render()
        }
      },
      { rootMargin: '120px' }
    )
    observer.observe(containerRef.value)
  }

  render()
})

onBeforeUnmount(() => {
  if (animId) cancelAnimationFrame(animId)
  if (observer) observer.disconnect()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    ref="containerRef"
    class="relative w-full h-[440px] sm:h-[520px] md:h-[620px] select-none flex items-center justify-center overflow-hidden touch-pan-y"
  >
    <!-- Background cyber grid glow ring -->
    <div
      class="absolute w-[320px] h-[320px] sm:w-[440px] sm:h-[440px] md:w-[540px] md:h-[540px] rounded-full pointer-events-none opacity-40 blur-2xl"
      style="background: radial-gradient(circle, rgba(0, 217, 255, 0.15) 0%, rgba(167, 139, 250, 0.08) 50%, transparent 70%);"
    />

    <!-- Canvas -->
    <canvas
      ref="canvasRef"
      class="block cursor-grab active:cursor-grabbing z-10"
      @mousedown="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    />

    <!-- HUD Overlay Controls & Info -->
    <div class="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 flex items-center gap-2 pointer-events-auto">
      <div class="flex items-center gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-[#070d18]/80 backdrop-blur-md border border-cyan-500/20 text-[11px] sm:text-xs font-mono text-cyan-400">
        <span>{{ t('skills.globe.interactive') }}</span>
      </div>
    </div>

    <!-- Active Hover / Tap Spotlight Card -->
    <div
      v-if="hoveredTech"
      class="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-none transition-all duration-300 max-w-[calc(100%-110px)] sm:max-w-none"
    >
      <div class="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#090f1d]/90 backdrop-blur-xl border border-cyan-500/30 shadow-[0_0_24px_rgba(0,217,255,0.2)]">
        <span
          class="w-4 h-4 flex items-center justify-center shrink-0 [&>svg]:w-full [&>svg]:h-full"
          v-html="techSvgIcons[hoveredTech.iconType] || ''"
        />
        <div class="min-w-0">
          <div class="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider truncate">
            {{ hoveredTech.name }}
          </div>
          <div class="text-[10px] font-mono text-slate-400 uppercase truncate">
            {{ t('skills.categories.' + (hoveredTech.category === 'architecture' ? 'tools' : hoveredTech.category)) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Floating HUD Action Controls -->
    <div class="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-20 flex items-center gap-1.5 sm:gap-2 pointer-events-auto">
      <button
        @click="toggleAutoRotate"
        class="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono transition-all duration-200 bg-[#070d18]/80 backdrop-blur-md border border-slate-700/60 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400"
        :title="isAutoRotating ? t('skills.globe.pause') : t('skills.globe.rotate')"
      >
        <svg v-if="isAutoRotating" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
        </svg>
        <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        </svg>
        <span class="hidden xs:inline sm:inline">{{ isAutoRotating ? t('skills.globe.pause') : t('skills.globe.rotate') }}</span>
      </button>

      <button
        @click="resetOrientation"
        class="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-mono transition-all duration-200 bg-[#070d18]/80 backdrop-blur-md border border-slate-700/60 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400"
        :title="t('skills.globe.reset')"
      >
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        <span class="hidden xs:inline sm:inline">{{ t('skills.globe.reset') }}</span>
      </button>
    </div>
  </div>
</template>
