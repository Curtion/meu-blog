let nodemailer = require('nodemailer');
 
let transporter = nodemailer.createTransport({
  service: 'smtp.126.com',
  host: "smtp.126.com",
  secureConnection: true,
  port:465,
  auth: {
      user: 'curtion@126.com',
      pass: '***********',
  }
});
 
exports.send = function(mailOptions) {
  mailOptions = mailOptions ? mailOptions : {
      from: '"竹影流浪" <curtion@126.com>', // login user must equel to this user
      to: 'icurtion@gmail.com', 
      subject: '简历',
      html: '简历好久给你' 
  };
 
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
}