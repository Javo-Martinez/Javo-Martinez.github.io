import os
import re

# ==========================================================================
# LA URL REAL Y LIMPIA DE TU SERVIDOR SATÉLITE
# ==========================================================================
URL_CORRECTA = "https://github.io"

def reparar_archivo_html(ruta_archivo):
    """Busca cualquier variante pegoteada de github.io y la sana por completo"""
    with open(ruta_archivo, "r", encoding="iso-8859-1") as f:
        contenido = f.read()

    # Expresión regular inteligente: busca src="https://github.ioCUALQUIER_COSA.extensión"
    # Captura todo lo que esté después de github.io hasta cerrar la comilla
    patron_roto = r'src=["\']https://github\.io([^"\']+\.(jpg|jpeg|png|gif|png|PNG|JPG))["\']'
    
    # Reemplazamos inyectando la URL correcta más el nombre limpio capturado
    contenido_nuevo = re.sub(
        patron_roto,
        f'src="{URL_CORRECTA}\\1"',
        contenido
    )

    if contenido != contenido_nuevo:
        with open(ruta_archivo, "w", encoding="iso-8859-1") as f:
            f.write(contenido_nuevo)
        print(f"✅ Enlace sanado con éxito en: {os.path.basename(ruta_archivo)}")

def reparar_base_datos_json(ruta_json):
    """Corrige el pegoteo de las fotos adentro del archivo central revista.json"""
    if not os.path.exists(ruta_json):
        return
    
    with open(ruta_json, "r", encoding="utf-8") as f:
        contenido = f.read()

    patron_json = r'"https://github\.io([^"]+\.(jpg|jpeg|png|gif|png|PNG|JPG))"'
    contenido_nuevo = re.sub(
        patron_json,
        f'"{URL_CORRECTA}\\1"',
        contenido
    )

    if contenido != contenido_nuevo:
        with open(ruta_json, "w", encoding="utf-8") as f:
            f.write(contenido_nuevo)
        print("✅ Base de datos 'revista.json' sanada con éxito.")

def iniciar_reparacion_definitiva():
    print("🛠️ Iniciando plan de rescate universal de rutas...")
    carpeta_revista = "revista01"
    
    if os.path.exists(carpeta_revista):
        for archivo in os.listdir(carpeta_revista):
            if archivo.endswith(".html"):
                reparar_archivo_html(os.path.join(carpeta_revista, archivo))
    else:
        print(f"❌ No se encontró la carpeta '{carpeta_revista}' en este directorio.")

    reparar_base_datos_json("revista.json")
    print("\n🎉 ¡Saneamiento completado! Todas las fotos apuntan de forma impecable a eneur-img-01.")

if __name__ == "__main__":
    iniciar_reparacion_definitiva()
