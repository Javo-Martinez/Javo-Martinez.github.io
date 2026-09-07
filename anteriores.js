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

    const numFormateado =
        String(numero).padStart(2, '0');

    if (numero >= 1 && numero <= 26) {
        return `eneur-portadas/${imagen}`;
    }

    if (numero >= 27 && numero <= 40) {
        return `eneur-27-40/revista${numFormateado}/images/${imagen}`;
    }

    if (numero >= 41 && numero <= 50) {
        return `eneur-41-50/revista${numFormateado}/images/${imagen}`;
    }

    if (numero >= 51 && numero <= 60) {
        return `eneur-51-60/revista${numFormateado}/images/${imagen}`;
    }

    if (numero >= 61 && numero <= 70) {
        return `eneur-61-70/revista${numFormateado}/images/${imagen}`;
    }

    if (numero >= 71 && numero <= 80) {
        return `eneur-71-80/revista${numFormateado}/images/${imagen}`;
    }

    if (numero >= 81 && numero <= 90) {
        return `eneur-81-90/revista${numFormateado}/images/${imagen}`;
    }

    if (numero >= 91 && numero <= 100) {
        return `eneur-91-100/revista${numFormateado}/images/${imagen}`;
    }

    return '';
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
     `indice.html?edicion=${numeroEdicion}`;

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
     document.createElement('h2');

 numeroTitulo.textContent =
     `N.º ${numeroEdicion}`;


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
