import nbformat, base64, sys
nb=nbformat.read(sys.argv[1],4); pre=sys.argv[2]; k=0
for i,c in enumerate(nb.cells):
    if c.cell_type!='code': continue
    for o in c.get('outputs',[]):
        if o.output_type=='stream' and 'writefile' not in c.source[:20]: print(f'[{i}]',o.text.strip()[:600])
        if o.output_type=='error': print('ERROR',i,o.ename,o.evalue)
        if 'data' in o and 'image/png' in o['data']:
            k+=1; fn=f'{pre}_{i:02d}_{k}.png'; open(fn,'wb').write(base64.b64decode(o['data']['image/png'])); print('img',fn)
        elif 'data' in o and 'text/plain' in o['data']: print(f'[{i}] txt',o['data']['text/plain'][:200])
