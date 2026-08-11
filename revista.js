const JSON_URL = './revista.json';

function obtenerClaseSeccion(seccion) {
    if (!seccion) return 'seccion-general';
    var nombreLimpio = seccion.toLowerCase().trim();
    if (nombreLimpio === 'miradas') return 'seccion-miradas';
    if (nombreLimpio === 'sonoridades') return 'seccion-sonoridades';
    if (nombreLimpio === 'blablablá' || nombreLimpio === 'blablabla') return 'seccion-blablabla';
    if (nombreLimpio === 'escritos') return 'seccion-escritos';
    if (nombreLimpio === 'sabores') return 'seccion-sabores';
    return 'seccion-general';
}

function obtenerParametroURL(nombre) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre);
}

document.addEventListener("DOMContentLoaded", async () => {
    try {
        const respuesta = await fetch(JSON_URL);
        if (!respuesta.ok) throw new Error("No se pudo cargar el JSON");
        const ediciones = await respuesta.json();
        
        const path = window.location.pathname;
        const pagina = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

        if (pagina === 'index.html') cargarPortada(ediciones);
        else if (pagina === 'indice.html') cargarIndice(ediciones);
        else if (pagina === 'articulo.html') cargarArticulo(ediciones);
        else if (pagina === 'anteriores.html') cargarAnteriores(ediciones);
        else if (pagina === 'contratapa.html') cargarContratapa(ediciones);
    } catch (error) {
        console.error("Error en la revista:", error);
    }
});

function cargarPortada(ediciones) {
    // Tomamos la edición más reciente de la lista automáticamente
    const edicionVigente = ediciones[0]; 
    if (!edicionVigente) return;

    // 1. Inyectamos los textos y poemas dinámicos de esa edición
    if(document.getElementById('img-tapa')) document.getElementById('img-tapa').src = edicionVigente.portada.imagen_tapa;
    if(document.getElementById('texto-poema')) document.getElementById('texto-poema').innerHTML = edicionVigente.portada.texto_poema.replace(/\n/g, '<br>');
    if(document.getElementById('copy-portada')) document.getElementById('copy-portada').innerText = edicionVigente.portada.copy_portada;
    
    // 2. Cambiamos el comportamiento del botón "INGRESAR" según el número:
    const btnIngresar = document.getElementById('btn-ingresar');
    if (btnIngresar) {
        if (edicionVigente.id_numero <= 30) {
            // Si la vigente es una vieja, el botón apunta a su carpeta física XHTML
            var numFormateado = String(edicionVigente.id_numero).padStart(2, '0');
            btnIngresar.href = 'revista' + numFormateado + '/indice.html';
        } else {
            // Si es de las nuevas (31+), apunta al índice dinámico moderno
            btnIngresar.href = 'indice.html?num=' + edicionVigente.id_numero;
        }
    }
}

function cargarIndice(ediciones) {
    const numBuscado = parseInt(obtenerParametroURL('num')) || 1;
    const seccionFiltro = obtenerParametroURL('seccion');
    const edicion = ediciones.find(e => e.id_numero === numBuscado);
    if (!edicion) return;

    if(document.getElementById('editorial-texto')) document.getElementById('editorial-texto').innerHTML = edicion.editorial;
    
    const staffContenedor = document.getElementById('staff-lista');
    if (staffContenedor && edicion.staff_colaboradores) {
        staffContenedor.innerHTML = '';
        edicion.staff_colaboradores.forEach(c => {
            staffContenedor.innerHTML += '<li><strong>' + c.nombre + '</strong> (' + c.rol + ')</li>';
        });
    }

    const notasContenedor = document.getElementById('notas-grilla');
    if (notasContenedor) {
        notasContenedor.innerHTML = '';
        let arts = edicion.articulos;
        if (seccionFiltro) arts = edicion.articulos.filter(a => a.seccion.toLowerCase() === seccionFiltro.toLowerCase());

        arts.forEach(art => {
            const bloque = document.createElement('div');
            const claseSeccion = obtenerClaseSeccion(art.seccion);
            bloque.className = 'elemento-compuesto ' + claseSeccion;
            
            let textoAutor = '';
            if (art.autor !== '') {
                textoAutor = '<p class="autor-nota">Por: ' + art.autor + '</p>';
            }
            
            bloque.innerHTML = '<a href="articulo.html?id=' + art.id_article + '" class="link-completo">' +
                    '<span class="etiqueta-seccion">' + art.seccion + '</span>' +
                    '<h3 class="titulo-nota">' + art.titulo + '</h3>' +
                    textoAutor +
                    '<img src="' + art.imagen_principal + '" class="img-nota">' +
                    '<p class="copete-nota">' + art.copete + '</p>' +
                    '<span class="frase-corta">' + art.frase_corta + '</span>' +
                '</a>';
            notasContenedor.appendChild(bloque);
        });
    }
    if(document.getElementById('link-contratapa')) document.getElementById('link-contratapa').href = 'contratapa.html?num=' + edicion.id_numero;
}

function cargarArticulo(ediciones) {
    const idBuscado = parseInt(obtenerParametroURL('id'));
    let art = null;
    for (const ed of ediciones) {
        art = ed.articulos.find(a => a.id_article === idBuscado);
        if (art) break;
    }
    if (!art) return;

    if(document.getElementById('articulo-pagina')) document.getElementById('articulo-pagina').className = obtenerClaseSeccion(art.seccion);
    if(document.getElementById('art-titulo')) document.getElementById('art-titulo').innerText = art.titulo;
    if(document.getElementById('art-copete')) document.getElementById('art-copete').innerText = art.copete;
    if(document.getElementById('art-imagen')) document.getElementById('art-imagen').src = art.imagen_principal;
    if(document.getElementById('art-contenido')) document.getElementById('art-contenido').innerHTML = art.contenido_html;
    if(document.getElementById('art-autor')) document.getElementById('art-autor').innerText = art.autor !== "" ? 'Por: ' + art.autor : "";
}

function cargarAnteriores(ediciones) {
    const contenedor = document.getElementById('grilla-anteriores');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    ediciones.forEach(ed => {
        contenedor.innerHTML += '<div class="miniatura-edicion">' +
                '<a href="indice.html?num=' + ed.id_numero + '">' +
                    '<img src="' + ed.portada.imagen_tapa + '">' +
                    '<h4>' + ed.titulo_numero + '</h4>' +
                '</a>' +
            '</div>';
    });
}

// (Punto 9 de tus requerimientos resuelto de forma segura sin comillas francesas)
function cargarContratapa(ediciones) {
    const numBuscado = parseInt(obtenerParametroURL('num')) || 1;
    const ed = ediciones.find(e => e.id_numero === numBuscado);
    if (!ed) return;
    if(document.getElementById('contra-titulo')) document.getElementById('contra-titulo').innerText = ed.contratapa.titulo;
    if(document.getElementById('contra-numero')) document.getElementById('contra-numero').innerText = 'Edición Nro ' + ed.id_numero;
    if(document.getElementById('contra-imagen')) document.getElementById('contra-imagen').src = ed.contratapa.imagen_alusiva;
}
