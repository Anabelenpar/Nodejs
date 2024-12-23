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
- Una base de datos PostgreSQL para almacenar la información de los usuarios y sus registros de sueño
- Una integración con la IA Ollama para proporcionar consejos personalizados y un chat para interactuar en tiempo real


Esta es la estructura principal completa: 

├── package.json
├── package-lock.json
├── public
│   ├── css
│   │   └── styles.css
│   ├── index.html
│   ├── js
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── chat.js
│   │   ├── login.js
│   │   ├── sleepDiary.js
│   │   └── ui.js
│   └── login.html
├── README.MD
└── src
    ├── config
    │   └── database.js
    ├── middleware
    │   └── auth.js
    ├── models
    │   └── index.js
    ├── routes
    │   ├── data.js
    │   ├── login.js
    │   ├── ollama.js
    │   └── users.js
    ├── server.js
    └── services
        └── ollamaService.js


3. Componentes Principales
3.1 Registro de Usuario e Inicio de Sesión
Cuando un nuevo usuario quiere usar la aplicación, primero debe crear una cuenta:

El usuario proporciona un nombre de usuario y una contraseña
La aplicación guarda esta información de forma segura en la base de datos PostgreSQL
Los usuarios utilizan estas credenciales para acceder a la aplicación

Hay resgistrado un usuario y contraseña de prueba: testuser, password123

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

Existe un modo oscuro para que el usuario pueda elegir entre diferentes estilos de visualización según la cantidad de estímulo que quiera

3.4 Sistema de Chat
Incluye un "asistente virtual" con el que el usuario puede chatear:

- El usuario puede hacer preguntas sobre su sueño
- El asistente puede dar consejos basados en la información registrada
- La integración con la IA Ollama ofrece consejos personalizados y recomendaciones basadas en los datos de sueño del usuario

4. Cómo Funciona la Aplicación de forma muy simple
Para entender cómo funciona la aplicación, imaginemos que es como un restaurante:

El Frontend es como el comedor del restaurante, donde los clientes (usuarios) se sientan y hacen sus pedidos (ingresan datos o hacen preguntas).
El Backend es como la cocina, donde se preparan los platos (se procesa la información).
La base de datos es como la despensa del restaurante, donde se guardan todos los ingredientes (datos de los usuarios).
La IA Ollama actúa como el "chef experto" que da recomendaciones personalizadas.

Cuando un usuario usa la aplicación:

- Entra al "restaurante" (inicia sesión en la aplicación).
- Hace un "pedido" (ingresa información sobre su sueño o hace una pregunta).
- El "camarero" (la parte frontal de la aplicación) toma el pedido y lo lleva a la "cocina" (el servidor).
- En la "cocina", los "chefs" (programas en el servidor) preparan la "comida" (procesan la información).
- Si necesitan ingredientes, los buscan en la "despensa" (base de datos).
- Una vez lista la "comida" (información procesada), el "camarero" la lleva de vuelta al "cliente" (se muestra en la pantalla del usuario).

5. Diagrama de Flujo

mermaid
Copiar código
graph TD
    A[Usuario] -->|Accede| B(Interfaz de Usuario)
    B -->|Registra sueño| C{Frontend}
    B -->|Consulta estadísticas| C
    B -->|Chatea con asistente| C
    C -->|Envía datos| D[Backend]
    D -->|Verifica autenticación| E[Middleware de Auth]
    E -->|Usuario autenticado| F{API Routes}
    F -->|Guarda datos| G[(Base de Datos PostgreSQL)]
    F -->|Recupera datos| G
    G -->|Devuelve datos| F
    F -->|Procesa datos| D
    D -->|Envía respuesta| C
    C -->|Muestra resultados| B
    H[Asistente Virtual Ollama] -->|Genera respuestas| D

6. Aspectos técnicos
6.1 Estructura del Proyecto
Representado en un diagrama:

mermaid
Copiar código
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
    N --> S[ollama.js]
    C --> T[services/ollamaService.js]

6.2 Organización y Flujo de Trabajo
La aplicación está organizada en dos partes principales:

6.2.1 Frontend:
Contenido en la carpeta "public"
HTML (estructura), CSS (estilo), JS (funcionalidad)

6.2.2 Backend:
Contenido en la carpeta "src"
- Maneja tareas como guardar datos y verificar usuarios
- Integra Ollama para ofrecer recomendaciones y consejos personalizados
- Integra base de datos postgreSQL 

6.3 Rutas y su Funcionamiento
Determinan cómo se mueve la información de una parte a otra. En la aplicación, las principales rutas son:

/api/users: Para gestionar la información de los usuarios
/api/data: Para guardar y obtener datos de sueño
/api/ollama: Para interactuar con la IA y obtener consejos personalizados
