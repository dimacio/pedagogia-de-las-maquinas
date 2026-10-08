"""Utilidades comunes para armar los notebooks del curso con nbformat."""
import pathlib
import nbformat as nbf

ROOT = pathlib.Path(__file__).resolve().parent.parent
NB_DIR = ROOT / "notebooks"


def md(text, objetivos=None):
    """objetivos=["O1", "O3"]: marca de trazabilidad en la celda que abre una sección (fabrica/CONVENCIONES.md §2)."""
    c = nbf.v4.new_markdown_cell(text.strip("\n"))
    if objetivos:
        c.metadata["tags"] = [f"objetivo:{o}" for o in objetivos]
    return c


def code(text, herramientas=False):
    c = nbf.v4.new_code_cell(text.strip("\n"))
    if herramientas:
        # plegable en Colab (formulario) y en Jupyter (código oculto)
        c.metadata["cellView"] = "form"
        c.metadata["jupyter"] = {"source_hidden": True}
    return c


def writefile_cell():
    src = (NB_DIR / "cave_env.py").read_text()
    return nbf.v4.new_code_cell("%%writefile cave_env.py\n" + src.rstrip("\n"))


def save(cells, name, lento=False):
    """lento=True: el notebook usa LLM o tarda > 3 min (fabrica/CONVENCIONES.md §2)."""
    nb = nbf.v4.new_notebook()
    nb.cells = cells
    if lento:
        nb.metadata["fabrica"] = {"lento": True}
    nb.metadata["kernelspec"] = {"name": "python3", "display_name": "Python 3", "language": "python"}
    nb.metadata["language_info"] = {"name": "python"}
    nb.metadata["colab"] = {"provenance": []}
    out = NB_DIR / name
    nbf.write(nb, out)
    print("guardado:", out)
    return out
