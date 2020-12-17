const express = require('express')
const { search,ChangePassword } = require('./src/ldapRequests.js')
const bodyPaser = require('body-parser')
const server = express()

server.use(bodyPaser.json())


server.get("/", function (req, res) {
    return res.json({"versão":"1.0.0"}); 
})

server.post("/search/sAMAccountName/:user", async function (req, res) {
    const response = await await search(req.params.user);
    res.statusCode = response.status
    return res.json(response); 
})

server.post("/changepassword", async function (req, res) {

    const { username, newPassword, oldPassword } = req.body;
    const response = await ChangePassword(username, newPassword, oldPassword);
    res.statusCode = response.status
    return res.json(response); 
})

server.listen(process.env.PORT || 3000, function () {
    console.log("listening on: ", process.env.PORT || 3000)
})
