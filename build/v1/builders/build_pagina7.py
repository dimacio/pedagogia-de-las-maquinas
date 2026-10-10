"""Incrusta build/pesos7.json en build/pagina7.html y escribe clases/07-redes-recurrentes.html."""
import pathlib
B = pathlib.Path(__file__).resolve().parent
html = (B / "pagina7.html").read_text().replace("__PESOS__", (B / "pesos7.json").read_text())
(B.parent / "clases" / "07-redes-recurrentes.html").write_text(html)
print("escrito clases/07-redes-recurrentes.html", len(html) // 1024, "KB")
