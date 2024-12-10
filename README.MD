Memoria de la Versión 1 del Diario de Sueño Inteligente.


1. Introducción y Propósito

El Diario de Sueño Inteligente es una aplicación web diseñada para ayudar a las personas a registrar y mejorar sus hábitos de sueño. La aplicación permite a los usuarios:

- Registrar información sobre su sueño diariamente
- Ver un resumen de sus patrones de sueño
- Recibir consejos personalizados para mejorar la calidad de su sueño
- Disfrutar de recomendaciones en función de la hora del día para integrar en su rutina 
- Interactuar con un chat en tiempo real

La idea es conseguir tener un diario personal, un analista de datos y un experto en sueño, todo en uno. Ayudar a los usuarios a entender y mejorar sus hábitos de sueño de una manera fácil y accesible, sin necesidad de conocimientos técnicos. Con el tiempo, la aplicación aprende más sobre los patrones de sueño del usuario y puede ofrecer consejos cada vez más personalizados y útiles.


2. Estructura de la Aplicación

La aplicación se divide en dos partes principales:

2.1 Parte Frontal (Frontend): Es lo que el usuario ve y con lo que interactúa. Incluye:

- Páginas web con formularios para ingresar datos de acceso y registrarse
- Secciones para consejos y estadísticas
- Un chat para interactuar con un asistente virtual

2.2 Parte Trasera (Backend): Es la "cocina" de la aplicación, donde se procesa toda la información. Incluye:

- Un servidor que maneja las solicitudes de los usuarios
- Una base de datos para almacenar la información de los usuarios y sus registros de sueño que por ahora está integrada en el código con map().

Esta es la estructura principal completa. Para entender mejor la aplicación se realiza una analogía con una casa:

├── package.json (Lista de "ingredientes" necesarios para la aplicación)
├── public (El "salón" de la casa, donde los visitantes pasan el tiempo)
│   ├── css
│   │   └── styles.css (El "decorador" que hace que todo se vea bonito)
│   ├── index.html (La "puerta principal" de tu aplicación)
│   ├── js (Los "muebles" del salón, cada uno con una función específica)
│   │   ├── app.js (El "sofá principal" donde todo se junta)
│   │   ├── chat.js (El "teléfono" para hablar con el asistente virtual)
│   │   ├── login.js (El "portero" que verifica quién entra)
│   │   ├── sleepDiary.js (El "diario" donde se guardan los registros de sueño)
│   │   └── ui.js (El "diseñador de interiores" que organiza cómo se ve todo)
│   └── login.html (La "puerta trasera" para entrar si ya tienes una cuenta)
└── src (La "cocina" y "oficina" donde se hace todo el trabajo tras bambalinas)
├── middleware
│   └── auth.js (El "guardia de seguridad" que verifica los permisos)
├── routes (Los "pasillos" que conectan diferentes partes de la aplicación)
│   ├── data.js (El "archivador" para manejar datos de sueño)
│   ├── login.js (El "registro de entrada" para manejar inicios de sesión)
│   └── users.js (La "lista de invitados" para manejar usuarios)
└── server.js (El "mayordomo" que coordina todo en la casa)


3. Componentes Principales

3.1 Registro de Usuario e Inicio de Sesión

Cuando un nuevo usuario quiere usar la aplicación, primero debe crear una cuenta:

- El usuario proporciona un nombre de usuario y una contraseña
- La aplicación guarda esta información de forma segura
- Los usuarios utilizan estas credenciales para acceder a la aplicación

3.2 Formulario de Registro de Sueño

Esta es la parte central de la aplicación. Cada día, el usuario puede ingresar información sobre su sueño:

- Hora a la que se acostó
- Horas que durmió
- Calidad del sueño (en una escala del 1 al 5)

3.3 Visualización de Datos

La aplicación toma toda la información que el usuario ha ingresado y la presenta de forma fácil de entender:

