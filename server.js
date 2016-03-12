var http = require('http');
var express = require('express');
var app = express();
var paypal = require('paypal-rest-sdk');
var SPCAReceipt = require('./SPCAReceipt.js')
var SPCAExtractor = require('./SPCAExtractor.js');
var fs = require('fs')


var SPCApdf = require('./SPCApdf.js');


var basicRouter = express.Router();

paypal.configure({
    'mode': 'live', //sandbox or live 
    'client_id': 'AYoNGOVMZGUeur10Oj_4S5eLHq8R24lqvdbicZj6B60lwQhvCZB5pUSeQFzIidXZLN_gUnbVIcQq_G_p',
    'client_secret': 'EA1Gdf_utjd7wu4tkgN3pYK2X8YHRV1XC4O9RTotul-CI98vKkNrqgZrsd9uxV2gljJreIOgGNws0f7Z'
});
 
 
 basicRouter.get('/pdf/download/:tid', function(req, res){
	 paypal.sale.get(req.params.tid, function(error, transaction) {
        if (error) {
            console.log(error);
            res.status(500).send('Cant find that transaction id!');
        } else {
            if (transaction.state = "approved") {	
				paymentNumber = transaction.parent_payment
				paypal.payment.get(paymentNumber, function(error, payment){ 
					processPaymentAndDownload(payment, function(extractedInfo){
						var filePath = __dirname + "\\" + extractedInfo.id + ".pdf";
						console.log(filePath);
						fs.stat(filePath, function(e, stats) {
							if(e) throw e;

							var stream = fs.createReadStream(filePath );

							res.setHeader('Content-disposition', 'inline; filename="taxreceipt.pdf"');
							res.setHeader('Content-Length', stats.size);
							res.setHeader('Content-type', 'application/pdf');

							stream.pipe(res); 
													stream.on('close', function(){
							fs.unlink(filePath)
						})
							});							
						})
					
					})
				}
			}
		})
 })

 
 
basicRouter.get('/pdf/transaction/:tid', function(req, res) {
	paypal.sale.get(req.params.tid, function(error, transaction) {
        if (error) {
            console.log(error);
            res.status(500).send('Cant find that payment id!');
        } else {
            if (transaction.state = "approved") {
				paymentNumber = transaction.parent_payment
				paypal.payment.get(paymentNumber, function(error, payment){ 
					processPaymentAndSendEmail(payment, function(result){
					res.send(result);
					console.log("transaction success");
            })
				})
        }
    };
});
});


function processPaymentAndDownload(payment, callback){
	processPayment(payment, function(extractedInfo){
		     callback(extractedInfo);                   
	})
}
function processPayment(payment, callback){
		        var extractedInfo = new SPCAExtractor(payment);
                var PDFReceipt = new SPCApdf(extractedInfo, function(result) {
                    if (result) {
						callback(extractedInfo)
					}
				})
}
function processPaymentAndSendEmail(payment, callback){
	processPayment(payment, function(extractedInfo){
		                        var receipt = new SPCAReceipt(extractedInfo);
                        receipt.send(function(msg) {
                            callback(JSON.stringify({
                                'message': msg
                            }));
                        });
	})
	       
}

basicRouter.get('/pdf/payment/:pid', function(req, res) {
    paypal.payment.get(req.params.pid, function(error, payment) {
        if (error) {
            console.log(error);
            res.status(500).send('Cant find that payment id!');
        } else {
            if (payment.state = "approved") {
				processPaymentAndSendEmail(payment, function(result){
					res.send(result);
					console.log("payment success")
				});
            }
        }
    });
});

app.use('/', basicRouter);
app.listen(8080);
console.log('server started');