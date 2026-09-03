<?php

header('Content-Type: application/json; charset=utf-8');

// Parámetros recibidos
$edicion = isset($_GET['edicion']) ? intval($_GET['edicion']) : 0;
$gallery = isset($_GET['gallery']) ? basename($_GET['gallery']) : '';

if ($edicion <= 0 || $gallery === '') {
    http_response_code(400);
    echo json_encode([
        'error' => 'Faltan parámetros: edicion y gallery'
    ]);
    exit;
}

// Determinar el repositorio según la edición
if ($edicion >= 1 && $edicion <= 10) {
    $repositorio = 'eneur-01-10';
} elseif ($edicion >= 11 && $edicion <= 20) {
    $repositorio = 'eneur-11-20';
} elseif ($edicion >= 21 && $edicion <= 26) {
    $repositorio = 'eneur-21-26';
} elseif ($edicion >= 27 && $edicion <= 40) {
    $repositorio = 'eneur-27-40';
} elseif ($edicion >= 41 && $edicion <= 50) {
    $repositorio = 'eneur-41-50';
} elseif ($edicion >= 51 && $edicion <= 60) {
    $repositorio = 'eneur-51-60';
} elseif ($edicion >= 61 && $edicion <= 70) {
    $repositorio = 'eneur-61-70';
} elseif ($edicion >= 71 && $edicion <= 80) {
    $repositorio = 'eneur-71-80';
} elseif ($edicion >= 81 && $edicion <= 90) {
    $repositorio = 'eneur-81-90';
} elseif ($edicion >= 91 && $edicion <= 100) {
    $repositorio = 'eneur-91-00';
} else {
    http_response_code(400);
    echo json_encode([
        'error' => 'Edición no válida'
    ]);
    exit;
}

// Número de edición con dos dígitos
$numEdicion = str_pad($edicion, 2, '0', STR_PAD_LEFT);

// Ruta física de la galería
$rutaGaleria = __DIR__ . '/' .
               $repositorio . '/revista' .
               $numEdicion . '/galleries/' .
               $gallery;

// Verificar que exista
if (!is_dir($rutaGaleria)) {
    http_response_code(404);
    echo json_encode([
        'error' => 'La galería no existe'
    ]);
    exit;
}

// Extensiones permitidas
$extensiones = ['jpg', 'jpeg', 'png', 'webp', 'gif'];

// Obtener archivos
$archivos = scandir($rutaGaleria);

$imagenes = [];

foreach ($archivos as $archivo) {

    if ($archivo === '.' || $archivo === '..') {
        continue;
    }

    $rutaArchivo = $rutaGaleria . '/' . $archivo;

    if (!is_file($rutaArchivo)) {
        continue;
    }

    $extension = strtolower(pathinfo($archivo, PATHINFO_EXTENSION));

    if (!in_array($extension, $extensiones)) {
        continue;
    }

    // Obtener dimensiones
    $dimensiones = getimagesize($rutaArchivo);

    if ($dimensiones === false) {
        continue;
    }

    $imagenes[] = [
        'file' => $archivo,
        'width' => $dimensiones[0],
        'height' => $dimensiones[1]
    ];
}

// Devolver JSON
echo json_encode($imagenes, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