- Muestra una tabla con el registro del sueño
- Calcula promedios
- Destaca patrones (como si el usuario duerme menos los fines de semana)
- Proporciona consejos personalizados en función a los datos introducidos

3.4 Sistema de Chat

Incluye un "asistente virtual" con el que el usuario puede chatear:

- El usuario puede hacer preguntas sobre su sueño
- El asistente puede dar consejos basados en la información registrada
- Es un chat muy básico con las respuestas integradas en el código


4. Cómo Funciona la Aplicación de forma muy simple

Para entender cómo funciona la aplicación, imaginemos que es como un restaurante:

- El Frontend es como el comedor del restaurante, donde los clientes (usuarios) se sientan y hacen sus pedidos (ingresan datos o hacen preguntas).
- El Backend es como la cocina, donde se preparan los platos (se procesa la información).
- La base de datos es como la despensa del restaurante, donde se guardan todos los ingredientes (datos de los usuarios).

Cuando un usuario usa la aplicación:

    1. Entra al "restaurante" (inicia sesión en la aplicación).
    2. Hace un "pedido" (ingresa información sobre su sueño o hace una pregunta).
    3. El "camarero" (la parte frontal de la aplicación) toma el pedido y lo lleva a la "cocina" (el servidor).
    4. En la "cocina", los "chefs" (programas en el servidor) preparan la "comida" (procesan la información).
    5. Si necesitan ingredientes, los buscan en la "despensa" (base de datos).
    6. Una vez lista la "comida" (información procesada), el "camarero" la lleva de vuelta al "cliente" (se muestra en la pantalla del usuario).

Veamos cómo María utiliza la aplicación:

Día 1:
- María crea una cuenta.
- Registra que se acostó a las 23:00 y se despertó a las 7:00.
- Califica su calidad de sueño como 3 de 5.
- Añade una nota: "Me desperté una vez durante la noche".

Día 7:
- María revisa su resumen semanal.
- Ve que ha dormido un promedio de 7.5 horas por noche.
- El asistente virtual le sugiere acostarse 30 minutos antes.

Día 30:
- María nota que su calidad de sueño ha mejorado.
- Ahora duerme un promedio de 8 horas por noche.
- Su calificación promedio de calidad de sueño ha subido a 4.
- El asistente la felicita y le sugiere mantener su rutina.

Este diagrama explica el funcionamiento general de la aplicación a nivel conceptual.

mermaid type=diagram"
graph TD
    A[Usuario] -->|Accede| B(Interfaz de Usuario)
    B -->|Registra sueño| C{Frontend}
    B -->|Consulta estadísticas| C
    B -->|Chatea con asistente| C
    C -->|Envía datos| D[Backend]
    D -->|Verifica autenticación| E[Middleware de Auth]
    E -->|Usuario autenticado| F{API Routes}
    F -->|Guarda datos| G[(Base de Datos)]
    F -->|Recupera datos| G
    G -->|Devuelve datos| F
    F -->|Procesa datos| D
    D -->|Envía respuesta| C
    C -->|Muestra resultados| B
    H[Asistente Virtual] -->|Genera respuestas| D


6. Aspectos técnicos

6.1 Estructura del Proyecto

Representado en un diagrama: 

mermaid type="diagram"
graph TD
    A[package.json] --> B[public]
    A --> C[src]
    B --> D[css/styles.css]
    B --> E[index.html]
    B --> F[js]
    B --> G[login.html]
    F --> H[app.js]
    F --> I[chat.js]
    F --> J[login.js]
    F --> K[sleepDiary.js]
    F --> L[ui.js]
    C --> M[middleware/auth.js]
    C --> N[routes]
    C --> O[server.js]
    N --> P[data.js]
    N --> Q[login.js]
    N --> R[users.js]


6.2 Organización y Flujo de Trabajo

La aplicación está organizada en dos partes principales:

6.2.1 Frontend:

- Contenido en la carpeta "public"
- HTML (estructura), CSS (estilo), JS (funcionalidad)

6.2.2 Backend:

