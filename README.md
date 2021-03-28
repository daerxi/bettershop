# betterShop

1. Clone repo locally
2. Download docker if you don't have one
3. Run if you never created an container
```
docker run --name bettershop -p 3306:3306 -e MYSQL_ROOT_PASSWORD=supersecretpassword -d mysql
```
4. If container is already created, just start it directly
5. cd into the project, run `npm install` with node 15
6. Set .env file with 
```
NODE_ENV=dev
API_PORT=4040
JWT_SECRET=dominosdominosdominos112233445566778899
```
7. `npm start` to start locally

