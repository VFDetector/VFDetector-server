cd /var/www/kimoi-api.microbox.tech/api

# ignore change on prod server
git reset --hard HEAD
# git checkout main, deploy token need to name a username, default username might not work correctly
git pull "https://gitlab-runner:Mcd8_cTfqzRbdrHzt-52@git.microbox.tech/KIMOI/coreapi.git" main
# git checkout main, use project access token
# git pull "https://git-access-token:glpat-fyyP7zFP2FdgVB7T7P2o@git.microbox.tech/KIMOI/coreapi.git"

# intsall packages and reload server
yarn install
# pm2 start /var/www/kimoi-api.microbox.tech/api/server.js --name KIMOI
pm2 restart KIMOI