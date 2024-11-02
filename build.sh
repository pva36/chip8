cp -u ./src/*.html ./build/
cp -ru ./src/css/*.css ./build/css/

# transpile ts files
tsc
