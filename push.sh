#!/bin/bash

printf "\n== ADD DM\n"
git add --all vault/dm/
printf "\n== COMMIT\n"
git commit -m "update dm"
printf "\n== PUSH\n"
git push
printf "\n== STASH\n"
git stash clear
git stash
printf "\n== CHECKOUT MAIN\n"
git checkout main
printf "\n== STASH APPLY\n"
git stash pop
printf "\n== ADD ALL\n"
git add -A
printf "\n== COMMIT\n"
git commit -m "update main"
printf "\n== PUSH\n"
git push
printf "\n== CHECKOUT DM\n"
git checkout dm
printf "\n== MERGE MAIN\n"
git merge main
printf "\n== PUSH\n"
git push
