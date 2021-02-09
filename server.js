const express = require('express');
const server = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const checkPropValid = require('./validationModule');
const e = require('express');
// changes
//second changes

server.use(bodyParser.json());

const SERVER_PORT = 5000;
const DB_FILE_NAME = 'users.db.JSON';


const startUpCallBack = ()=>
{
    console.log(`Server started at: http://localhost:${SERVER_PORT}`);    
}


// GET * users
server.get('/', (req, res) =>{

    fs.readFile(DB_FILE_NAME, 'utf8', (err, data) =>{

        let users = JSON.parse(data);

        res.json(users);
        res.end();

    });

});

// GET user by ID

server.get('/:id', (req, res) =>{

    fs.readFile(DB_FILE_NAME, 'utf8', (err, data) =>{

        let users = JSON.parse(data);

        let usersFound = users.filter(user => user.id  == req.params.id);       
        
       

        if(usersFound.length > 0)
        {           
            res.json(usersFound[0]);    

        }else
        {
            res.json({});
        }

        
        res.end();

    });

});


// POST  add new user
server.post("/", (req, res) => {

    fs.readFile(DB_FILE_NAME, "utf8", (err, data) => {

        let users = JSON.parse(data);

        //Получим нового пользователя из тела POST запроса
        let newUser = req.body;

        checkPropValid(newUser,(result, validationError) =>{
                
            if(result)
            {
                //Добавим его в новый массив вместе с существующими уже
                users = [...users, newUser];

                //Перезапишем файл JSON
                fs.writeFile(DB_FILE_NAME, JSON.stringify(users), () => {

                    //Перечитываем файл базы данных чтобы вернуть его в response
                    fs.readFile(DB_FILE_NAME, "utf8", (err, data) => {

                        res.json(JSON.parse(data));
                        res.end();

                    });

                });     
            }
            else
            {               
                res.json({
                    "Error": validationError
                });

                res.end;
            }

        });


    });

});

// PUT change user
server.put('/', (req, res) =>{
   
    fs.readFile(DB_FILE_NAME, 'utf8', (err, data) =>{

        let users = JSON.parse(data);
        let updatedUser = req.body ;

        checkPropValid(updatedUser, (result, validationError) =>{

            if(result)
            {
                let unchangedUsers = users.filter(user => user.id != updatedUser.id);

                let allUsers = [ ...unchangedUsers, updatedUser];
        
        
                 fs.writeFile(DB_FILE_NAME, JSON.stringify(allUsers), () => {
        
                    //Перечитываем файл базы данных чтобы вернуть его в response
                    fs.readFile(DB_FILE_NAME, "utf8", (err, data) => {
        
                            res.json(JSON.parse(data));
                            res.end();
                    });
                });    
            }
            else
            {
                res.json({
                    "Error": validationError
                });

                res.end;
            }

        });

      
    });
});


// DELTE

server.delete("/:id", (req, res) => {

    fs.readFile(DB_FILE_NAME, "utf8", (err, data) => {

        let users = JSON.parse(data);

        //Берём всех пользователей чей id не совпадает с id удаляемого пользователя
        //users left - оставшиеся пользователи
        let usersLeft = users.filter(user => user.id != req.params.id);

        fs.writeFile(DB_FILE_NAME, JSON.stringify(usersLeft), () => {

            res.json({
                "result" : true
            });

            res.end();

        });

    });

});

const service = server.listen(SERVER_PORT, startUpCallBack);