
<h1 align="center">

![Logo NeuroTask](https://github.com/LGM03/NeuroTask/assets/99087911/0f2345c6-4809-4d6f-ae3b-fd0b140bb48d)

  
  </h1>
  
<h1 align="center">

NeuroTask
  
  </h1>
<p align='center'>:construction: Proyecto en construcción :construction:</p>
<p style="text-align: justify;">Como Trabajo de Fin de Grado de Ingeniería de Software, se desarrolla una aplicación web para la prevención del deterioro cognitivo. 
La aplicación cuenta con actividades para trabajar diversos aspectos como la atención o la memoria a corto plazo entre otros. Además cuenta con la posibilidad de realizar un seguimiento por parte de un terapeuta, mediante la asignación de tareas y el analisis de los resultados obtenidos.</p>
<h2 align="center">Despliegue </h2>
<p style="text-align: justify;">Para realizar el despliegue de la aplicación es necesario tener instalado Visual Studio Code, Node.js y Xammp, además, diversos módulos serán instalados posteriormente desde el código.</p>

<h3 align="center">:floppy_disk: Acceso a la base de datos</h3>
<p style="text-align: justify;"> En primer lugar se iniciará la base de datos, para ello es necesario abrir Xammp y activar los módulos Apache y MySQL, como se ve reflejado en la siguiente imagen.

  ![Iniciar servicios en Xammp](https://github.com/LGM03/NeuroTask/assets/99087911/4370ad24-ca10-4bab-9d0f-16f52c0db193)

Posteriormente abriremos PhpMyAdmin desde el navegador mediante la ruta http://localhost/phpmyadmin/index.php e importaremos la base de datos.
Para importar la base de datos, utilizaremos el archivo neurotask.sql del repositorio, este script generará automaticamente una base de datos con el nombre apropiado y todas las tablas necesarias para el correcto funcionamiento de la aplicación. Podremos importar todo el contenido desde la pestaña importar, seleccionando el archivo neurotask.sql que contiene la BD y pulsando aceptar.
![Importar Base de datos en PhpMyAdmin](https://github.com/LGM03/NeuroTask/assets/99087911/60c6b223-e354-4ec0-8105-c52cd45e000b)


<h3 align="center">:file_folder: Acceso al código </h3>
<p style="text-align: justify;">
Después, clonamos el código y lo abrimos en Visual Studio Code, corremos los siguientes comando : <strong>npm install</strong> <em>(Para instalar los paquetes incluidos en el archivo .json)</em> 
  
Para acceder a la base de datos creada desde el código, el fichero config.js  contiene los siguientes valores por defecto :
<p align='center'">
module.exports = {<br>
    PORT: process.env.PORT || 3000,<br>
    VAR_HOST: process.env.VAR_HOST || localhost,<br>
    VAR_USER: process.env.VAR_USER || root,<br>
    VAR_PASSWORD: process.env.VAR_PASSWORD,<br>
    VAR_DATABASE: process.env.VAR_DATABASE || neurotask,<br>
    VAR_PORT_DB:  process.env.VAR_PORT_DB || 3306
}<br>
</p>


Paramodificar estos valores, será necesario crear un fichero llamado .env de la raíz del proyecto, e incluir las varibles con los datos correspondientes a la base  de datos creada.
</p>

<p align='center'">
PORT=tu_puerto<br>
VAR_HOST=tu_host<br>
VAR_USER=tu_usuario<br>
VAR_PASSWORD=tu_contraseña<br>
VAR_DATABASE=tu_base_de_datos<br>
VAR_PORT_DB=tu_puerto_de_bd<br>
</p>
  
 Finalmente, será necesario escribir en la consola <strong>npm start</strong> <em>para poner en funcionamiento el servidor</em>. Si los pasos se han seguido correctamente, veremos en la consola el inicio de Nodemon.

</p>
<p style="text-align: justify;">
A partir de este momento será posible acceder a la aplicación desde localhost, por defecto desde el puerto 3000, mediante la ruta http://localhost:3000
Este puerto podrá ser modificado en nuestro codigo en el fichero bin/www, donde se declara la instancia de nuestra aplicación web y el puerto de escucha mediante el siguiente codigo o en el fichero .env creado anteriormente</p>
<p align='center'">
var app = require('../app');<br>
var debug = require('debug')('aplicacionesweb:server');<br>
var http = require('http');<br>
const PUERTO = '3000'<br>
</p>
