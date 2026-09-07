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
function mostrarContratapa(edicion) {
const contenedor =
    document.getElementById('contratapa');

const numeroEdicion =
    Number(edicion.numero);

const numFormateado =
    String(numeroEdicion).padStart(2, '0');

const imagen =
    edicion.contratapa;

if (!imagen) {

    contenedor.innerHTML =
        `<p>Esta edición no tiene contratapa.</p>`;

    return;
}

let urlImagen = '';

if (numeroEdicion >= 27 && numeroEdicion <= 40) {

    urlImagen =
        `/eneur-27-40/revista${numFormateado}/images/${imagen}`;

}
else if (numeroEdicion >= 41 && numeroEdicion <= 50) {

    urlImagen =
        `/eneur-41-50/revista${numFormateado}/images/${imagen}`;

}
else if (numeroEdicion >= 51 && numeroEdicion <= 60) {

    urlImagen =
        `/eneur-51-60/revista${numFormateado}/images/${imagen}`;

}
else if (numeroEdicion >= 61 && numeroEdicion <= 70) {

    urlImagen =
        `/eneur-61-70/revista${numFormateado}/images/${imagen}`;

}
else if (numeroEdicion >= 71 && numeroEdicion <= 80) {

    urlImagen =
        `/eneur-71-80/revista${numFormateado}/images/${imagen}`;

}
else if (numeroEdicion >= 81 && numeroEdicion <= 90) {

    urlImagen =
        `/eneur-81-90/revista${numFormateado}/images/${imagen}`;

}
else if (numeroEdicion >= 91 && numeroEdicion <= 100) {

    urlImagen =
        `/eneur-91-00/revista${numFormateado}/images/${imagen}`;

}

if (!urlImagen) {

    contenedor.innerHTML =
        `<p>No se encontró la ruta de la contratapa.</p>`;

    return;
}

document.title =
    `Contratapa - Edición ${numeroEdicion}`;

contenedor.innerHTML = `
    <img
        src="${urlImagen}"
        alt="Contratapa"
    >
`;
}
