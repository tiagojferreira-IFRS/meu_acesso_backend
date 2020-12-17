# meu acesso API

## Search user

### Request

`POST /search/sAMAccountName/:user/`

    curl -i -H 'Accept: application/json' http://localhost:3000/search/sAMAccountName/2019309735/

### Response

    HTTP/1.1 200 OK
    Status: 200 OK
    Connection: close
    Content-Type: application/json

    {
      "attributes": {
        "cn": "Pedro Nunes",
        "sn": "Nunes",
        "sAMAccountName": "2019309735"
      },
      "dn": "CN=Pedro Nunes,CN=Users,DC=atelie,DC=local",
      "status": 200
    }

### Error

    HTTP/1.1 404 Not Found
    Status: 404 Not Found
    Connection: close
    Content-Type: application/json

    {
      "status": 404,
      "error": "O usuário 201930973 não foi encontrado"
    }
    

## Change Password

### Request

`POST /changepassword/`

    curl --header "Content-Type: application/json" \
    --request POST \
    --data '{"username":"2019309735","newPassword":"sertaopass", "oldPassword":"senha12334"}' \
    http://localhost:3000/changepassword/

### Response

    HTTP/1.1 200 Ok
    Status: 200 Ok
    Connection: close
    Content-Type: application/json

    {
      "status": 200,
      "message": "Senha do usuário 2019309735 alterada com sucesso"
    }
    
### Errors

#### 404

    HTTP/1.1 404 Not Found
    Status: 404 Not Found
    Connection: close
    Content-Type: application/json

    {
      "status": 404,
      "error": "O usuário 201930973 não foi encontrado"
    }
    
 #### 401
 
 
    HTTP/1.1 401 Unauthorized
    Status: 401 Unauthorized
    Connection: close
    Content-Type: application/json

    {
      "status": 401,
      "error": "A senha ATUAL está incorreta"
    }
 
  #### 406
 
     HTTP/1.1 406 Not Acceptable
    Status: 406 Not Acceptable
    Connection: close
    Content-Type: application/json

     {
      "status": 406,
      "error": "Erro desconhecido, tente novamente mais tarde",
      "errormessage": "0000052D: Constraint violation - check_password_restrictions: the password was already used (in history)!"
    }
  