- Contenido en la carpeta "src"
- Maneja tareas como guardar datos y verificar usuarios

6.3 Rutas y su Funcionamiento

Determinan cómo se mueve la información de una parte a otra. En la aplicación, las principales rutas son:

6.3.1 Ruta de Usuarios (/api/users): Permite crear nuevos usuarios o ver la lista de usuarios existentes.
6.3.2 Ruta de Inicio de Sesión (/api/login): Verifica si un usuario tiene permiso para entrar a la aplicación (las credenciales).
6.3.3 Ruta de Datos de Sueño (/api/data): Permite guardar nuevos registros de sueño o ver los registros existentes.

6.4 Explicación del Código

6.4.1 server.js:

- Es como el cerebro de la aplicación.
- Decide qué hacer cuando alguien intenta usar diferentes partes de la aplicación.
- Por ejemplo, si alguien intenta iniciar sesión, el servidor sabe que debe usar el "portero" (login.js) para manejar esa solicitud.

6.4.2 auth.js:

- Es como un guardia de seguridad.
- Verifica si el usuario tiene un "pase" válido (token) antes de dejarlo acceder a ciertas áreas de la aplicación.

6.4.3 data.js, login.js, users.js:

- Son como diferentes asistentes, cada uno especializado en una tarea.
- data.js maneja todo lo relacionado con guardar y recuperar datos de sueño.
- login.js se encarga de verificar las credenciales de los usuarios.
- users.js maneja la creación de nuevos usuarios y la lista de usuarios.

6.4.4 Archivos en la carpeta "public/js":

- Son como diferentes herramientas que los usuarios pueden usar.
- app.js es la herramienta principal que coordina todas las demás.
- chat.js maneja las conversaciones con el asistente virtual.
- sleepDiary.js se encarga de registrar y mostrar los datos de sueño.
- ui.js controla cómo se ve y se comporta la interfaz de usuario.

6.5. Cómo Funciona Todo Junto

Imagina que un usuario quiere registrar su sueño de anoche:

1. El usuario abre la aplicación (entra por la "puerta principal", index.html).
2. Inicia sesión (el "portero", login.js, verifica sus credenciales).
3. Va a la página de registro de sueño (una "habitación" en la interfaz de usuario).
4. Ingresa sus datos de sueño (usando la "herramienta" sleepDiary.js).
5. Hace clic en "Guardar" (sleepDiary.js envía los datos por el "pasillo" al servidor).
6. El servidor (server.js) recibe los datos y los envía al "asistente" correcto (data.js).
7. data.js guarda la información en la base de datos (como escribir en un diario gigante).
8. El servidor confirma que todo salió bien y envía un mensaje de vuelta al usuario.
9. La interfaz de usuario (ui.js) muestra un mensaje de "Datos guardados con éxito".


7. Seguridad y privacidad 

La aplicación prioriza la seguridad y privacidad de los usuarios, guarda su contraseña forma segura y funciona para que solo el usuario puede ver sus datos, lo hace de la siguiente manera:

- Encriptación de contraseñas: Protege las contraseñas de los usuarios incluso si la base de datos se ve comprometida.
- Uso de tokens JWT para autenticación: Permite una autenticación sin estado, ideal para aplicaciones web modernas y facilita la escalabilidad al no requerir almacenamiento de sesiones en el servidor.
- Acceso restringido a datos personales
- Middleware de autenticación: Asegura que solo los usuarios autenticados puedan acceder a rutas protegidas.


8. Razonamiento del diseño y desarrollo

8.1 Arquitectura General: Separación de Frontend y Backend

La aplicación se divide en frontend y backend por varias razones importantes:

8.1.1 Separación de responsabilidades:

- El frontend se encarga de la presentación y la interacción con el usuario.
- El backend maneja el procesamiento de datos y la lógica de negocio.

8.1.2 Seguridad:

- Mantiene la lógica sensible y el acceso a la base de datos en el backend, protege esta información de ser expuesta directamente al navegador del usuario.


