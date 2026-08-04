import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

import { createI18n } from "vue-i18n";
import Particles from "@tsparticles/vue3";
import { loadSlim } from "@tsparticles/slim";

const messages = {
  es: {
    nav: {
      home: "Inicio",
      about: "Sobre Mí",
      education: "Educación",
      skills: "Habilidades",
      experience: "Experiencia",
      projects: "Proyectos",
      certificates: "Certificados",
      contact: "Contacto",
    },
    buttons: {
      contact: "Contacto",
    },
    hero: {
      subtitle: "Ingeniero Informático",
      name: "Vicente Vasquez",
      portfolio: "- Portafolio",
      description:
        "Una muestra de mis proyectos, habilidades y logros en el campo de la ingeniería y el desarrollo de software.",
      viewProjects: "Ver Proyectos",
      downloadCV: "Descargar CV",
    },
    about: {
      title: "Sobre Mí",
      subtitle:
        "Un ingeniero apasionado, dedicado a resolver problemas complejos a través de soluciones de software eficientes.",
      role: "Ingeniero Informático",
      description:
        "Soy un ingeniero informático recién egresado con una fuerte pasión por el desarrollo web y la arquitectura de sistemas. Mi trayectoria combina una sólida base en Python con el ecosistema de Vue.js, aplicando principios de ingeniería para construir plataformas escalables como e-commerces y herramientas modernas.",
      stats: {
        education: { label: "Educación", value: "Ingeniería Informática" },
        experience: { label: "Experiencia", value: "Desarrollo Full-Stack" },
        projects: { label: "Proyectos", value: "Lanas Curauma & más" },
        stack: { label: "Stack Principal", value: "Python, Vue, Supabase" },
      },
      button: "Saber Más",
    },
  },
  en: {
    nav: {
      home: "Home",
      about: "About Me",
      education: "Education",
      skills: "Skills",
      experience: "Experience",
      projects: "Projects",
      certificates: "Certificates",
      contact: "Contact",
    },
    buttons: {
      contact: "Contact Me",
    },
    hero: {
      subtitle: "Computer Science Engineering",
      name: "Vicente Vasquez's",
      portfolio: "Portfolio",
      description:
        "A showcase of my projects, skills, and achievements in the field of engineering and software development.",
      viewProjects: "View Projects",
      downloadCV: "Download CV",
    },
    about: {
      title: "About Me",
      subtitle:
        "A passionate engineer dedicated to solving complex problems through efficient software solutions.",
      role: "Software Engineer",
      description:
        "I am a recently graduated Computer Engineer with a strong passion for web development and system architecture. My journey combines a solid foundation in Python with the Vue.js ecosystem, applying engineering principles to build scalable platforms like e-commerces and modern tools.",
      stats: {
        education: { label: "Education", value: "B.S. Computer Engineering" },
        experience: { label: "Experience", value: "Full-Stack Development" },
        projects: { label: "Projects", value: "Lanas Curauma & more" },
        stack: { label: "Core Stack", value: "Python, Vue, Supabase" },
      },
      button: "Learn More",
    },
  },
};

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages,
});

const app = createApp(App);

app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine);
  },
});

app.use(i18n);
app.mount("#app");
