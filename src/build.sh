cd ./public/bundle
rm bundle.js # Delete old bundle.js and source map before creating new ones
rm bundle.js.map
cd ../../
npx babel ./public/js -o ./public/bundle/bundle.js -s # Package all files in /js directory into bundle.js file with source map in /bundle directory
# npx eslint ./public/bundle/bundle.js