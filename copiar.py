import os

extensiones = ('.jsx')
with open('codigo_completo.txt', 'w', encoding='utf-8') as salida:
    for ruta, _, archivos in os.walk('.'):
        for archivo in archivos:
            if archivo.endswith(extensiones):
                ruta_completa = os.path.join(ruta, archivo)
                salida.write(f"\n----- {ruta_completa} -----\n")
                with open(ruta_completa, 'r', encoding='utf-8', errors='ignore') as f:
                    salida.write(f.read())
