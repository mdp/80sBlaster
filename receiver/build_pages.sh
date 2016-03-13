#!/bin/bash

if [[ -n $(git status -s) ]]; then
  echo 'Uncommited changes, cannot publish'
  exit 1
fi

npm i
npm run build
cp -R ./dist/* pages/.
cd pages
git add .
git ci -m "Update gh-pages"
git push origin gh-pages
cd ..
git add pages
git ci -m "Update gh-pages submodule"
git push origin master

