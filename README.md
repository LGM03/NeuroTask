<h1 align="center">NeuroTask </h1>
<p align='center'>:construction: Proyecto en construcción :construction:</p>
<p style="text-align: justify;">Como Trabajo de Fin de Grado de Ingeniería de Software, se desarrolla una aplicación web para la prevención del deterioro cognitivo. 
La aplicación cuenta con actividades para trabajar diversos aspectos como la atención o la memoria a corto plazo entre otros. Además cuenta con la posibilidad de realizar un seguimiento por parte de un terapeuta, mediante la asignación de tareas y el analisis de los resultados obtenidos.</p>
<h2 align="center">Despliegue </h2>
<p style="text-align: justify;">Para realizar el despliegue de la aplicación es necesario tener instalado Visual Studio Code, Node.js y Xammp, aunque diversos módulos serán instalados posteriormente desde el código.</p>
<h3 align="center">:file_folder: Acceso al código </h3>

<h3 align="center">:floppy_disk: Acceso a la base de datos</h3>
<p style="text-align: justify;"> En primer lugar se iniciará la base de datos, para ello es necesario abrir Xammp y activar los módulos Apache y MySQL.

  ![image](https://github.com/LGM03/NeuroTask/assets/99087911/4370ad24-ca10-4bab-9d0f-16f52c0db193)

Posteriormente abirmos PhpMyAdmin desde el navegador mediante la ruta http://localhost/phpmyadmin/index.php e importamos la base de datos.
Es necesario tener una bd homónima ya creada.
![Captura de pantalla 2024-02-21 205757](https://github.com/LGM03/NeuroTask/assets/99087911/7bd38cb2-ed26-4e27-aa5d-b32b97479fee)

</p>
Después, clonamos el código y lo abrimos en Visual Studio Code, corremos los siguientes comando : npm install (Para instalar los paquetes incluidos en el archivo .json) y npm start, para poner en funcionamiento el servidor
![image](https://github.com/LGM03/NeuroTask/assets/99087911/22597957-f5dc-41dd-9ce8-4c9ef1ea84f7)


A partir de este momento será posible acceder a la aplicación desde localhost, por defecto desde el puerto 3000, mediante la ruta http://localhost:3000/.
Este puerto podrá ser modificado en nuestro codigo en el fichero bin/www.
![Captura de pantalla 2024-02-21 205442](https://github.com/LGM03/NeuroTask/assets/99087911/351bbead-432e-42f2-b1da-1c415455f55f)

La información de la base de datos, podrá ser modificada en el fichero routes/bd.js
![image](https://github.com/LGM03/NeuroTask/assets/99087911/c7d97a32-7451-4a16-a2b9-a887c5586973)

