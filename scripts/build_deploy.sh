#!/bin/bash
# yarn quasar build #gera a pasta dist com o código compilado
yarn quasar build -m pwa #gera a pasta dist com o código compilado
mkdir .deploy && cd .deploy
git clone --branch deploy_dev git@github.com:hugoofilipe/huna-site.git
cd huna-site/
git checkout deploy_dev && rm -rf *
# cp -r ../../dist/spa/* .
cp -r ../../dist/pwa/* .
git add --all
git commit -m "Deploy project from \"npm run build\" system "
    git push
cd ../.. && rm -rf .deploy
