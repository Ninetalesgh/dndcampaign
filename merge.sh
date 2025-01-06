#!/bin/bash

printf "\n== CHECKOUT MAIN\n"
git checkout dm
git add -A
printf "\n== COMMIT\n"
git commit -m "merge from main"
printf "\n== PUSH\n"
git push