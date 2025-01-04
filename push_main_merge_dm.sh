#!/bin/bash

echo == STASH
git stash
echo == CHECKOUT MAIN
git checkout main
<<<<<<< Updated upstream
echo == POP
git stash pop
=======
echo == STASH APPLY
git stash apply
>>>>>>> Stashed changes
echo == RM VAULT/DM/
git rm *vault/dm/*
echo == ADD ALL
git add -A
echo == COMMIT
git commit -m "update"
echo == PUSH
git push
echo == CHECKOUT DM
git checkout dm
echo == MERGE MAIN
git merge main
echo == STASH POP
git stash pop
echo == ADD ALL
git add -A
echo == COMMIT
git commit -m "update dm"
echo == PUSH
git push

echo test
