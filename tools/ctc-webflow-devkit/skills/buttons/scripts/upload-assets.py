#!/usr/bin/env python3
"""Upload local files to Webflow after data_assets_tool > create_asset.

1. Call create_asset once with one action per file (label = file name without .svg,
   file_name = 'icon-<name>.svg', file_hash = MD5 hex of the file). Save the whole tool
   response to a file (large responses are saved for you; pass that path).
2. python3 upload-assets.py <create_asset_response.json|.txt> <dir_with_files> <out_urls.json>

Posts each file to S3 with the returned form fields (expects HTTP 201) and writes
{label: hostedUrl}. Merges into out_urls.json if it already exists.

MD5 helper:  python3 -c "import hashlib,sys;print(hashlib.md5(open(sys.argv[1],'rb').read()).hexdigest())" f.svg
"""
import json
import os
import subprocess
import sys

resp_path, files_dir, out_path = sys.argv[1], sys.argv[2], sys.argv[3]
raw = open(resp_path, encoding='utf-8').read()
try:  # a saved tool result is a JSON array of {type, text}
    raw = ''.join(x.get('text', '') for x in json.loads(raw))
except Exception:
    pass

objs, dec, i = [], json.JSONDecoder(), 0
while True:
    j = raw.find('{"label"', i)
    if j < 0:
        break
    o, i = dec.raw_decode(raw, j)
    objs.append(o)

urls = json.load(open(out_path)) if os.path.exists(out_path) else {}
failed = []
for o in objs:
    r = o.get('result') or {}
    d = r.get('uploadDetails')
    if not d:
        failed.append((o.get('label'), 'no uploadDetails'))
        continue
    label = o['label']
    path = os.path.join(files_dir, label + '.svg')
    fields = {
        'acl': d['acl'], 'bucket': d['bucket'], 'X-Amz-Algorithm': d['xAmzAlgorithm'],
        'X-Amz-Credential': d['xAmzCredential'], 'X-Amz-Date': d['xAmzDate'], 'key': d['key'],
        'Policy': d['policy'], 'X-Amz-Signature': d['xAmzSignature'],
        'success_action_status': d['successActionStatus'], 'Content-Type': d['contentType'],
        'Cache-Control': d['cacheControl'],
    }
    cmd = ['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', '-X', 'POST', r['uploadUrl']]
    for k, v in fields.items():
        cmd += ['-F', f'{k}={v}']
    cmd += ['-F', f'file=@{path};type={d["contentType"]}']
    code = subprocess.run(cmd, capture_output=True, text=True).stdout
    if code != '201':
        failed.append((label, code))
        continue
    urls[label] = r['hostedUrl']

json.dump(urls, open(out_path, 'w'), indent=1)
print(f'uploaded {len(objs) - len(failed)}/{len(objs)}; urls in {out_path}')
for f in failed:
    print('failed:', *f)
