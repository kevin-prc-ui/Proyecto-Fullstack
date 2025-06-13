# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Development Setup

This project requires pnpm for dependency management. Please ensure you have pnpm installed before running any commands.

### Installation

1. Instalar node.
2. Instalar jdk.
3. Generar un nuevo JWT secret e introducirlo en application.propierties => ("\Proyecto\backend\src\main\resources\application.properties")
 - El JWT secret es vital para encriptar los JWT que se generan, asignan y comprueban.
4. Correr el backend utilizando java 17 o superior. 
5. Abrir /proyecto/frontend y ejecutar el comando npm install para instalar las dependencias.
6. Crear los roles en base de datos 
 - ROLE_ADMIN ROLE_USER ROLE_AGENTE ROLE_SUPERVISOR
7. Crear los permisos en bd CREAR_TICKET EDITAR_TICKET
8. Crear la fuente en bd Web
9. Crear 