const JSON_URL = './revista.json';
document.addEventListener( 'DOMContentLoaded', cargarNota );
async function cargarNota()  {
  try  {
    const params = new URLSearchParams( window.location.search );
    const numeroEdicion = Number( params.get('edicion') );
    const idNota = params.get('id');
    if (!numeroEdicion || !idNota)  {
      throw new Error( 'Faltan parámetros en la URL.' );
    }
    const respuesta = await fetch(JSON_URL);
    if (!respuesta.ok)  {
      throw new Error( `Error HTTP: ${respuesta.status}` );
    }
    const datos = await respuesta.json();
    const edicion = datos.ediciones.find( ed => Number(ed.numero) === numeroEdicion );
    if (!edicion)  {
      throw new Error( `No se encontró la edición ${numeroEdicion}.` );
    }
    const nota = edicion.notas.find( n => String(n.id) === String(idNota) );
    if (!nota)  {
      throw new Error( `No se encontró la nota ${idNota}.` );
    }
    const seccion = edicion.secciones_config.find( s => s.nombre === nota.seccion );
    mostrarNota(
    nota,
    seccion,
    edicion.notas,
    numeroEdicion
    );
  } catch (error)  {
    console.error( 'Error al cargar la nota:', error );
    document.getElementById( 'nota' ).innerHTML = ` <h1> No se pudo cargar la nota </h1> <p> ${error.message} </p> <p> <a href="indice.html"> ← Volver al índice </a> </p> `;
  }
}
function mostrarNota( 
    nota,
    seccion,
    notas,
    numeroEdicion)  {
  const colorSeccion = seccion?.color_seccion || '#999999';
  document.title = `${nota.titulo || 'Nota'} - Revista`;
  const elementoSeccion = document.getElementById( 'nota-seccion' );
  elementoSeccion.textContent = nota.seccion || '';
  elementoSeccion.style.backgroundColor = colorSeccion;
  const elementoTag = document.getElementById( 'nota-tag' );
  if (nota.tag)  {
    elementoTag.textContent = nota.tag;
  } else  {
    elementoTag.style.display = 'none';
  }
  document.getElementById( 'nota-titulo' ).textContent = nota.titulo || '';
  const elementoAutor = document.getElementById( 'nota-autor' );
  if (nota.autor)  {
    elementoAutor.textContent = `Por ${nota.autor}`;
  } else  {
    elementoAutor.style.display = 'none';
  }
  const elementoEntradilla = document.getElementById( 'nota-entradilla' );
  if (nota.entradilla)  {
    elementoEntradilla.textContent = nota.entradilla;
  } else  {
    elementoEntradilla.style.display = 'none';
  }
  const elementoImagen = document.getElementById( 'nota-imagen' );
  if (nota.imagen_destacada)  {
    elementoImagen.innerHTML = ` <img src="${nota.imagen_destacada}" alt="${nota.titulo || ''}" > `;
  } else  {
    elementoImagen.style.display = 'none';
  }

  
  //document.getElementById( 'nota-contenido' ).innerHTML = nota.contenido_html || '';    

  
  let urlContenido = '';

  if (numeroEdicion >= 27 && numeroEdicion <= 40) {
      urlContenido = `/eneur-27-40/revista${numFormateado}/content/${nota.id_pagina}.php`;
  }
  else if (numeroEdicion >= 41 && numeroEdicion <= 50) {
      urlContenido = `/eneur-41-60/revista${numFormateado}/content/${nota.id_pagina}.php`;
  }
  else if (numeroEdicion >= 51 && numeroEdicion <= 60) {
      urlContenido = `/eneur-51-60/revista${numFormateado}/content/${nota.id_pagina}.php`;
  }
  else if (numeroEdicion >= 61 && numeroEdicion <= 70) {
      urlContenido = `/eneur-61-70/revista${numFormateado}/content/${nota.id_pagina}.php`;
  }
  else if (numeroEdicion >= 71 && numeroEdicion <= 80) {
      urlContenido = `/eneur-71-80/revista${numFormateado}/content/${nota.id_pagina}.php`;
  }
  else if (numeroEdicion >= 81 && numeroEdicion <= 90) {
      urlContenido = `/eneur-81-90/revista${numFormateado}/content/${nota.id_pagina}.php`;
  }
  else if (numeroEdicion >= 91 && numeroEdicion <= 100) {
      urlContenido = `/eneur-91-00/revista${numFormateado}/content/${nota.id_pagina}.php`;
  }
  
  if (!urlContenido) {
      throw new Error(`No se encontró una ruta de contenido para la edición ${numeroEdicion}.`);
  }
  
  const respuestaContenido = await fetch(urlContenido);
  
  if (!respuestaContenido.ok) {
      throw new Error(
          `No se pudo cargar el contenido de ${urlContenido}: HTTP ${respuestaContenido.status}`
      );
  }
  
  const contenidoHTML = await respuestaContenido.text();
  
  document.getElementById('nota-contenido').innerHTML = contenidoHTML;
  
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

    if (!navegacion) return;


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


    const notaAnterior =
        indiceActual > 0
            ? notas[indiceActual - 1]
            : null;


    const notaSiguiente =
        indiceActual < notas.length - 1
            ? notas[indiceActual + 1]
            : null;


    const esUltimaNota =
        indiceActual === notas.length - 1;


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
