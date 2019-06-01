let express = require('express');
const mongoose = require('mongoose');
var bodyParser = require("body-parser");
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// const jwt = require('jsonwebtoken');
// const secretKey = 'My Secret';
const promise = require('bluebird');
// Setup server port
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
var port = process.env.PORT || 8080;
//connect

app.listen(port, function () {
    console.log('working in ' + port);
})

  
var listOtherUserRadius = [
    { username : "admin", lat: 10.850521, lng: 106.790880 },
    { username : "Vinh", lat: 10.850663, lng: 106.790865 },//cach admin 16 m
    { username : "Dat", lat: 10.850077, lng: 106.787672 },//cach admin 400m
    { username : "Khanh", lat: 10.848128, lng: 106.787177},//cach admin 400m
    { username : "De", lat: 10.848055, lng: 106.787251 },//cach damin 400m
    { username : "Canh", lat: 10.7964176, lng: 106.6859584 },
    { username : "Thao", lat: 10.7914176, lng: 106.6849584 },
    { username : "ChiNhung", lat: 10.7914976, lng: 106.6849984 }];
function login(userName, listUsers){
    let resultLogin ;
    listUsers.forEach(item => {
        if(item.username === userName){
            resultLogin = item;
        }
    });
    return resultLogin;
}
function findUsersNear( listUsers, userLat, userLng, userRadius, username){ 
    var listUsersNear = [];
    listUsers.forEach(async item => {
        let distanceLat = Math.abs( Math.abs(userLat) - Math.abs(item.lat));
        let distanceLng =  Math.abs(Math.abs(userLng) - Math.abs(item.lng));
        if(item.username != username){
            if((distanceLat <= Number(userRadius)) && (distanceLng <= Number(userRadius))){
                await listUsersNear.push(item);
            }  
        } 
    }); 
    return listUsersNear;
}   
app.get('/', (req, res) => {
  res.render('home');
});
app.get('/get-map', (req, res) => {
    res.render('index');
  });
app.post('/login', async(req, res) => {
    try {   
        var { userName } = req.body;
        let resultLogin =   await login(userName, listOtherUserRadius);
        if(!resultLogin) return res.json({ error: "true" , data : "Fail_to_login" });
        res.json({ error: "true" , data : resultLogin });
    } catch (error) {
        console.log(error);
    }
  });
app.post('/get-list-orther-users-near', async(req, res) => {
    try {
        var { userName, userRadius } = req.body;
        console.log(userRadius)
        let locationUsers = listOtherUserRadius.findIndex(item => item.username === userName);
        var locationDoNotExit = -1;
        if(locationUsers === locationDoNotExit)
            return res.json({ err: "true", title: "fail to find user infor" });
        let resultGetListUserNear = await findUsersNear(listOtherUserRadius, listOtherUserRadius[locationUsers].lat, listOtherUserRadius[locationUsers].lng, userRadius, userName);
        if(!resultGetListUserNear)
            return res.json({ err:"true", dataLocationUser: "list_null" });
        res.json({ err:"true", dataLocationUser: resultGetListUserNear });
         } catch (error) {
        console.log(error);
    }
});
  






