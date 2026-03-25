#!/bin/bash
set -e

ENTRY="./lib/PreactDatefield.jsx"
ESM_OPTS="--format=esm --external:preact --external:@popperjs/core"
CJS_OPTS="--format=cjs --external:react"
COMMON_OPTS="--bundle --jsx-factory=h --jsx-fragment=Fragment --jsx=automatic --sourcemap"

rm -fr dist lib/*.d.ts

# ESM build
esbuild $ENTRY --outdir=dist/esm $ESM_OPTS $COMMON_OPTS

# CJS build (with React externalized for compat)
esbuild $ENTRY --outdir=dist/cjs $CJS_OPTS $COMMON_OPTS

# Remove CSS sourcemaps (single file, not useful)
rm -f dist/esm/PreactDatefield.css.map dist/cjs/PreactDatefield.css.map
sed -i '/\/\*# sourceMappingURL/d' dist/esm/PreactDatefield.css dist/cjs/PreactDatefield.css

# Generate and copy type declarations
tsc
cp lib/PreactDatefield.d.ts dist/esm/
cp lib/PreactDatefield.d.ts dist/cjs/
