#!/bin/bash
yarn quasar build #gera a pasta dist com o código compilado
mkdir .deploy && cd .deploy
git clone --branch deploy_dev https://github.com/hugoofilipe/huna-site.git
cd huna-site/
git rm -rf *
git checkout deploy_dev
cp -r ../../dist/spa/* .
git add --all
git commit -m "Deploy project from \"npm run build\" system "
    git push
cd ../.. && rm -rf .deploy
