"""Utilidades comunes para armar los notebooks con nbformat."""
import os
import nbformat as nbf

ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "notebooks", "cave_env.py")


def md(text):
    return nbf.v4.new_markdown_cell(text.strip("\n"))


def code(text, hidden=False):
    c = nbf.v4.new_code_cell(text.strip("\n"))
    if hidden:
        # Colab: celda plegada como formulario; Jupyter: fuente oculta
        c.metadata["cellView"] = "form"
        c.metadata["jupyter"] = {"source_hidden": True}
    return c


def writefile_cell():
    with open(ENV_PATH, encoding="utf-8") as f:
        src = f.read()
    return nbf.v4.new_code_cell("%%writefile cave_env.py\n" + src)


def save(cells, path):
    nb = nbf.v4.new_notebook()
    nb.cells = cells
    nb.metadata["kernelspec"] = {"name": "python3", "display_name": "Python 3", "language": "python"}
    nb.metadata["language_info"] = {"name": "python"}
    nb.metadata["colab"] = {"provenance": []}
    nbf.write(nb, path)
    print("guardado:", path)
