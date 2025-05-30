# Etapa 1: Construir la aplicación (Builder)
# Usamos una imagen oficial de Maven con Eclipse Temurin 17 y Alpine Linux.
# Alpine es ligera, lo que ayuda a mantener la imagen de construcción más pequeña.
FROM maven:3.8.6-eclipse-temurin-17-alpine AS builder

# Establecer etiquetas para metadatos de la imagen (opcional pero recomendado)
LABEL description="Dockerfile para construir y ejecutar la aplicación Java."

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar primero el pom.xml y el wrapper de Maven (.mvn y mvnw).
# Esto es crucial para aprovechar el caché de capas de Docker. Si estos archivos no cambian,
# Docker reutilizará la capa de dependencias descargadas, acelerando las compilaciones.
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Opcional: Descargar todas las dependencias.
# Si tus dependencias cambian con menos frecuencia que tu código fuente,
# esto puede mejorar aún más los tiempos de construcción al cachear las dependencias.
# RUN ./mvnw dependency:go-offline -B

# Copiar el resto del código fuente de la aplicación
COPY src ./src

# Construir la aplicación.
# Usamos -DskipTests para omitir las pruebas durante la construcción de la imagen Docker.
# El original tenía -DskipTest (singular), lo correcto es -DskipTests (plural).
# El modificador -B ejecuta Maven en modo batch (no interactivo), lo cual es bueno para CI/CD.
RUN ./mvnw clean package -B -DskipTests

# Etapa 2: Crear la imagen de ejecución (Runtime)
# Usamos una imagen JRE (Java Runtime Environment) ligera basada en Alpine.
# Solo necesitamos el JRE para ejecutar la aplicación, no el JDK completo que se usó para compilar.
# Esto reduce significativamente el tamaño de la imagen final.
FROM eclipse-temurin:17-jre-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar el artefacto JAR construido desde la etapa 'builder'.
# El JAR generado por Spring Boot (si es el caso) usualmente se encuentra en target/nombre-del-artefacto-version.jar.
# Usamos un comodín *.jar para copiar el JAR principal y lo renombramos a app.jar para simplificar.
# Asegúrate de que esto coincida con el JAR que genera tu proyecto.
COPY --from=builder /app/target/*.jar app.jar

# Exponer el puerto en el que se ejecuta la aplicación.
# El puerto por defecto para aplicaciones Spring Boot es 8080.
# Cámbialo si tu aplicación usa un puerto diferente.
EXPOSE 8080

# Comando para ejecutar la aplicación cuando el contenedor se inicie.
# Esto asume que tu JAR es ejecutable (lo cual es común con Spring Boot y `spring-boot-maven-plugin`).
ENTRYPOINT ["java", "-jar", "app.jar"]

# Opcional: Añadir un HEALTHCHECK para que Docker pueda verificar el estado de la aplicación.
# Esto es útil para orquestadores como Kubernetes o Docker Swarm.
# Descomenta y ajusta la URL si tienes un endpoint de health check (ej. Spring Boot Actuator).
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD curl -f http://localhost:8080/actuator/health || exit 1