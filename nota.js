const JSON_URL = './revista.json';

document.addEventListener('DOMContentLoaded', cargarNota);


async function cargarNota() {

    try {

        const params = new URLSearchParams(window.location.search);

        const numeroEdicion = Number(params.get('edicion'));
        const idNota = params.get('id');

        if (!numeroEdicion || !idNota) {
            throw new Error('Faltan parámetros en la URL.');
        }


        // ============================================================
        // CARGAR JSON
        // ============================================================

        const respuesta = await fetch(JSON_URL);

        if (!respuesta.ok) {
            throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();


        // ============================================================
        // BUSCAR EDICIÓN
        // ============================================================

        const edicion = datos.ediciones.find(
            ed => Number(ed.numero) === numeroEdicion
        );

        if (!edicion) {
            throw new Error(
                `No se encontró la edición ${numeroEdicion}.`
            );
        }


        // ============================================================
        // BUSCAR NOTA
        // ============================================================

        const nota = edicion.notas.find(
            n => String(n.id) === String(idNota)
        );

        if (!nota) {
            throw new Error(
                `No se encontró la nota ${idNota}.`
            );
        }


        // ============================================================
        // BUSCAR SECCIÓN
        // ============================================================

        const seccion = edicion.secciones_config.find(
            s => s.nombre === nota.seccion
        );


        // ============================================================
        // MOSTRAR NOTA
        // ============================================================

        await mostrarNota(
            nota,
            seccion,
            edicion.notas,
            numeroEdicion
        );


    } catch (error) {

        console.error(
            'Error al cargar la nota:',
            error
        );

        document.getElementById('nota').innerHTML = `
            <h1>No se pudo cargar la nota</h1>
            <p>${error.message}</p>
            <p>
                <a href="indice.html">
                    ← Volver al índice
                </a>
            </p>
        `;
    }
}


async function mostrarNota(
    nota,
    seccion,
    notas,
    numeroEdicion
) {

    // ============================================================
    // CONFIGURACIÓN
    // ============================================================

    const colorSeccion =
        seccion?.color_seccion || '#999999';

    const numFormateado =
        String(numeroEdicion).padStart(2, '0');


    document.title =
        `${nota.titulo || 'Nota'} - ENEUR`;


    // ============================================================
    // SECCIÓN
    // ============================================================

    const elementoSeccion =
        document.getElementById('nota-seccion');

    elementoSeccion.textContent =
        nota.seccion || '';

    elementoSeccion.style.backgroundColor =
        colorSeccion;

    // ============================================================
    // TÍTULO
    // ============================================================

    document.getElementById('nota-titulo').textContent =
        nota.titulo || '';


    // ============================================================
    // AUTOR
    // ============================================================

    const elementoAutor =
        document.getElementById('nota-autor');

    if (nota.autor) {

        elementoAutor.textContent =
            `Por ${nota.autor}`;

    } else {

        elementoAutor.style.display =
            'none';
    }


    // ============================================================
    // ENTRADILLA
    // ============================================================

    const elementoEntradilla =
        document.getElementById('nota-entradilla');

    if (nota.entradilla) {

        elementoEntradilla.textContent =
            nota.entradilla;

    } else {

        elementoEntradilla.style.display =
            'none';
    }


    // ============================================================
    // IMAGEN
    // ============================================================
    
    const elementoImagen =
        document.getElementById('nota-imagen');
    
    if (nota.imagen_destacada) {
        let urlImagenDestacada = '';
    
        if (numeroEdicion >= 27 && numeroEdicion <= 40) {
            urlImagenDestacada =
                `/eneur-27-40/revista${numFormateado}/images/${nota.imagen_destacada}.jpg`;
        }
        else if (numeroEdicion >= 41 && numeroEdicion <= 50) {
            urlImagenDestacada =
                `/eneur-41-50/revista${numFormateado}/images/${nota.imagen_destacada}.jpg`;
        }
        else if (numeroEdicion >= 51 && numeroEdicion <= 60) {
            urlImagenDestacada =
                `/eneur-51-60/revista${numFormateado}/images/${nota.imagen_destacada}.jpg`;
        }
        else if (numeroEdicion >= 61 && numeroEdicion <= 70) {
            urlImagenDestacada =
                `/eneur-61-70/revista${numFormateado}/images/${nota.imagen_destacada}.jpg`;
        }
        else if (numeroEdicion >= 71 && numeroEdicion <= 80) {
            urlImagenDestacada =
                `/eneur-71-80/revista${numFormateado}/images/${nota.imagen_destacada}.jpg`;
        }
        else if (numeroEdicion >= 81 && numeroEdicion <= 90) {
            urlImagenDestacada =
                `/eneur-81-90/revista${numFormateado}/images/${nota.imagen_destacada}.jpg`;
        }
        else if (numeroEdicion >= 91 && numeroEdicion <= 99) {
            urlImagenDestacada =
                `/eneur-91-00/revista${numFormateado}/images/${nota.imagen_destacada}.jpg`;
        }
    
        if (urlImagenDestacada) {
            elementoImagen.innerHTML = `
                <img
                    src="${urlImagenDestacada}"
                    alt="${nota.titulo || ''}"
                >
            `;
        } else {
            elementoImagen.style.display = 'none';
        }
    
    } else {
    
        elementoImagen.style.display = 'none';
    }


    // ============================================================
    // URL DEL CONTENIDO PHP
    // ============================================================

    let urlEdicion = '';
    let urlContenido = '';
    let urlMusica = '';
    let urlImagen = '';


    if (
        numeroEdicion >= 27 &&
        numeroEdicion <= 40
    ) {

        urlEdicion =
            `/eneur-27-40/revista${numFormateado}/`;

    }
    else if (
        numeroEdicion >= 41 &&
        numeroEdicion <= 50
    ) {

        urlEdicion =
            `/eneur-41-60/revista${numFormateado}/`;

    }
    else if (
        numeroEdicion >= 51 &&
        numeroEdicion <= 60
    ) {

        urlEdicion =
            `/eneur-41-60/revista${numFormateado}/`;

    }

    else if (
        numeroEdicion >= 61 &&
        numeroEdicion <= 70
    ) {

        urlEdicion =
            `/eneur-61-70/revista${numFormateado}/`;

    }

    else if (
        numeroEdicion >= 71 &&
        numeroEdicion <= 80
    ) {

        urlEdicion =
            `/eneur-71-80/revista${numFormateado}/`;

    }

    else if (
        numeroEdicion >= 81 &&
        numeroEdicion <= 90
    ) {

        urlEdicion =
            `/eneur-81-90/revista${numFormateado}/`;

    }

    else if (
        numeroEdicion >= 91 &&
        numeroEdicion <= 99
    ) {

        urlEdicion =
            `/eneur-91-00/revista${numFormateado}/`;
    }

    urlContenido = `${urlEdicion}content/`;
    urlMusica = `${urlEdicion}music/`;
    urlImagen = `${urlEdicion}images/`;
    
    const urlNota = `${urlContenido}${nota.id_pagina}.php`;


    // ============================================================
    // VALIDAR URL
    // ============================================================

    if (!urlNota) {

        throw new Error(
            `No se encontró una ruta de contenido para la edición ${numeroEdicion}.`
        );
    }


    // ============================================================
    // CARGAR PHP
    // ============================================================

    console.log(
        'Cargando contenido:',
        urlNota
    );


    const respuestaContenido =
        await fetch(urlNota);


    if (!respuestaContenido.ok) {

        throw new Error(
            `No se pudo cargar el contenido de ${urlNota}: HTTP ${respuestaContenido.status}`
        );
    }


    // ============================================================
    // INSERTAR HTML
    // ============================================================

    let contenidoHTML = await respuestaContenido.text();

    contenidoHTML = contenidoHTML.replace(
                    /src="\.\/musica\//g,
                    `src="${urlMusica}`
                    );
    
    contenidoHTML = contenidoHTML.replace(
                    /src="images\//g,
                    `src="${urlImagen}`
                    );
    
    document.getElementById(
        'nota-contenido'
    ).innerHTML = contenidoHTML;

    // ============================================================
    // GALERÍA
    // ============================================================
    
    const galeria = document.getElementById('gallery');
    
    if (galeria) {
    
        const nombreGaleria = galeria.dataset.gallery;
    
        console.log(
            'Galería:',
            nombreGaleria
        );
    
        // URL del galleries.json de esta edición
        const urlGalleriesJSON =
            `${urlEdicion}galleries.json`;
    
        try {
    
            const respuestaGalerias =
                await fetch(urlGalleriesJSON);
    
            if (!respuestaGalerias.ok) {
    
                throw new Error(
                    `No se pudo cargar ${urlGalleriesJSON}: HTTP ${respuestaGalerias.status}`
                );
            }
    
            const galleries =
                await respuestaGalerias.json();
    
            const imagenes =
                galleries[nombreGaleria];
    
            if (!imagenes || imagenes.length === 0) {
    
                console.warn(
                    `No se encontraron imágenes para la galería "${nombreGaleria}".`
                );
    
                galeria.remove();
    
            } else {
    
                const urlGaleria =
                    `${urlEdicion}galleries/${nombreGaleria}/`;
    
                galeria.innerHTML = '';
    
                imagenes.forEach((archivo, indice) => {
    
                    const img = document.createElement('img');
    
                    img.src =
                        `${urlGaleria}${archivo}`;
    
                    img.alt =
                        `Imagen ${indice + 1}`;
    
                    img.loading = 'lazy';
    
                    galeria.appendChild(img);
    
                });
    
                console.log(
                    `Galería "${nombreGaleria}": ${imagenes.length} imágenes`
                );
            }
    
        } catch (error) {
    
            console.error(
                'Error al cargar la galería:',
                error
            );
    
            galeria.remove();
        }
    }

    // Eliminar imagen si no existe
    const contenedorImagen = document.getElementById('nota-imagen');
    const imagen = contenedorImagen?.querySelector('img');
    
    if (imagen) {
        imagen.addEventListener('error', function () {
            contenedorImagen.remove();
        });
    }

    document.querySelectorAll('.imagen-interior').forEach(img => {
    if (img.complete) {
        if (img.naturalWidth < 400) {
            img.classList.add('reducir');
        }
    } else {
        img.addEventListener('load', function () {
            if (this.naturalWidth < 400) {
                this.classList.add('reducir');
            }
        });
    }
});


    // ============================================================
    // NAVEGACIÓN
    // ============================================================

    mostrarNavegacion(
        nota,
        notas,
        numeroEdicion
    );
}


function mostrarNavegacion(
    nota,
    notas,
    numeroEdicion
) {

    const navegacion =
        document.getElementById('nota-navegacion');

    if (!navegacion) {
        return;
    }


    // ============================================================
    // POSICIÓN DE LA NOTA
    // ============================================================

    const indiceActual =
        notas.findIndex(
            n =>
                String(n.id) ===
                String(nota.id)
        );


    if (indiceActual === -1) {

        navegacion.innerHTML = '';

        return;
    }


    // ============================================================
    // NOTA ANTERIOR
    // ============================================================

    const notaAnterior =
        indiceActual > 0
            ? notas[indiceActual - 1]
            : null;


    // ============================================================
    // NOTA SIGUIENTE
    // ============================================================

    const notaSiguiente =
        indiceActual < notas.length - 1
            ? notas[indiceActual + 1]
            : null;


    // ============================================================
    // ¿ES LA ÚLTIMA?
    // ============================================================

    const esUltimaNota =
        indiceActual === notas.length - 1;


    // ============================================================
    // CONSTRUIR NAVEGACIÓN
    // ============================================================

    navegacion.innerHTML = `

        <div class="nota-anterior">

            ${
                notaAnterior
                    ? `
                        <a
                            href="nota.html?edicion=${numeroEdicion}&id=${encodeURIComponent(notaAnterior.id)}"
                        >
                            ← Anterior
                        </a>
                      `
                    : ''
            }

        </div>


        <div class="nota-siguiente">

            ${
                notaSiguiente
                    ? `
                        <a
                            href="nota.html?edicion=${numeroEdicion}&id=${encodeURIComponent(notaSiguiente.id)}"
                        >
                            Siguiente →
                        </a>
                      `
                    : ''
            }


            ${
                esUltimaNota
                    ? `
                        <a
                            href="contratapa.html?edicion=${numeroEdicion}"
                            class="link-contratapa"
                        >
                            Contratapa →
                        </a>
                      `
                    : ''
            }

        </div>

    `;
}
