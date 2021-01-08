const ldapjs = require('ldapjs')
const assert = require('assert')
require('dotenv').config();
const { entryParser } = require('./entryParser.js')

const userRoot = process.env.USERROOT;
const ldapPassword = process.env.LDAPPASSWORD;
const adSuffix = process.env.ADSUFFIX;


exports.search = (username) => new Promise((re,err) =>{
    const ldapClient = ldapjs.createClient({
        url: process.env.LDAPURL
    });

    ldapClient.bind(userRoot, ldapPassword, function (err) {

    try {
        assert.ifError(err);
    } catch (error) {
        re({"status":500, error})
    }

        var opts = {
            filter: `(&(objectClass=user)(sAMAccountName=${username}))`,
            scope: 'sub',
            attributes: ['dn', 'sn', 'cn', 'sAMAccountName'],
            timeLimit: 2
        };
        ldapClient.search(adSuffix, opts, function (err, res2) {
            res2.on('error', function (err) {
                console.error('error: ' + err.message); 
            });
            res2.on('searchEntry', function (entry) {
                var res = entryParser(entry)
                res.status = 200
                re(res)
            });
            res2.on('end', function (result) {
                 re({"status":404, "error":`O usuário ${username} não foi encontrado`})
            });
        });
    });
});

exports.ChangePassword = (username, newPassword, oldPassword) => new Promise((re,err) =>{
    const ldapClient = ldapjs.createClient({
        url: process.env.LDAPURL
    });
    
    ldapClient.bind(userRoot, ldapPassword, function (err) {

        try {
            assert.ifError(err);
        } catch (error) {
            re({"status":500, error})
        }

        var opts = {
            filter: `(&(objectClass=user)(sAMAccountName=${username}))`,
            scope: 'sub',
            attributes: ['dn', 'sn', 'cn', 'sAMAccountName'],
            timeLimit: 2
        };
        ldapClient.search(adSuffix, opts, function (err, res2) {
            var fond = false;
            res2.on('error', function (err) {
                console.error('error: ' + err.message); 
            });
            res2.on('searchEntry', function (entry) {
                fond = true;
                ldapClient.bind(entry.object.dn, oldPassword, function (err, res3) {

                    if (err) {
                        re({"status":401, "error":'A senha ATUAL está incorreta'})
                    }

                    if (res3) {
                        ldapClient.modify(entry.object.dn, [
                            new ldapjs.Change({
                                operation: 'delete',
                                modification: {
                                    unicodePwd: Buffer.from('"' + oldPassword + '"', 'utf16le').toString()
                                }
                            }),
                            new ldapjs.Change({
                                operation: 'add',
                                modification: {
                                    unicodePwd: Buffer.from('"' + newPassword + '"', 'utf16le').toString()
                                },
                            })
                        ], function (err) {
                            if (err) { 
                                console.log(err.code);
                                console.log(err.name);
                                console.log(err.message);
                                if (err.code = 19) re({"status":406,'error':'Erro desconhecido, tente novamente mais tarde',  "errormessage":err.message })

                            }
                            else {
                                re({"status":200, "message":`Senha do usuário ${username} alterada com sucesso`})

                            }
                            
                        });
                    }
                })
            });
            res2.on('end', function (result) {
                if (!fond) re({"status":404, "error":`O usuário ${username} não foi encontrado`})
            });
        });
    });
});