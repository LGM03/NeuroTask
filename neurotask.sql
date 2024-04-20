-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-04-2024 a las 12:44:19
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `neurotask`
--
CREATE DATABASE IF NOT EXISTS `neurotask` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `neurotask`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `calendario`
--

CREATE TABLE `calendario` (
  `idTarea` int(11) NOT NULL,
  `idT` varchar(255) NOT NULL,
  `idP` varchar(255) NOT NULL,
  `idJ` int(11) NOT NULL,
  `nivel` int(11) NOT NULL,
  `fecha` date DEFAULT NULL,
  `seRepite` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id_cat` int(11) NOT NULL,
  `categoria` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id_cat`, `categoria`) VALUES
(1, 'Atención'),
(2, 'Cálculo'),
(3, 'Memoria C/P'),
(4, 'Lenguaje'),
(5, 'Memoria de Trabajo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `idT` varchar(255) NOT NULL,
  `idP` varchar(255) NOT NULL,
  `comentario` text NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juegos`
--

CREATE TABLE `juegos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `id_categoria` int(11) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `juegos`
--

INSERT INTO `juegos` (`id`, `nombre`, `id_categoria`, `descripcion`, `imagen`) VALUES
(1, 'Astronauta', 1, ' Mueve el cohete pulsando en los extremos superior en inferior de la pantalla y consigue que el astronauta llegue a la meta <ol>\n  <li><strong>Fácil: Un </strong>único elemento de distracción</li>\n  <li><strong>Media: Dos </strong>elementos de distracción</li>\n  <li><strong>Difícil: Dos </strong>elementos de distracción <strong>en movimiento</strong></li>\n</ol>', '/images/astronauta.jpg'),
(2, 'Cuentas', 2, 'Realiza las siguiente operaciones de suma, resta y multiplicación <ol>\n  <li><strong>Fácil: Sumas y restas </strong> con valores menores de 10 </li>\n  <li><strong>Media: Sumas y restas</strong>  con valores menores de 30</li>\n  <li><strong>Difícil: Sumas y restas</strong>  con valores menores de 60 y<strong>  multiplicaciones </strong> con valores menores de 10 para ambos operadores</li>\n</ol>', '/images/cuentas.png'),
(3, 'Busca las parejas', 3, 'Desvela el valor de las cartas y encuentra las parejas<ol>\n  <li><strong>Fácil:</strong> Juega con <strong>SEIS</strong>  cartas, encuentra tres parejas</li>\n  <li><strong>Media:</strong>Juega con <strong>OCHO</strong>  cartas, encuentra cuatro parejas</li>\n  <li><strong>Difícil:</strong>Juega con <strong>DOCE</strong>  cartas, encuentra seis parejas </li>\n</ol>', '/images/juegoParejas.png'),
(4, '¡Orden Creciente!', 5, 'Ordena las carta de Menor a Mayor<ol>\n  <li><strong>Fácil:</strong> Ordena <strong>SEIS</strong>  cartas </li>\n  <li><strong>Media:</strong>Ordena <strong>OCHO</strong> cartas</li>\n  <li><strong>Difícil:</strong> Ordena <strong>DOCE</strong> cartas</li>\n</ol>', '/images/juegoOrdename.png'),
(5, 'Descubre la palabra', 4, 'Ordena todas las letras y descuebre la palabra de la temática indicada. Temáticas de colores, países y animales<ol>\n  <li><strong>Fácil:</strong> Elementos muy conocidos de la temática indicada </li>\n  <li><strong>Media:</strong>Combinación de elementos conocidos y otros menos conocidos pero aún relevantes a nivel global.</li>\n  <li><strong>Difícil:</strong> Elementos menos conocidos y que a menudo no son mencionados en contextos generales.</li>\n</ol>', '/images/logoPalabras.png'),
(6, 'Descubre el refrán', 4, 'Ordena todas las palabras y descubre el refrán típico<ol>\n  <li><strong>Fácil:</strong> Refranes cortos y muy conocidos </li>\n  <li><strong>Media:</strong>Combinación de refranes conocidos y otros menos conocidos con una longitud superior</li>\n  <li><strong>Difícil:</strong> Refranes menos conocidos y con longitud y complejidad gramatical superior</li>\n</ol>', '/images/logoRefran.png'),
(7, 'Simón dice', 5, 'Memoriza la secuencia en la que se encienden las bombillas<ol>\n  <li><strong>Fácil:</strong> Recordar secuencia de hasta <strong>CUATRO</strong> elementos </li>\n  <li><strong>Media:</strong> Recordar secuencia de hasta <strong>SEIS</strong> elementos  </li>\n  <li><strong>Difícil:</strong> Recordar secuencia de hasta <strong>OCHO</strong> elementos </li>\n</ol>', '/images/simonDice.png'),
(8, '¡Orden Decreciente!', 5, 'Ordena las carta de Mayor a Menor<ol>\n  <li><strong>Fácil:</strong> Ordena <strong>SEIS</strong> cartas </li>\n  <li><strong>Media:</strong>Ordena <strong>OCHO</strong> cartas</li>\n  <li><strong>Difícil:</strong> Ordena <strong>DOCE</strong> cartas</li>\n</ol>', '/images/juegoOrdenameDecreciente.png'),
(9, 'Memoriza y reconoce figuras', 3, 'Memoriza las cartas que aparecen y reconócelas entre todas las que aparecen<ol>\n  <li><strong>Fácil:</strong> Recuerda una carta y reconócelas entre <strong>SEIS</strong> diferentes </li>\n  <li><strong>Media:</strong> Recuerda dos carta y reconócelas entre <strong>OCHO</strong> diferentes </li>\n  <li><strong>Difícil:</strong>  Recuerda tres carta y reconócelas entre <strong>DOCE</strong> diferentes </li>\n</ol>', '/images/reconoceFiguras.png'),
(10, 'Memoriza y reconoce colores', 3, 'Memoriza los colores que aparecen y reconócelos entre todos las que aparecen<ol>\n  <li><strong>Fácil:</strong> Recuerda una color y reconócelo entre <strong>CUATRO</strong> diferentes </li>\n  <li><strong>Media:</strong> Recuerda dos colores y reconócelos entre <strong>SEIS</strong> diferentes </li>\n  <li><strong>Difícil:</strong>  Recuerda tres colores y reconócelos entre <strong>OCHO</strong> diferentes </li>\n</ol>', '/images/reconoceColores.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `paciente`
--

CREATE TABLE `paciente` (
  `correo` varchar(255) NOT NULL,
  `edad` int(11) DEFAULT NULL,
  `deterioro` varchar(255) NOT NULL DEFAULT 'Leve'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pac_ter`
--

CREATE TABLE `pac_ter` (
  `correoT` varchar(255) NOT NULL,
  `correoP` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partidas`
--

CREATE TABLE `partidas` (
  `idJ` int(11) NOT NULL,
  `idP` varchar(255) NOT NULL,
  `fechaInicio` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `duracion` int(11) NOT NULL,
  `aciertos` int(11) NOT NULL,
  `fallos` int(11) NOT NULL,
  `idTarea` int(11) DEFAULT NULL,
  `nivel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planificacionesjugadas`
--

CREATE TABLE `planificacionesjugadas` (
  `idTarea` int(11) NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `terapeuta`
--

CREATE TABLE `terapeuta` (
  `correo` varchar(255) NOT NULL,
  `clinica` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `correo` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellido` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `imagen` varchar(255) NOT NULL DEFAULT 'images/usuario.png',
  `salt` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `calendario`
--
ALTER TABLE `calendario`
  ADD PRIMARY KEY (`idTarea`),
  ADD KEY `calendario_r1` (`idJ`),
  ADD KEY `calendario_r4` (`idT`),
  ADD KEY `calnedario_r2` (`idP`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id_cat`);

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comentarios_r2` (`idT`),
  ADD KEY `comentarios_r1` (`idP`);

--
-- Indices de la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `juegos_r1` (`id_categoria`);

--
-- Indices de la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`correo`);

--
-- Indices de la tabla `pac_ter`
--
ALTER TABLE `pac_ter`
  ADD PRIMARY KEY (`correoT`,`correoP`),
  ADD KEY `r2` (`correoP`);

--
-- Indices de la tabla `partidas`
--
ALTER TABLE `partidas`
  ADD PRIMARY KEY (`idJ`,`idP`,`fechaInicio`),
  ADD KEY `r6` (`idP`);

--
-- Indices de la tabla `planificacionesjugadas`
--
ALTER TABLE `planificacionesjugadas`
  ADD PRIMARY KEY (`idTarea`,`fecha`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `terapeuta`
--
ALTER TABLE `terapeuta`
  ADD PRIMARY KEY (`correo`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`correo`) USING BTREE;

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `calendario`
--
ALTER TABLE `calendario`
  MODIFY `idTarea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=136;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id_cat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `juegos`
--
ALTER TABLE `juegos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `calendario`
--
ALTER TABLE `calendario`
  ADD CONSTRAINT `calendario_r1` FOREIGN KEY (`idJ`) REFERENCES `juegos` (`id`),
  ADD CONSTRAINT `calendario_r3` FOREIGN KEY (`idT`) REFERENCES `terapeuta` (`correo`),
  ADD CONSTRAINT `calendario_r4` FOREIGN KEY (`idT`) REFERENCES `terapeuta` (`correo`),
  ADD CONSTRAINT `calnedario_r2` FOREIGN KEY (`idP`) REFERENCES `paciente` (`correo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_r1` FOREIGN KEY (`idP`) REFERENCES `paciente` (`correo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `comentarios_r2` FOREIGN KEY (`idT`) REFERENCES `terapeuta` (`correo`);

--
-- Filtros para la tabla `juegos`
--
ALTER TABLE `juegos`
  ADD CONSTRAINT `juegos_r1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id_cat`);

--
-- Filtros para la tabla `paciente`
--
ALTER TABLE `paciente`
  ADD CONSTRAINT `r1` FOREIGN KEY (`correo`) REFERENCES `usuario` (`correo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `pac_ter`
--
ALTER TABLE `pac_ter`
  ADD CONSTRAINT `r2` FOREIGN KEY (`correoP`) REFERENCES `paciente` (`correo`) ON UPDATE CASCADE,
  ADD CONSTRAINT `r3` FOREIGN KEY (`correoT`) REFERENCES `terapeuta` (`correo`);

--
-- Filtros para la tabla `partidas`
--
ALTER TABLE `partidas`
  ADD CONSTRAINT `r5` FOREIGN KEY (`idJ`) REFERENCES `juegos` (`id`),
  ADD CONSTRAINT `r6` FOREIGN KEY (`idP`) REFERENCES `paciente` (`correo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `planificacionesjugadas`
--
ALTER TABLE `planificacionesjugadas`
  ADD CONSTRAINT `plan_r1` FOREIGN KEY (`idTarea`) REFERENCES `calendario` (`idTarea`);

--
-- Filtros para la tabla `terapeuta`
--
ALTER TABLE `terapeuta`
  ADD CONSTRAINT `r4` FOREIGN KEY (`correo`) REFERENCES `usuario` (`correo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
