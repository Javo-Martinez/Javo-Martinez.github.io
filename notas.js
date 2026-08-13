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
    mostrarNota( nota, seccion );
  } catch (error)  {
    console.error( 'Error al cargar la nota:', error );
    document.getElementById( 'nota' ).innerHTML = ` <h1> No se pudo cargar la nota </h1> <p> ${error.message} </p> <p> <a href="indice.html"> ← Volver al índice </a> </p> `;
  }
}
function mostrarNota( nota, seccion )  {
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
  document.getElementById( 'nota-contenido' ).innerHTML = nota.contenido_html || '';
}
