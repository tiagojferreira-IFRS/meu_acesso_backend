const express = require('express')
const bodyPaser = require('body-parser')
const server = express()

// Add headers
server.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    console.log("cros")
    next();
  });

server.use(bodyPaser.json())


server.get("/", function (req, res) {
    return res.json({"versão":"1.0.0"}); 
})


server.post("/changepassword", async function (req, res) {

    const fakereqs = [ {"username":"2019309735","newPassword":"sertaopass", "oldPassword":"senha12334"},{"username":"201930973","newPassword":"sertaopass", "oldPassword":"senha12334"},{"username":"2019309735","newPassword":"sertaopass", "oldPassword":"senha1233"}]
    const fakeress = [{"status":200, "message":`Senha do usuário 201930973 alterada com sucesso`},{"status":404, "error":`O usuário 201930973 não foi encontrado`},{"status":401, "error":'A senha ATUAL está incorreta'}]
    for (let i = 0; i < fakereqs.length; i++) {
        if(isEquivalent(req.body, fakereqs[i])){
            res.statusCode = fakeress[i].status
            return res.json(fakeress[i]); 
        } 
    }
})

function isEquivalent(a, b) {
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);
    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        if (a[propName] !== b[propName]) {
            return false;
        }
    }
    return true;
}


server.listen(process.env.PORT || 3000, function () {
    console.log("listening on: ", process.env.PORT || 3000)
})
