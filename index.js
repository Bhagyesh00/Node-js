// index.js

const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;

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

    }else{
        res.status(200).send("/webhook");
    }

});

app.post("/webhook", (req, res) => {
    let body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2));

    try {
        if (body_param.object) {
            console.log("inside body param");
            if (
                body_param.entry &&
                body_param.entry[0].changes &&
                body_param.entry[0].changes[0].value.metadata &&
                body_param.entry[0].changes[0].value.messages &&
                body_param.entry[0].changes[0].value.messages[0]
            ) {
                let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
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
                    headers: {
                        "Content-Type": "application/json",
                    },
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: {
                            body: "Hi.. I'm Wify, your message is " + msg_body,
                        },
                    },
                })
                    .then(() => {
                        res.sendStatus(200);
                    })
                    .catch((error) => {
                        console.error("Error sending message:", error);
                        res.sendStatus(500);;
                    });
            } else {
                res.sendStatus(404);
            }
        }
        res.sendStatus(200);
    } catch (error) {
        console.error("Error:", error);
        res.sendStatus(500);
    }
});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});