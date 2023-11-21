// index.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express().use(bodyParser.json());
const token = process.env.TOKEN;
const myToken = process.env.MYTOKEN;

app.listen(8000, () => {
    console.log('I am in Home Page');
});

app.get('/', (req, res) => {
    res.status(200).send('This is Home Page');
});

// app.get('/webhook', (req, res) => {
//     let mode = req.query["hub.mode"];
//     let challenge = req.query["hub.challenge"];
//     let token = req.query["hub.verify_token"];

//     if (mode && token) {
//         if (mode === 'subscribe' && token === myToken) {
//             res.status(200).send(challenge);
//         } else {
//             res.sendStatus(403);
//         }
//     }
//     res.status(200).send('Webhook Verify...');
// });

app.post("/webhook", (req, res) => {
    let body = req.body;
    console.log(body);

    if (body.object) {
        if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.message && body.entry[0].changes[0].value.message[0]) {
            let mob = body.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body.entry[0].changes[0].value.message[0].from;
            let msg_body = body.entry[0].changes[0].value.message[0].text_body;

            axios({
                method: 'post',
                url: 'https://graph.facebook.com/v17.0/' + mob + '/messages?access_token=' + token,
                data: {
                    messaging_product: 'whatsapp',
                    to: from,
                    text: {
                        body: 'Thank You To Contact Wify Systems Private Limited...'
                    }
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }
});

module.exports = app;

// const express = require('express');
// const bodyParser = require('body-parser');
// const axios = require('axios');
// require('dotenv').config();

// const app = express().use(bodyParser.json());
// const port = 8000;
// const token = process.env.TOKEN;
// const myToken = process.env.MYTOKEN;

// // Middleware to parse incoming JSON requests

// // Define the /webhook endpoint
// app.get('/webhook', (req, res) => {
//     let mode = req.query["hub.mode"];
//     let challenge = req.query["hub.challenge"];
//     let token = req.query["hub.verify_token"];

//     if(mode && token){

//         if(mode == 'subscribe' && token==myToken){
//             res.status(200).send(challenge);
//         }else{
//             res.send(403);
//         }

//     }
//     res.status(200).send('OK');
// });

// app.post("/webhook",(req,res)=>{

//     let body = req.body;
//     console.log(JSON.stringify(body_param,null,2));
//     if(body_param.object){
//         if(body_param.entry && body_param.entry[0].changes && body_param.entry[0].changes[0].value.message && body_param.entry[0].changes[0].value.message[0]){
//             let mob = body.entry[0].changes[0].value.metadata.phone_number_id;
//             let from =  body.entry[0].changes[0].value.message[0].from;
//             let msg_body =  body.entry[0].changes[0].value.message[0].text_body;

//             axios({

//                 method :'post',
//                 url : 'https://graph.facebook.com/v17.0/'+mob+'/messages?access_token='+token,
//                 data : {
//                     messaging_product : 'whatsapp',
//                     to : from,
//                     text : {
//                         body : 'Thank You To Contact Wify Systems Private Limited...'
//                     }
//                 },
//                 headers : {
//                     'Content-Type' : 'application/json'
//                 }
//             });

//             res.sendStatus(200);
//         }else{
//             res.sendStatus(404);
//         }
//     }

// });

// // Start the Express server
// app.listen(port || process.env.PORT, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
