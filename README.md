# space-invaders
Oh not, not another Space Invaders game!

**Space Invaders**

Juego clásico de estilo Space Invaders implementado en JavaScript, HTML y CSS.

**Run here on Netlify (BEST)** https://astorskywalker-space-invader.netlify.app/ <br>
or <br>
**Run here on GitHubPages** https://astorskywalker.github.io/space-invaders/ <br>
or <br>
**Run here on Vercel** https://space-invaders-orpin.vercel.app/ <br>

---

## Descripción

Este proyecto es una recreación moderna del icónico juego **Space Invaders**, donde el jugador controla una nave espacial en la parte inferior de la pantalla y debe eliminar oleadas de invasores enemigos antes de que lleguen a la base.

El juego está desarrollado con las siguientes tecnologías:

* **JavaScript (ES6+)** para la lógica del juego y manejo de entidades.
* **HTML5 Canvas** para el renderizado de gráficos 2D.
* **CSS3** para estilos y animaciones sencillas.
* **Audio.js** para gestión y reproducción de efectos de sonido y música de fondo.

---

## Características

* Multi-nivel con dificultad creciente.
* Sistema de puntuación y visualización de la puntuación más alta.
* Efectos de sonido para disparos, explosiones, subida de nivel y fin de juego.
* Música de fondo con controles de reproducción (iniciar/detener).
* Controles responsivos mediante teclado (flechas y barra espaciadora).

---

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/<tu-usuario>/space-invaders.git
   ```
2. Navega al directorio:

   ```bash
   cd space-invaders
   ```
3. Sirve los archivos estáticos (puedes usar un servidor local como `Live Server` de VSCode o `http-server` de Node.js):

   ```bash
   npx http-server .
   ```
4. Abre tu navegador en `http://localhost:8080` (o el puerto que te indique tu servidor).

---

## Uso

Al cargar la página, el juego iniciará automáticamente. Usa las teclas de flecha izquierda y derecha para mover la nave y la barra espaciadora para disparar.

* **Tecla Izquierda (←)**: Mover nave a la izquierda.
* **Tecla Derecha (→)**: Mover nave a la derecha.
* **Barra Espaciadora**: Disparar proyectiles.

Para pausar o reanudar la música de fondo, implementa las funciones en `audio.js`:

```js
import { startBackground, stopBackground } from './audio.js';

// Ejemplo de uso
startBackground(); // Inicia la música
toggleMusicButton.addEventListener('click', () => {
  stopBackground(); // Detiene la música
});
```

---

## Estructura de Archivos

```
space-invaders/
├── assets/
│   ├── player2.png
│   ├── enemy.png
│   ├── battle_theme2.mp3
│   └── ...(otros sprites y audios)
├── src/
│   ├── game.js       # Lógica principal del juego
│   ├── audio.js      # Gestor de audio y música de fondo
│   └── styles.css    # Estilos básicos
├── docs/
│   └── index.html    # Punto de entrada del juego
└── README.md         # Documentación del proyecto
```

---

## Contribuciones

¡Contribuciones son bienvenidas! Para proponer mejoras o reportar errores:

1. Haz un *fork* del repositorio.
2. Crea una rama con la nueva funcionalidad (`git checkout -b feature/nueva-funcion`).
3. Realiza tus cambios y haz *commit* con mensajes descriptivos.
4. Empuja tu rama al repositorio remoto.
5. Abre un *Pull Request* y describe tus cambios.

---

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## Autor

* **Nelson Astor Nelson Wood** – Administrador de Bases de Datos & Desarrollador Front-end

*¡Que disfrutes jugando y contribuyendo!*
