import os
import re

# ==========================================================================
# CONFIGURACIÓN DE LAS NUEVAS RUTAS DE TU SERVIDOR SATÉLITE
# ==========================================================================
URL_SATELITE_FOTOS = "https://github.io"

def actualizar_archivo_html(ruta_archivo):
    """Busca rutas locales de imágenes y las cambia por la URL del servidor satélite"""
    with open(ruta_archivo, "r", encoding="iso-8859-1") as f:
        contenido = f.read()

    # Patrón para buscar etiquetas del tipo src="images/foto.jpg" o src='images/foto.jpg'
    # Evita duplicar si la URL ya se había actualizado antes
    contenido_nuevo = re.sub(
        r'src=["\'](images/|./images/)([^"\']+)["\']',
        f'src="{URL_SATELITE_FOTOS}\\2"',
        contenido
    )

    if contenido != contenido_nuevo:
        with open(ruta_archivo, "w", encoding="iso-8859-1") as f:
            f.write(contenido_nuevo)
        print(f"✅ Rutas de imágenes actualizadas en: {os.path.basename(ruta_archivo)}")

def actualizar_base_datos_json(ruta_json):
    """Actualiza las rutas de las imágenes dentro de tu archivo central revista.json"""
    if not os.path.exists(ruta_json):
        return
    
    with open(ruta_json, "r", encoding="utf-8") as f:
        contenido = f.read()

    # Reemplaza las rutas locales en el JSON por la URL del servidor satélite
    contenido_nuevo = re.sub(
        r'"images/([^"]+)"',
        f'"{URL_SATELITE_FOTOS}\\1"',
        contenido
    )

    if contenido != contenido_nuevo:
        with open(ruta_json, "w", encoding="utf-8") as f:
            f.write(contenido_nuevo)
        print("✅ Base de datos 'revista.json' actualizada con las nuevas rutas web.")

def procesar_edicion_uno():
    print("🚀 Iniciando la migración masiva de rutas hacia el repositorio satélite...")
    
    # Carpeta física donde están tus HTML históricos del número 1
    carpeta_revista = "revista01"
    
    if os.path.exists(carpeta_revista):
        for archivo in os.listdir(carpeta_revista):
            if archivo.endswith(".html"):
                ruta_completa = os.path.join(carpeta_revista, archivo)
                actualizar_archivo_html(ruta_completa)
    else:
        print(f"❌ No se encontró la carpeta '{carpeta_revista}' en este directorio.")

    # También actualizamos el JSON central para que el nuevo índice sepa de dónde bajar las fotos
    actualizar_base_datos_json("revista.json")
    print("\n🎉 Proceso finalizado. Todas las imágenes ahora apuntan a eneur-img-01.")

if __name__ == "__main__":
    procesar_edicion_uno()
