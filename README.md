# Mesa de ayuda + Gestión documental



## Instalación del proyecto

### Pre requisitos

```
Node.
Java 17 o superior.
```

### Ejecutar el proyecto

- Generar un nuevo JWT secret e introducirlo en application.propierties => ("\Proyecto\backend\src\main\resources\application.properties")
- El JWT secret es vital para encriptar los JWT que se generan, asignan y comprueban.
- Correr el backend utilizando java 17 o superior. 
- Abrir /proyecto/frontend y ejecutar el comando npm install para instalar las dependencias.
- Crear los roles en base de datos 
- ROLE_ADMIN ROLE_USER ROLE_AGENTE ROLE_SUPERVISOR
- Crear los permisos en bd CREAR_TICKET y EDITAR_TICKET
- Crear la fuente en bd Web
- Crear estados en la bd EN-PROCESO y COMPLETADOS 


### Dockerizar el proyecto
_Es necesario principalmente limpiar el proyecto y generar su respectivo jar para poder crear una imagen._
_Los archivos docker para facilitar la creación de la imagen ya existen. Solo se deberán ejecutar las_
_siguientes instrucciones._
- maven clean
- maven install


## Autores ✒️

_La elaboracion de este proyecto fue posible gracias al apoyo de_

* **Kevin Lerma** - *Desarrollo del módulo de Mesa de ayuda y lógica del backend* - [Nemezen](https://github.com/nemezen)
* **Alfredo Alvarado** - *Desarrollo del módulo Gestión documental* - [Fredy16177](https://github.com/fredy16177)

## Agradecimientos 🎁

* Agradezco profundamente al equipo de sistemas en Serdi por permitir hacer esto posible📢 

---