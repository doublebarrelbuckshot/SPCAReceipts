var nodemailer = require('nodemailer');
var fs = require('fs');


function SPCAReceipt(pdfinfo){
	this.pdfinfo = pdfinfo;
}

SPCAReceipt.prototype.send = function(callback){
	var self = this;
var nodemailerMailgun = nodemailer.createTransport({
	service: 'Mailgun',
	auth: {
		user: 'postmaster@mg.walterrizzifoundation.com',
		pass: 'e5f6a8be5301b99083adc8f0dcc6fe50'
	}
});

var filePath = __dirname + "/" + self.pdfinfo.id + ".pdf"

nodemailerMailgun.sendMail({
  from: 'myemail@walterrizzifoundation.com',
  to: self.pdfinfo.email, // An array if you have multiple recipients.
  bcc:'giancarlo.rizzi@gmail.com',
  subject: 'SPCA Tax Receipt',
  'h:Reply-To': 'reply2this@company.com',
  //You can use "html:" to send HTML email content. It's magic!
  html:  "insert message here",
  text:"",
  attachments: [{
	  filename:'RecuImpots-TaxReceipt-SPCA.pdf',
	  path: filePath
  }]
  //You can use "text:" to send plain-text content. It's oldschool! 
}, function(error, response){
	if(error){
	callback('error');
	console.log(error);
	fs.unlinkSync(filePath);
	}
	else{
		callback('success');
		fs.unlinkSync(filePath);
	}
}); 


}
module.exports = SPCAReceipt;