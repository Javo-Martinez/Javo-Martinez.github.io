SET NOCOUNT ON;

SELECT
    e.edicionNumero AS numero,

    CAST(NULL AS nvarchar(500)) AS ruta_repositorio,

    CAST(NULL AS nvarchar(max)) AS editorial,

    CAST(NULL AS nvarchar(1000)) AS contratapa,

    JSON_QUERY((
        SELECT
            f.seccion AS nombre,
            CAST(NULL AS varchar(50)) AS color_seccion,
            f.frase AS frase_encabezado,
            f.autorFrase AS autor_frase

        FROM dbo.frases f

        WHERE f.edicionNumero = e.edicionNumero

        ORDER BY f.ID

        FOR JSON PATH
    )) AS secciones_config,

    JSON_QUERY((
        SELECT
            CAST(n.id AS varchar(50)) AS id,
            n.ordenEnIndice AS id_nota,
            p.id_Pagina,
            n.tag,
            n.titulo,
            n.entradilla,
            n.autor,
            p.seccion,
            CAST('' AS nvarchar(max)) AS contenido_html,
            p.id_Pagina AS imagen_destacada

        FROM dbo.notas n

        INNER JOIN dbo.pagina p
            ON p.id_pagina = n.idPagina
            AND p.edicionNumero = n.edicionNumero

        WHERE n.edicionNumero = e.edicionNumero
          and n.tipoNota = 'P'

        ORDER BY n.ordenEnIndice, n.id

        FOR JSON PATH
    )) AS notas

FROM (
    SELECT DISTINCT edicionNumero
    FROM dbo.notas

    UNION

    SELECT DISTINCT edicionNumero
    FROM dbo.frases
) e

ORDER BY e.edicionNumero DESC

FOR JSON PATH, ROOT('ediciones');