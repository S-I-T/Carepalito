# Carepalito
Robot asistente personal de código abierto creado para investigar y difundir de forma lúdica las potencialidades de la inteligencia artificial, desarrollado en Chile para el mundo con amor!

![Carepalito](https://firebasestorage.googleapis.com/v0/b/project-3062526721407020231.appspot.com/o/carepalito.gif?alt=media&token=436abcac-9f4d-4400-9979-5dfc070f22d8)

Puedes ver un video de Carepalito en acción [acá](https://www.youtube.com/watch?v=IE29FYRFLOI)

Para su funcionamiento utiliza un detector de palabras clave ([snowboy](http://snowboy.kitt.ai)), reconocedor de lenguaje hablado ([Google Cloud Speech](https://cloud.google.com/speech)) y un motor de reconocimiento de lenguaje natural ([API.ai](http://api.ai)) para entender las consultas del usuario y se conecta a diversas apis ([Yahoo Weather](https://developer.yahoo.com/weather/), [Google knowledge Graph](https://developers.google.com/knowledge-graph/), [Spotify API](https://developer.spotify.com/web-api/)) para generar las respuestas.


## Requerimientos
Para tener tu propio Carepalito requieres los siguientes componentes:
* Raspberry Pi 3
* Memoria SD (mínimo de 8G)
* Fuente de poder Raspberry Pi
* Micrófono USB (Recomendamos Camara Eye de PS3)
* Parlante con entrada auxiliar
* Camara Raspberry Pi (opcional)
* Pantalla HDMI
* Teclado
* Mouse

## Instalación

### Instalación manual
Para instalar manualmente a Carepalito, acá dejamos una guia de [instalación](https://github.com/S-I-T/Carepalito/wiki/Instalaci%C3%B3n-Manual).

## Configuración

Es necesario configurar las credenciales para acceder a los servicios de Google Cloud que utiliza Carepalito:
* Crear [cuenta de servicio](https://cloud.google.com/speech/docs/common/auth#creating_a_service_account) y configurar archivo y proyecto en config.json
* Crear cuenta en [API.ai](https://api.ai/) e ingresar el token en config.json
* Generar token para acceso a [Google APIs](https://developers.google.com/knowledge-graph/how-tos/authorizing)

## Comunidad

Mantengamonos en contacto, te dejamos nuestro [Facebook](https://www.facebook.com/robot.carepalo/) 