8.1.3 Escalabilidad:

- Esta estructura permite escalar independientemente el frontend y el backend según las necesidades.


8.2 Elección de Tecnologías

Se utilizaron las tecnologias que hasta ahora se han impartido en el curso aunque se pudiera optimizar la aplicación con tecnologias más avanzadas.

8.2.1 JavaScript para todo el stack:

- Permite usar el mismo lenguaje tanto en el frontend como en el backend, lo que simplifica el desarrollo y el mantenimiento.
- JavaScript es ampliamente utilizado en desarrollo web, lo que facilita encontrar recursos y solucionar problemas.

8.2.2 Node.js para el backend:

- Ofrece un rendimiento excelente para aplicaciones en tiempo real como el chat.
- Tiene un ecosistema rico de paquetes a través de npm, lo que acelera el desarrollo.

8.2.3 HTML, CSS y JavaScript vanilla para el frontend:

- Proporciona un control total sobre la interfaz de usuario sin la sobrecarga de frameworks complejos.
- Facilita el aprendizaje y la comprensión para desarrolladores principiantes.


8.3 Estructura de Archivos y Carpetas

Se utilizó esta separación de archivos y carpetas por diversas razones:

8.3.1 Separación clara entre 'public' y 'src':

- 'public' contiene todos los archivos accesibles directamente por el navegador.
- 'src' contiene el código del servidor, protegido de acceso directo.

8.3.2 Organización modular en 'src':

- La carpeta 'routes' separa la lógica de manejo de diferentes tipos de solicitudes (usuarios, login, datos).
- La carpeta 'middleware' aísla funciones que se ejecutan entre la solicitud y la respuesta.

8.3.3 Separación de responsabilidades en los archivos JS del frontend:

- Cada archivo (app.js, chat.js, sleepDiary.js, ui.js) tiene una responsabilidad específica, lo que hace el código más mantenible, fácil de entender y con más escalabilidad.


9. Principios de programación aplicados:

9.1 Modularidad: se dividió la aplicación en componentes independientes para facilitar el mantenimiento y la reutilización.

9.2 Separación de la lógica: Se ha logrado una distinción entre la lógica del sistema (backend) y la interfaz de usuario (frontend), manteniendo cada aspecto en su ámbito correspondiente.

9.3 DRY (Don't Repeat Yourself): Se han creado funciones reutilizables para tareas comunes, como la validación de datos.

9.4 SOLID: Se han aplicado los principios como la Responsabilidad Única.


10. Proceso de desarrollo:

Para el desarrollo de la aplicación se siguieron varias etapas como la planificación, crear el diseño deseado, implementar backend y frontend en paralelo, realizar correccion de problemas, funcionalidades una vez se intentó implementar... y por último implementación de mejoras en función del feedback una vez creada la app y poniéndola a prueba. 

Todo el proceso se ha apoyado en el uso de las herramientas de inteligencia artificial, a nombrar:
- v0.dev
- claude
- Ollama
- Chatgpt


11. Futuras mejoras:

Es una aplicación que está en su etapa preliminar y sienta las bases para futuras mejoras. Algunas de las que se quieren implementar son:

-Manejo de una base de datos real como por ejemplo mongodb.
-IA entrenada con todos los datos actualizados que la comunidad científica posee para que se pueda comportar como un asistente real de sueño tanto en el lado de los consejos de sueño como en el chat.
-Actualizar la interfaz para una mejor experiencia del usuario.
-Desarrollar una versión móvil para mayor accesibilidad y mejora de funciones como alertas con los consejos.
-Implementar gráficos para hacer más visuales las estadísticas.
-Pruebas unitarias para el código.
-Comentarios en el código para aumentar la accesibilidad para otros programadores.
-Sistema de feedback para ir adaptándo la aplicación a las necesidades reales de los usuarios.
-Integración con dispositivos de seguimiento del sueño o la adición de más funciones de análisis avanzado.
