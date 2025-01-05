#!/bin/bash

echo \n== STASH
git stash
echo \n== CHECKOUT MAIN
git checkout main
echo \n== STASH APPLY
git stash apply
echo \n== RM VAULT/DM/
git rm -r *vault/dm/*
echo \n== ADD ALL
git add -A
echo \n== COMMIT
git commit -m "update"
echo \n== PUSH
git push
echo \n== CHECKOUT DM
git checkout dm
echo \n== MERGE MAIN
git merge main
echo \n== STASH POP
git stash pop
echo \n== ADD ALL
git add -A
echo \n== COMMIT
git commit -m "update dm"
echo \n== PUSH
git push
