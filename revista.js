const JSON_URL = './revista.json';
/* * Convierte el nombre de la sección * en una clase CSS. * * Ejemplos: * * "Escritos" → "seccion-escritos" * "Miradas" → "seccion-miradas" * "Artes Visuales" → "seccion-artes-visuales" */
function obtenerClaseSeccion(seccion)  {
  if (!seccion)  {
    return '';
  }
  return 'seccion-' + seccion .toLowerCase() .normalize('NFD') .replace(/[\u0300-\u036f]/g, '') .replace(/\s+/g, '-');
}
document.addEventListener( 'DOMContentLoaded', cargarIndice );
async function cargarIndice()  {
  try  {
    const params = new URLSearchParams( window.location.search );
    const numeroEdicion = Number( params.get('num') );
    if (!numeroEdicion)  {
      throw new Error( 'No se indicó el número de edición.' );
    }
    const respuesta = await fetch(JSON_URL);
    if (!respuesta.ok)  {
      throw new Error( `Error HTTP: ${respuesta.status}` );
    }
    const datos = await respuesta.json();
    if (!Array.isArray(datos.ediciones))  {
      throw new Error( 'La propiedad "ediciones" no es un array.' );
    }
    const edicion = datos.ediciones.find( ed => Number(ed.numero) === numeroEdicion );
    if (!edicion)  {
      throw new Error( `No se encontró la edición ${numeroEdicion}.` );
    }
    const notasOrdenadas = [...(edicion.notas || [])].sort(
    (a, b) => Number(a.id_nota) - Number(b.id_nota)
    );
    mostrarEditorial(edicion.editorial);
    mostrarNotas(notasOrdenadas, numeroEdicion);
    //mostrarNotas( edicion.notas || [], numeroEdicion );
  } catch (error)  {
    console.error( 'Error en la revista:', error );
  }
}
/* * Editorial */
function mostrarEditorial(editorial)  {
  const contenedor = document.getElementById( 'editorial' );
  if (!contenedor)  {
    return;
  }
  contenedor.innerHTML = ` <h2>Editorial</h2> <div class="editorial-contenido"> ${editorial || ''} </div> `;
}
/* * Grilla de notas */
function mostrarNotas( notas, numeroEdicion )  {
  
  const contenedor = document.getElementById( 'indice-notas' );
  const numFormateado = String(numeroEdicion).padStart(2, '0');

  // ============================================================
  // URL DE LA IMAGEN
  // ============================================================

 
  if (!contenedor)  {
    console.error( 'No existe el elemento #indice-notas en indice.html' );
    return;
  }
  contenedor.innerHTML = '';
  notas.forEach(nota =>  {
    const claseSeccion = obtenerClaseSeccion( nota.seccion );
    let urlImage = '';
      if (numeroEdicion >= 27 && numeroEdicion <= 40) {
         urlImage = `/eneur-27-40/revista${numFormateado}/images/${nota.id_nota}.jpg`;
      }
    const tarjeta = document.createElement( 'article' );
    tarjeta.className = 'nota-card';
    tarjeta.innerHTML = `

    <a
        href="nota.html?edicion=${numeroEdicion}&id=${encodeURIComponent(nota.id)}"
        class="nota-link"
    >

        <div class="nota-imagen">

            <img
                src="${urlImage || ''}"
                alt="${nota.titulo || ''}"
                loading="lazy"
            >

        </div>


        <div class="nota-contenido">

            <div class="nota-seccion ${claseSeccion}">
                ${nota.seccion || ''}
            </div>


            ${nota.tag ? `
                <div class="nota-tag">
                    ${nota.tag}
                </div>
            ` : ''}


            <h3 class="nota-titulo">
                ${nota.titulo || ''}
            </h3>


            ${nota.entradilla ? `
                <p class="nota-entradilla">
                    ${nota.entradilla}
                </p>
            ` : ''}


            ${nota.autor ? `
                <div class="nota-autor">
                    ${nota.autor}
                </div>
            ` : ''}

        </div>

    </a>
    `;
    contenedor.appendChild( tarjeta );
  }
  );
}
