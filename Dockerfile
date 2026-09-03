
from node:20-alpine
workdir /app
copy package.json ./
run npm i 
copy dist ./dist

expose 3000
cmd ["npm", "run", "dockerfile_start"]
