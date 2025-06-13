# Mesa de ayuda + Gestión documental



## Instalación del proyecto

### Pre requisitos

```
Node.
Java 17 o superior.
Docker (opcional).
Maven.
```

### Ejecutar el proyecto

- Generar un nuevo JWT secret e introducirlo en application.propierties => ("\Proyecto\backend\src\main\resources\application.properties")
- El JWT secret es vital para encriptar los JWT que se generan, asignan y comprueban.
- Correr el backend utilizando java 17 o superior. 
- Abrir /proyecto/frontend y ejecutar el comando para instalar las dependencias.
```
npm install
```
- Crear los roles en base de datos: 
```
ROLE_ADMIN 
ROLE_USER ROLE_AGENTE 
ROLE_SUPERVISOR
```
- Crear los permisos en base de datos
```
CREAR_TICKET
EDITAR_TICKET
```
- Crear la fuente en base de datos
```
Web
```
- Crear estados en la bd  y 
```
EN-PROCESO
COMPLETADOS
```


### Dockerizar el proyecto
_Es necesario principalmente limpiar el proyecto y generar su respectivo jar para poder crear una imagen. Los archivos docker para facilitar la creación de la imagen ya existen. Solo se deberán ejecutar las siguientes instrucciones_
- maven clean
- maven install
Se ejecuta este comando en terminal:
```
docker-compose up -d
```
Finalmente el backend estará creado como una imagen dockerizada y contará con volumen donde se almacenan imagenes y documentos únicamente. 

### Notas
_Aún se deben cambiar ciertos parámetros para que la conexión pueda hacerse en un entorno de producción._
Clases/componentes que se deben modificar:
```
backend/src/main/java/com/webserdi/backend/config/SecurityConfig.java
backend/src/main/java/com/webserdi/backend/config/WebSocketConfig.java
frontend/.env
```
Todos estos archivos deberán contar con su respectiva conexión a frontend o backend (quitar localhost y agregar dirección final).



## Autores ✒️

_La elaboracion de este proyecto fue posible gracias al apoyo de_

* **Kevin Lerma** - *Desarrollo del módulo de Mesa de ayuda y lógica del backend* - [Nemezen](https://github.com/nemezen)
* **Alfredo Alvarado** - *Desarrollo del módulo Gestión documental* - [Fredy16177](https://github.com/fredy16177)

## Agradecimientos 🎁

* Agradezco profundamente al equipo de sistemas en Serdi por permitir hacer esto posible!📢 

---