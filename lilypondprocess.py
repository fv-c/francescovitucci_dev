# import re
# import os
# import subprocess
# from datetime import datetime

# site_url = "https://fv-c.github.io/francescovitucci"
# lilypond_path = "/Users/master/Documents/lilypond-2.24.3/bin/lilypond"

# # Cartella di output per le partiture
# output_folder = "_site/assets/img/scores"
# os.makedirs(output_folder, exist_ok=True)

# # Contenuto da aggiungere a ogni blocco di codice LilyPond
# preamble = r"""\include "lilypond-book-preamble.ly"
# #(ly:set-option 'separate-page-formats 'pdf)
# """

# # Trova i file HTML solo nella cartella _site e nelle sue sottocartelle
# for root, dirs, files in os.walk("_site"):
#     for filename in files:
#         if filename.endswith(".html"):
#             file_path = os.path.join(root, filename)
#             with open(file_path, "r") as file:
#                 content = file.read()

#             # Trova tutti i div con classe lilyFragment e lilyFragmentWithScore
#             lilypond_blocks = re.findall(r'<div class="lilyFragment">(.*?)</div>', content, re.DOTALL)
#             lilypond_with_score_blocks = re.findall(r'<div class="lilyFragmentWithScore">(.*?)</div>', content, re.DOTALL)
            
#             # Processa i blocchi con classe lilyFragment
#             for code in lilypond_blocks:
#                 # Genera un nome file unico usando data e ora
#                 timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
#                 output_path = f"{output_folder}/{filename}-{timestamp}"

#                 # Salva il codice LilyPond temporaneamente
#                 temp_file_path = "temp.ly"
#                 with open(temp_file_path, "w") as temp_file:
#                     temp_file.write(preamble + code)
                
#                 # Compila il codice LilyPond in SVG
#                 subprocess.run([lilypond_path, "-dbackend=svg", "-o", output_path, temp_file_path])
                
#                 # Rimuovi il file temporaneo dopo la compilazione
#                 os.remove(temp_file_path)
                
#                 # Sostituisci il div nel contenuto con l’immagine SVG
#                 svg_path = f"{output_path}.svg"
#                 img_tag = f'<img src="{site_url}/assets/img/scores/{filename}-{timestamp}-1.svg" alt="Partitura generata" class="lilyFragmentImg">'
#                 content = content.replace(f'<div class="lilyFragment">{code}</div>', img_tag)

#             # Processa i blocchi con classe lilyFragmentWithScore
#             for code in lilypond_with_score_blocks:
#                 # Genera un nome file unico usando data e ora
#                 timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
#                 output_path = f"{output_folder}/{filename}-{timestamp}"

#                 # Salva il codice LilyPond temporaneamente
#                 temp_file_path = "temp.ly"
#                 with open(temp_file_path, "w") as temp_file:
#                     temp_file.write(preamble + code)
                
#                 # Compila il codice LilyPond in SVG
#                 subprocess.run([lilypond_path, "-dbackend=svg", "-o", output_path, temp_file_path])
                
#                 # Rimuovi il file temporaneo dopo la compilazione
#                 os.remove(temp_file_path)
                
#                 # Evidenzia il codice LilyPond usando pygmentize
#                 pygmentize_output = subprocess.run(
#                     ["pygmentize", "-O", "style=default,noclasses","-l", "lilypond", "-f", "html"],
#                     input=code,
#                     text=True,
#                     capture_output=True
#                 ).stdout

#                 # Crea il bottone di copia con funzionalità JavaScript
#                 copy_button = """
#                 <button class="copy-btn" onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText)">Copy</button>
#                 """

#                 # Aggiunge il bottone e il codice evidenziato in un container
#                 highlighted_code_with_button = f"""
#                 <div class="code-container">{copy_button}{pygmentize_output}</div>
#                 """

#                 # Sostituisci il div nel contenuto con il blocco evidenziato <pre><code> e l’immagine SVG
#                 svg_path = f"{output_path}.svg"
#                 img_tag = f'<img src="{site_url}/assets/img/scores/{filename}-{timestamp}-1.svg" alt="Partitura generata" class="lilyFragmentImg">'
#                 content = content.replace(f'<div class="lilyFragmentWithScore">{code}</div>', highlighted_code_with_button + img_tag)

#             # Salva le modifiche nel file HTML
#             with open(file_path, "w") as file:
#                 file.write(content)

