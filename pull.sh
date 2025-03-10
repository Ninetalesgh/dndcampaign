#!/bin/bash

git checkout main
git pull
git checkout dm
git pull
git merge main --no-edit
