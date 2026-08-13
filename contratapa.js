const JSON_URL = './revista.json';

document.addEventListener(
    'DOMContentLoaded',
    cargarContratapa
);


async function cargarContratapa() {

    try {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const numeroEdicion =
            Number(
                params.get('edicion')
            );


        if (!numeroEdicion) {

            throw new Error(
                'No se indicó la edición.'
            );

        }


        const respuesta =
            await fetch(JSON_URL);


        if (!respuesta.ok) {

            throw new Error(
                `Error HTTP: ${respuesta.status}`
            );

        }


        const datos =
            await respuesta.json();


        const edicion =
            datos.ediciones.find(
                ed =>
                    Number(ed.numero) ===
                    numeroEdicion
            );


        if (!edicion) {

            throw new Error(
                `No se encontró la edición ${numeroEdicion}.`
            );

        }


        mostrarContratapa(edicion);


    } catch (error) {

        console.error(
            'Error al cargar la contratapa:',
            error
        );


        document.getElementById(
            'contratapa'
        ).innerHTML = `

            <h1>
                No se pudo cargar la contratapa
            </h1>

            <p>
                ${error.message}
            </p>

            <p>
                <a href="indice.html">
                    ← Volver al índice
                </a>
            </p>

        `;

    }

}


function mostrarContratapa(edicion) {

    const contenedor =
        document.getElementById(
            'contratapa'
        );


    /*
     * Acá usamos la imagen de la edición.
     *
     * Si en tu JSON la propiedad tiene otro nombre,
     * solo hay que cambiar "imagen" por el nombre
     * correspondiente.
     */

    const imagen =
        edicion.imagen;


    if (!imagen) {

        contenedor.innerHTML = `

            <p>
                Esta edición no tiene imagen de contratapa.
            </p>

        `;

        return;

    }


    document.title =
        `Contratapa - Edición ${edicion.numero}`;


    contenedor.innerHTML = `

        <img
            src="${imagen}"
            alt="Contratapa de la edición ${edicion.numero}"
        >

    `;

}
