#!/bin/bash


== STASH
git stash
== CHECKOUT MAIN
git checkout main
== POP
git stash pop
== RM VAULT/DM/
git rm *vault/dm/*
== COMMIT
git commit -m "update"
== PUSH
git push
== CHECKOUT DM
git checkout dm
== MERGE MAIN
git merge main
== POP
git stash pop
git status