import os
import re

# ==========================================================================
# LA URL REAL Y LIMPIA DE TU SERVIDOR SATÉLITE
# ==========================================================================
URL_CORRECTA = "https://github.io"

def reparar_archivo_html(ruta_archivo):
    """Busca cualquier formato roto o pegoteado de github e inyecta la URL limpia"""
    with open(ruta_archivo, "r", encoding="iso-8859-1") as f:
        contenido = f.read()

    # 1. Reparamos si quedó pegoteado como "github.ioimage_algo.jpg"
    contenido_nuevo = re.sub(
        r'src=["\']https://github\.ioimage_([^"\']+)["\']',
        f'src="{URL_CORRECTA}\\1"',
        contenido
    )
    
    # 2. Por las dudas, reparamos también si quedó como "images/image_something" suelto
    contenido_nuevo = re.sub(
        r'src=["\'](images/|./images/)([^"\']+)["\']',
        f'src="{URL_CORRECTA}\\2"',
        contenido_nuevo
    )

    if contenido != contenido_nuevo:
        with open(ruta_archivo, "w", encoding="iso-8859-1") as f:
            f.write(contenido_nuevo)
        print(f"✅ Enlaces de fotos reparados con éxito en: {os.path.basename(ruta_archivo)}")

def reparar_base_datos_json(ruta_json):
    """Corrige las rutas de las fotos pegoteadas adentro del archivo central revista.json"""
    if not os.path.exists(ruta_json):
        return
    
    with open(ruta_json, "r", encoding="utf-8") as f:
        contenido = f.read()

    # Corregimos el pegoteo en el JSON
    contenido_nuevo = re.sub(
        r'"https://github\.ioimage_([^"]+)"',
        f'"{URL_CORRECTA}\\1"',
        contenido
    )
    
    # Corregimos rutas locales si quedaba alguna en el JSON
    contenido_nuevo = re.sub(
        r'"images/([^"]+)"',
        f'"{URL_CORRECTA}\\1"',
        contenido_nuevo
    )

    if contenido != contenido_nuevo:
        with open(ruta_json, "w", encoding="utf-8") as f:
            f.write(contenido_nuevo)
        print("✅ Base de datos 'revista.json' reparada e integrada al servidor satélite.")

def iniciar_reparacion():
    print("🛠️ Iniciando el plan de reparación de rutas pegoteadas...")
    carpeta_revista = "revista01"
    
    if os.path.exists(carpeta_revista):
        for archivo in os.listdir(carpeta_revista):
            if archivo.endswith(".html"):
                reparar_archivo_html(os.path.join(carpeta_revista, archivo))
    else:
        print(f"❌ No se encontró la carpeta '{carpeta_revista}' en este directorio.")

    reparar_base_datos_json("revista.json")
    print("\n🎉 ¡Reparación completada! Todos los enlaces apuntan de forma perfecta a eneur-img-01.")

if __name__ == "__main__":
    iniciar_reparacion()