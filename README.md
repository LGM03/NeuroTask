
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
  
Para acceder a la base de datos creada desde el código, las variables se encuentran predefinidas en el fichero llamado config.js que contiene los siguientes valores por defecto :
<p align='center'">
module.exports = {<br>
    VAR_PORT: process.env.ENV_PORT || 3000,<br>
    VAR_HOST: process.env.ENV_HOST || "localhost",<br>
    VAR_USER: process.env.ENV_USER || "root",<br>
    VAR_PASSWORD: process.env.ENV_PASSWORD || "",<br>
    VAR_DATABASE: process.env.ENV_DATABASE || "neurotask"}<br>
</p>
Estos valores podrán ser modificados, creando un fichero llamado .env en la raíz del proyecto, e incluyendo las siguientes varibles con los datos correspondientes
</p>

<p align='center'">
ENV_PORT= tu_puerto<br>
ENV_HOST= "tu_host"<br>
ENV_USER= "tu_usuario"<br>
ENV_PASSWORD= "tu_contraseña"<br>
ENV_DATABASE= "tu_bd"<br>
</p>
  
 Finalmente, será necesario escribri en la consola <strong>npm start</strong> <em>para poner en funcionamiento el servidor</em>. Si todo ha funcionado correctamente veremos en la consola el inicio de Nodemon.

</p>
<p style="text-align: justify;">
A partir de este momento será posible acceder a la aplicación desde localhost, por defecto desde el puerto 3000, mediante la ruta http://localhost:3000/.
Este puerto podrá ser modificado en nuestro codigo en el fichero bin/www, donde se declara la instancia de nuestra aplicación web y el puerto de escucha mediante el siguiente codigo o en el fichero .env creado anteriormente</p>
<p align='center'">
var app = require('../app');<br>
var debug = require('debug')('aplicacionesweb:server');<br>
var http = require('http');<br>
const PUERTO = '3000'<br>
</p>
