const JSON_URL = './numeros.json';

const ULTIMO_NUMERO_EDITADO = 40;

document.addEventListener('DOMContentLoaded', cargarNumeros);

async function cargarNumeros() {

try {

    const respuesta = await fetch(JSON_URL);

    if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const catalogoNumeros = await respuesta.json();

    if (!Array.isArray(catalogoNumeros)) {
        throw new Error('numeros.json no contiene un array.');
    }

    /*
     * Solo mostramos números que ya fueron editados.
     * El número 29 no aparece porque no existe en numeros.json.
     */
    const numerosDisponibles = catalogoNumeros
        .filter(numero =>
            Number(numero.numero) <= ULTIMO_NUMERO_EDITADO
        )
        .sort((a, b) =>
            Number(a.numero) - Number(b.numero)
        );

    mostrarNumeros(numerosDisponibles);

} catch (error) {

    console.error('Error al cargar los números:', error);

    document.getElementById('numeros-revista').innerHTML =
        '<p>No se pudieron cargar los números de la revista.</p>';
}

}

/*
* Devuelve la ruta de la miniportadasegún el número de edición.
*/

function obtenerRutaMiniportada(numero, imagen) {

    return `eneur-portadas/${imagen}`;
}

/*
 * Devuelve la URL de destino según el número de edición.
 */
function obtenerUrlDestino(numero) {

    const numFormateado =
        String(numero).padStart(2, '0');

    /*
     * Ediciones 1 a 10
     */
    if (numero >= 1 && numero <= 10) {
        return `/eneur-01-10/revista${numFormateado}/index.html`;
    }

    /*
     * Ediciones 11 a 20
     */
    if (numero >= 11 && numero <= 20) {
        return `/eneur-11-20/revista${numFormateado}/index.html`;
    }

    /*
     * Ediciones 21 a 26
     */
    if (numero >= 21 && numero <= 26) {
        return `/eneur-21-26/revista${numFormateado}/index.html`;
    }

    /*
     * Ediciones 27 en adelante
     */
    if (numero >= 27) {
        return `/indice.html?num=${numero}`;
    }

    return '#';
}


/*
* Genera la grilla de números.
*/
function mostrarNumeros(numeros) {

const contenedor =
document.getElementById('numeros-revista');

contenedor.innerHTML = '';

numeros.forEach(numero => {

 const numeroEdicion =
     Number(numero.numero);

 const rutaImagen =
     obtenerRutaMiniportada(
         numeroEdicion,
         numero.imagen
     );


 if (!rutaImagen) {
     return;
 }


 /*
  * Tarjeta correspondiente a cada número.
  */
 const tarjeta =
     document.createElement('article');

 tarjeta.className =
     'numero-revista';


 /*
  * Enlace hacia el índice de la edición.
  */
 const enlace =
     document.createElement('a');

 enlace.href =
    obtenerUrlDestino(numeroEdicion);

 enlace.className =
     'numero-revista-enlace';


 /*
  * Miniportada.
  */
 const imagen =
     document.createElement('img');

 imagen.src =
     rutaImagen;

 imagen.alt =
     `Edición ${numeroEdicion} - ${numero.titulo}`;


 /*
  * Número de edición.
  */
 const numeroTitulo =
     document.createElement('h3');

 numeroTitulo.textContent =
     `ENEUR ${numeroEdicion}`;


 /*
  * Título.
  */
 const titulo =
     document.createElement('p');

 titulo.textContent =
     numero.titulo;


 enlace.appendChild(imagen);
 enlace.appendChild(numeroTitulo);
 enlace.appendChild(titulo);

 tarjeta.appendChild(enlace);

 contenedor.appendChild(tarjeta);

});

}
