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
        `${nota.titulo || 'Nota'} - Revista`;


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
    // TAG
    // ============================================================

    const elementoTag =
        document.getElementById('nota-tag');

    if (nota.tag) {

        elementoTag.textContent =
            nota.tag;

    } else {

        elementoTag.style.display =
            'none';
    }


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

        elementoImagen.innerHTML = `
            <img
                src="${nota.imagen_destacada}"
                alt="${nota.titulo || ''}"
            >
        `;

    } else {

        elementoImagen.style.display =
            'none';
    }


    // ============================================================
    // URL DEL CONTENIDO PHP
    // ============================================================

    let urlContenido = '';


    if (
        numeroEdicion >= 27 &&
        numeroEdicion <= 40
    ) {

        urlContenido =
            `/eneur-27-40/revista${numFormateado}/content/${nota.id_pagina}.php`;

    }

    else if (
        numeroEdicion >= 41 &&
        numeroEdicion <= 60
    ) {

        urlContenido =
            `/eneur-41-60/revista${numFormateado}/content/${nota.id_pagina}.php`;

    }

    else if (
        numeroEdicion >= 61 &&
        numeroEdicion <= 70
    ) {

        urlContenido =
            `/eneur-61-70/revista${numFormateado}/content/${nota.id_pagina}.php`;

    }

    else if (
        numeroEdicion >= 71 &&
        numeroEdicion <= 80
    ) {

        urlContenido =
            `/eneur-71-80/revista${numFormateado}/content/${nota.id_pagina}.php`;

    }

    else if (
        numeroEdicion >= 81 &&
        numeroEdicion <= 90
    ) {

        urlContenido =
            `/eneur-81-90/revista${numFormateado}/content/${nota.id_pagina}.php`;

    }

    else if (
        numeroEdicion >= 91 &&
        numeroEdicion <= 99
    ) {

        urlContenido =
            `/eneur-91-00/revista${numFormateado}/content/${nota.id_pagina}.php`;
    }


    // ============================================================
    // VALIDAR URL
    // ============================================================

    if (!urlContenido) {

        throw new Error(
            `No se encontró una ruta de contenido para la edición ${numeroEdicion}.`
        );
    }


    // ============================================================
    // CARGAR PHP
    // ============================================================

    console.log(
        'Cargando contenido:',
        urlContenido
    );


    const respuestaContenido =
        await fetch(urlContenido);


    if (!respuestaContenido.ok) {

        throw new Error(
            `No se pudo cargar el contenido de ${urlContenido}: HTTP ${respuestaContenido.status}`
        );
    }


    // ============================================================
    // INSERTAR HTML
    // ============================================================

    const contenidoHTML =
        await respuestaContenido.text();


    document.getElementById(
        'nota-contenido'
    ).innerHTML = contenidoHTML;


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
