#!/bin/bash

printf "\n== STASH"
git stash
printf "\n== CHECKOUT MAIN"
git checkout main
printf "\n== STASH APPLY"
git stash apply
printf "\n== RM VAULT/DM/"
git rm -r *vault/dm/*
printf "\n== ADD ALL"
git add -A
printf "\n== COMMIT"
git commit -m "update"
printf "\n== PUSH"
git push
printf "\n== CHECKOUT DM"
git checkout dm
printf "\n== MERGE MAIN"
git merge main
printf "\n== STASH POP"
git stash pop
printf "\n== ADD ALL"
git add -A
printf "\n== COMMIT"
git commit -m "update dm"
printf "\n== PUSH"
git push
