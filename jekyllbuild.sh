#!/bin/bash

rm -rf ../francescovitucci/*

bundle exec jekyll build

cp -R _site/* ../francescovitucci
