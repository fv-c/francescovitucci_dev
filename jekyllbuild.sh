#!/bin/bash

rm -rf ../francescovitucci/*

bundle exec jekyll clean

JEKYLL_ENV="production" bundle exec jekyll build

python3.12 lilypondprocess.py

cp -R _site/* ../francescovitucci

cd ..

cd francescovitucci

git add *

git commit -m "`date`"

git push origin main
