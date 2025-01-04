#!/bin/bash


echo == STASH
git stash
echo == CHECKOUT MAIN
git checkout main
echo == POP
git stash pop
echo == RM VAULT/DM/
git rm *vault/dm/*
echo == COMMIT
git commit -m "update"
echo == PUSH
git push
echo == CHECKOUT DM
git checkout dm
echo == MERGE MAIN
git merge main
echo == POP
git stash pop
git status