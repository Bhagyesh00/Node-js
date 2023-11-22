// index.js

const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;//prasath_token

app.listen(process.env.PORT,()=>{
    console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook",(req,res)=>{
   let mode=req.query["hub.mode"];
   let challange=req.query["hub.challenge"];
   let token=req.query["hub.verify_token"];


    if(mode && token){

        if(mode==="subscribe" && token===mytoken){
            res.status(200).send(challange);
        }else{
            res.status(403);
        }

    }
    res.status(200).send('In Webhook')

});

app.post("/webhook",(req,res)=>{ //i want some 

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        console.log("inside body param");
        if (
            body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
          ) {
            let phon_no_id =
              body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
          
            console.log("phone number " + phon_no_id);
            console.log("from " + from);
            console.log("body param " + msg_body);
          
            axios({
              method: "POST",
              url:
                "https://graph.facebook.com/v17.0/" +
                phon_no_id +
                "/messages?access_token=" +
                token,
              data: {
                messaging_product: "whatsapp",
                to: from,
                text: {
                  body: "Hi.. I'm Wify, your message is " + msg_body,
                },
              },
              headers: {
                "Content-Type": "application/json",
              },
            })
              .then(() => {
                res.status(200).send("Message Sent...");
              })
              .catch((error) => {
                console.error("Error sending message:", error);
                res.status(500).send("Internal Server Error");
              });
          } else {
            res.status(404).send("Error Occur...");
          }          
    }
    res.status(200).send("Empty request...");
});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});

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

//     let body_param = req.body;
//     console.log(JSON.stringify(body_param,null,2));
//     if(body_param.object){
//         if(body_param.entry && body_param.entry[0].changes && body_param.entry[0].changes[0].value.messages && body_param.entry[0].changes[0].value.messages[0]){
//             let mob = body_param.entry[0].changes[0].value.metadata.phone_number_id;
//             let from =  body_param.entry[0].changes[0].value.messages[0].from;
//             let msg_body =  body_param.entry[0].changes[0].value.messages[0].text_body;

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
