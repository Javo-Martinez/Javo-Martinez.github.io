const JSON_URL = './revista.json';
document.addEventListener( 'DOMContentLoaded', cargarContratapa );
async function cargarContratapa()  {
  try  {
    const params = new URLSearchParams( window.location.search );
    const numeroEdicion = Number( params.get('edicion') );
    if (!numeroEdicion)  {
      throw new Error( 'No se indicó la edición.' );
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
    mostrarContratapa(edicion);
  } catch (error)  {
    console.error( 'Error al cargar la contratapa:', error );
    document.getElementById( 'contratapa' ).innerHTML = ` <p> No se pudo cargar la contratapa. </p> `;
  }
}
function mostrarContratapa(edicion)  {
  const contenedor = document.getElementById( 'contratapa' );
  const imagen = edicion.contratapa;
  if (!imagen)  {
    contenedor.innerHTML = ` <p> Esta edición no tiene contratapa. </p> `;
    return;
  }
  document.title = `Contratapa - Edición ${edicion.numero}`;
  contenedor.innerHTML = ` <img src="${imagen}" alt="Contratapa" > `;
}
