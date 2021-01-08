const express = require('express')
const { search,ChangePassword } = require('./src/ldapRequests.js')
const bodyPaser = require('body-parser')
const server = express()

// Add headers
server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
  });

server.use(bodyPaser.json())


server.get("/", async function (req, res) {
    const response = await search('service_atelie');
    if (response.status == 500) {
        return res.status(500).json({"versão":"1.0.5", "Connection":false, 'error': response.error}); 
    }else{
        return res.status(200).json({"versão":"1.0.5", "Connection":true}); 
    }
    
})

server.post("/search/sAMAccountName/:user", async function (req, res) {
    const response = await search(req.params.user);
    return res.status(response.status).json(response); 
})

server.post("/changepassword", async function (req, res) {
    const response = await ChangePassword(req.body.username, req.body.newPassword, req.body.oldPassword);
    return res.status(response.status).json(response); 
})

server.listen(process.env.PORT || 3000, function () {
    console.log("listening on: ", process.env.PORT || 3000)
})
