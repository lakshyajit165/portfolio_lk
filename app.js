const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const fs = require('fs');

const app = express();

//View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars',exphbs({defaultLayout:'layout'})); 
app.set('view engine', 'handlebars');

//Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req,res) => {
	res.render('home');
});


//Mailing Functionality
app.post('/send', (req,res) => {
	
  

            const output = `

        		<p>You have a new contact request!</p>
        		<h3>Contact Details:</h3>
        		<ul>
        			<li>Email: ${req.body.email}</li>
        			<li>Name : ${req.body.name}</li>
        			<li>Phone: ${req.body.phone}</li>
        		</ul>
        		<h3>Message</h3>
        		<p>${req.body.message}</p>
        	`;

        	// create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com', //'smtp.ethereal.email',
                port: 587,//587
                secure: false, // true for 465, false for other ports
                auth: {
                    user: 'lakshmeekant@gmail.com', // generated ethereal user
                    pass: 'lcxlzbdxwsvdcwno'//account.pass ''// generated ethereal password
                },
                tls:{
                	rejectUnauthorized: false
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: '"My Site" <contact@iamlakshyajit.in>', // sender address
                to: 'lakshyajit165@gmail.com', // list of receivers
                subject: 'Node Contact Request', // Subject line
                text: 'Hello world?', // plain text body
                html: output // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    res.render('home',{msg:'Message NOT sent...Please try again!',val:`${req.body.name}`});
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                res.render('home',{msg:'Message sent..Will get back to you soon!',val:`${req.body.name}`});

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
           
});



app.get('/CV', (req, res) =>{
  const File="./public/images/Resume.pdf";
  fs.readFile(File, (err,data) => {
     res.contentType("application/pdf");
     res.send(data);
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started...'));