import re
import os
import subprocess
from datetime import datetime

site_url = "https://fv-c.github.io/francescovitucci"
lilypond_path = "/Users/master/Documents/lilypond-2.24.3/bin/lilypond"
inkscape_path = "/Applications/Inkscape.app/Contents/MacOS/inkscape"

# Cartella di output per le partiture
output_folder = "_site/assets/img/scores"
os.makedirs(output_folder, exist_ok=True)

# # Contenuto da aggiungere a ogni blocco di codice LilyPond
# preamble = r"""\include "lilypond-book-preamble.ly"
# #(ly:set-option 'separate-page-formats 'pdf)
# """

# Contenuto da aggiungere a ogni blocco di codice LilyPond
preamble = r"""\header {
    tagline = ##f
  }
"""

# Trova i file HTML solo nella cartella _site e nelle sue sottocartelle
for root, dirs, files in os.walk("_site"):
    for filename in files:
        if filename.endswith(".html"):
            file_path = os.path.join(root, filename)
            with open(file_path, "r") as file:
                content = file.read()

            # Trova tutti i div con classe lilyFragment e lilyFragmentWithScore
            lilypond_blocks = re.findall(r'<div class="lilyFragment">(.*?)</div>', content, re.DOTALL)
            lilypond_with_score_blocks = re.findall(r'<div class="lilyFragmentWithScore">(.*?)</div>', content, re.DOTALL)
            
            # Processa i blocchi con classe lilyFragment
            for idx, code in enumerate(lilypond_blocks):
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                output_path = f"{output_folder}/{filename}-{timestamp}-{idx}"

                # Salva il codice LilyPond temporaneamente
                temp_file_path = "temp.ly"
                with open(temp_file_path, "w") as temp_file:
                    temp_file.write(preamble + code)
                
                # Compila il codice LilyPond in SVG
                subprocess.run([lilypond_path, "-dbackend=svg", "-o", output_path, temp_file_path])
                os.remove(temp_file_path)

                # Usa Inkscape per ritagliare l'area effettivamente piena
                svg_path = f"{output_path}.svg"
                subprocess.run([inkscape_path, svg_path, "--export-area-drawing", "--export-filename", svg_path])

                # Sostituisci il div nel contenuto con l’immagine SVG univoca
                img_tag = f'<img src="{site_url}/assets/img/scores/{filename}-{timestamp}-{idx}.svg" alt="Partitura generata" class="lilyFragmentImg">'
                content = content.replace(f'<div class="lilyFragment">{code}</div>', img_tag)

            # Processa i blocchi con classe lilyFragmentWithScore
            for idx, code in enumerate(lilypond_with_score_blocks):
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S_%f")
                output_path = f"{output_folder}/{filename}-{timestamp}-{idx}"

                temp_file_path = "temp.ly"
                with open(temp_file_path, "w") as temp_file:
                    temp_file.write(preamble + code)
                
                subprocess.run([lilypond_path, "-dbackend=svg", "-o", output_path, temp_file_path])
                os.remove(temp_file_path)

                # Usa Inkscape per ritagliare l'area effettivamente piena
                svg_path = f"{output_path}.svg"
                subprocess.run([inkscape_path, svg_path, "--export-area-drawing", "--export-filename", svg_path])

                # Evidenzia il codice LilyPond
                pygmentize_output = subprocess.run(
                    ["pygmentize", "-O", "style=default,noclasses", "-l", "lilypond", "-f", "html"],
                    input=code,
                    text=True,
                    capture_output=True
                ).stdout

                code_header = """
                <div class="code-header">
                    <span class="language-label">LilyPond</span>
                    <button class="copy-btn" onclick="navigator.clipboard.writeText(this.closest('.code-container').querySelector('code').innerText)">Copy</button>
                </div>
                """
                highlighted_code_with_header = f"""
                <div class="code-container">
                    {code_header}
                    <pre><code>{pygmentize_output}</code></pre>
                </div>
                """
                
                img_tag = f'<img src="{site_url}/assets/img/scores/{filename}-{timestamp}-{idx}.svg" alt="Partitura generata" class="lilyFragmentImg">'
                content = content.replace(f'<div class="lilyFragmentWithScore">{code}</div>', highlighted_code_with_header + img_tag)

            # Salva le modifiche nel file HTML
            with open(file_path, "w") as file:
                file.write(content)