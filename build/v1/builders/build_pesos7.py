"""Entrena (con el mismo código y las mismas semillas que el notebook 07) las redes que corre la página
clases/07-redes-recurrentes.html y las guarda en build/pesos7.json. Después build_pagina7.py las incrusta.
uso: cd notebooks && python ../build/build_pesos7.py"""
import json, pathlib, sys, time
ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "notebooks"))
exec((ROOT / "build" / "herramientas07.py").read_text())
torch.set_num_threads(1)

CORPUS = preparar_texto((ROOT / "build" / "corpus_cueva.txt").read_text())
VOCAB = sorted(set(CORPUS))
R = lambda a, d=4: np.round(np.asarray(a.detach() if hasattr(a, "detach") else a, float), d).tolist()
out = {"vocab": "".join(VOCAB), "corpus": CORPUS}

# --- la RNN de juguete (Elman, one-hot, 32 estados): la misma que el Paso 4 del notebook
t0 = time.time()
elman = entrenar_lm(CORPUS, VOCAB, "elman", H=32, pasos=2000, semilla=0)
print("elman %.1fs" % (time.time() - t0), "entropía", entropia_red(elman, CORPUS))
sd = elman.state_dict()
Hc, Pc = estados(elman, CORPUS); mu, W = pca2(Hc)
idx = np.linspace(0, len(Hc) - 1, 900).astype(int); Z = (Hc[idx] - mu) @ W.T
out["elman"] = {"Wxh": R(sd["rnn.weight_ih_l0"]), "Whh": R(sd["rnn.weight_hh_l0"]), "b": R(sd["rnn.bias_ih_l0"] + sd["rnn.bias_hh_l0"]),
                "Why": R(sd["salida.weight"]), "by": R(sd["salida.bias"]), "mu": R(mu), "pc": R(W),
                "fondo": R(Z, 3), "fondoClase": [clase_letra(VOCAB[int(np.argmax(Pc[i]))]) for i in idx]}

# --- el agente: cueva grande, imitación con y sin memoria (Paso 5)
env = CaveEnv(CUEVA_GRANDE); dist = distancias(env)
D = datos_imitacion(env, dist, episodios=2000, T=60, eps=0.3, semilla=1)
t0 = time.time()
sin = SinMemoria(32); torch.manual_seed(0); entrenar_imitacion(sin, D, pasos=800)
con = ConMemoria(32); torch.manual_seed(0); entrenar_imitacion(con, D, pasos=800)
sonda = entrenar_sonda(con, D, env)
print("agentes %.1fs" % (time.time() - t0))
es, ec = evaluar(sin, env, dist), evaluar(con, env, dist)
print("sin memoria", {k: v for k, v in es.items() if k != "atascadas"}, "con memoria", {k: v for k, v in ec.items() if k != "atascadas"})
s1, s2, s3 = sin.f[0], sin.f[2], sin.f[4]
g = con.state_dict()
out["agente"] = {
    "sin": {"W1": R(s1.weight), "b1": R(s1.bias), "W2": R(s2.weight), "b2": R(s2.bias), "W3": R(s3.weight), "b3": R(s3.bias)},
    "con": {"Wih": R(g["gru.weight_ih_l0"]), "Whh": R(g["gru.weight_hh_l0"]), "bih": R(g["gru.bias_ih_l0"]), "bhh": R(g["gru.bias_hh_l0"]),
            "Wo": R(g["salida.weight"]), "bo": R(g["salida.bias"])},
    "sonda": {"W": R(sonda.weight), "b": R(sonda.bias)},
    "eval": {"sin": {"exito": es["exito"], "pasos_de_mas": es["pasos_de_mas"], "atascadas": len(es["atascadas"]), "n": es["n"]},
             "con": {"exito": ec["exito"], "pasos_de_mas": ec["pasos_de_mas"], "atascadas": len(ec["atascadas"]), "n": ec["n"]}},
}
(ROOT / "build" / "pesos7.json").write_text(json.dumps(out, ensure_ascii=False, separators=(",", ":")))
print("guardado build/pesos7.json", (ROOT / "build" / "pesos7.json").stat().st_size // 1024, "KB")
