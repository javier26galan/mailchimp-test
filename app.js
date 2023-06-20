const express = require('express');
const bodyParser = require('body-parser')
const request = require('request');
const https = require('https');

// api-key mailchimp 091350e1b3248bcd131ee020e6a23d25-us21
// id list dc35e80ebe
const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", (req, res) => {

    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.fEmail;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields:{
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const options = {
      method: "POST",
      auth: "dongalan:091350e1b3248bcd131ee020e6a23d25-us21",
    };
    const url = "https://us21.api.mailchimp.com/3.0/lists/dc35e80ebe";

    const request = https.request(url, options, (response) => {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/fairule.html");
        }

        response.on("data", (data) => {
            console.log(JSON.parse(data))
        });
    });

    request.write(jsonData);
    request.end();

})

app.post('/fairule', ()=>{
    res.redirect("/")
});

app.listen(process.env.PORT || 3000, ()=>{
    console.log('listening');
})