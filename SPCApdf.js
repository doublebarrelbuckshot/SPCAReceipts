var PDFDocument = require('pdfkit');
var fs = require('fs');
var dateFormat = require('dateformat');


function SPCApdf(pdfInfo, callback) {
    doc = new PDFDocument
	writeStream = fs.createWriteStream(pdfInfo.id + ".pdf");
        //Pipe it's output somewhere, like to a file or HTTP response
        // See below for browser usage
    doc.pipe(writeStream);

	var initialX = doc.x
    var starty = 10;
    var spcaRed = '#ba0c2f'
    var black = 'black';
    doc.fontSize(10);
    doc.text("LA SOCIÉTÉ POUR LA PRÉVENTION DE LA CRUAUTÉ ENVERS LES ANIMAUX (CANADIENNE)/ THE CANADIAN SOCIETY FOR THE PREVENTION OF CRUELTY TO ANIMALS", doc.x, starty, {
        align: 'center'
    })
    movingyAddress = 40;

    doc.fontSize(12);
    var addressx = 75;
    doc.image('images/spcalogo.png', 15, movingyAddress, {
        width: 50
    })
    doc.text("5215, Jean-Talon Ouest", addressx, movingyAddress);
    movingyAddress = nextLine(movingyAddress, 15);
    doc.text("Montreal, Quebec H4P 1X4", addressx, movingyAddress);
    movingyAddress = nextLine(movingyAddress, 15);
    doc.text("www.spca.com", addressx, movingyAddress);
    movingyAddress = nextLine(movingyAddress, 15);
    doc.text("admin@spca.com", addressx, movingyAddress);
    movingyAddress = nextLine(movingyAddress, 15);


    doc.fontSize(8);
    var officialreceiptx = 350;
    var movingyOfficialReceipt = 50;
    doc.text("REÇU DE DON OFFICIEL AUX FINS D'IMPÔT", officialreceiptx, movingyOfficialReceipt, {
        align: 'center'
    });
    movingyOfficialReceipt = nextLine(movingyOfficialReceipt, 10);
    doc.text("OFFICIAL DONATION RECEIPT", officialreceiptx, movingyOfficialReceipt, {
        align: 'center'
    });
    movingyOfficialReceipt = nextLine(movingyOfficialReceipt, 10);
    doc.text("FOR INCOME TAX PURPOSES", officialreceiptx, movingyOfficialReceipt, {
        align: 'center'
    });
    movingyOfficialReceipt = nextLine(movingyOfficialReceipt, 10);
    doc.text("Émis à Montréal / Issued in Montreal", officialreceiptx, movingyOfficialReceipt, {
        align: 'center'
    });
    movingyOfficialReceipt = nextLine(movingyOfficialReceipt, 10);

    //Draw red square
    doc.rect(15, movingyAddress, 200, 175)
    doc.strokeColor(spcaRed)
        .lineWidth(3)
        .stroke();


    doc.fontSize(10);
    movingyAddress = nextLine(movingyAddress, 12);
    doc.fillColor(spcaRed)
        .text("CATÉGORIE/CATEGORY:", 20, movingyAddress, {
            underline: true
        });
    movingyAddress = nextLine(movingyAddress, 12);

    doc.fillColor(black)
        .text("Don/Donation", 20, movingyAddress);
    movingyAddress = nextLine(movingyAddress, 15);

/*
*PRINT DATE
*/
	var printDate = dateFormat(new Date(), "yyyy-mm-dd");
    doc.fillColor(spcaRed)
        .text("DATE D'IMPRESSION/PRINT DATE:", 20, movingyAddress, {
            underline: true
        });
    movingyAddress = nextLine(movingyAddress, 12);
    doc.fillColor(black)
        .text(printDate, 20, movingyAddress);
    movingyAddress = nextLine(movingyAddress, 10);
	
	//draw line under date
	doc.moveTo(20, movingyAddress)                            
		.lineTo(210, movingyAddress) 
		.lineWidth(1)
		.stroke() 
		
	movingyAddress = nextLine(movingyAddress, 2);
    doc.fontSize(8);
	doc.fillColor(spcaRed)
        .text("A/Y M/M J/D", 20, movingyAddress);
		movingyAddress = nextLine(movingyAddress, 15);
	doc.fontSize(10);

/*
* DONATION
*/
    doc.fillColor(spcaRed)
        .text("DON/DONATION:", 20, movingyAddress, {
            underline: true
        });
    movingyAddress = nextLine(movingyAddress, 12);
    doc.fillColor(black)
        .text(pdfInfo.amount + " $", 20, movingyAddress);
    movingyAddress = nextLine(movingyAddress, 15);

	/*
	*DATE RECEIVED
	*/
	var donationDate = dateFormat(Date.parse(pdfInfo.createtime), "yyyy-mm-dd");
    doc.fillColor(spcaRed)
        .text("DATE DE RÉCEPTION/DATE RECEIVED:", 20, movingyAddress, {
            underline: true
        });
    movingyAddress = nextLine(movingyAddress, 12);
    doc.fillColor(black)
        .text(donationDate, 20, movingyAddress);
    movingyAddress = nextLine(movingyAddress, 10);
	
	//draw line under date
	doc.moveTo(20, movingyAddress)                            
		.lineTo(210, movingyAddress) 
		.lineWidth(1)
		.stroke() 
		
	movingyAddress = nextLine(movingyAddress, 2);
    doc.fontSize(8);
	doc.fillColor(spcaRed)
        .text("A/Y M/M J/D", 20, movingyAddress);
		movingyAddress = nextLine(movingyAddress,  20);
	doc.fontSize(10);
	
	/*
	* RECEIPT NUMBER
	*/
    doc.fillColor(spcaRed)
        .text("No. REÇU/RECEIPT NUMBER:", 20, movingyAddress, {
            underline: true
        });
		 
    movingyAddress = nextLine(movingyAddress, 12);
    doc.fillColor(black)
        .text(pdfInfo.id, 20, movingyAddress);
   
	
	
	/*
	*RIGHT OF SQUARE, NAME AND ADDRESS
	*/
	var nameAddressY = 150
	 doc.fillColor(black)
        .text(pdfInfo.first_name + " " + pdfInfo.last_name, 230, nameAddressY);
    nameAddressY = nextLine(nameAddressY, 10);
	
	 doc.fillColor(black)
        .text(pdfInfo.street, 230, nameAddressY);
    nameAddressY = nextLine(nameAddressY, 10); 
	
	doc.fillColor(black)
        .text(pdfInfo.city + ", " + pdfInfo.state + " " + pdfInfo.postalcode + ", " + pdfInfo.countrycode, 230, nameAddressY);
    nameAddressY = nextLine(nameAddressY, 10);
	
	
	
	/*
	* BOTTOM LINE AND SECTION
	*/
	movingyAddress = nextLine(movingyAddress,  25);
	doc.moveTo(15, movingyAddress)                            
		.lineTo(600, movingyAddress) 
		.lineWidth(2)
		.stroke() 
	
	
	movingyAddress = nextLine(movingyAddress,  5);
	doc.fontSize(8);
	doc.fillColor(black)
        .text("Siège social/Head Office: 5215 Jean-Talon Ouest * Montréal, Québec H4P 1X4 * Tél.: 514-735-2711 ext. 2240", initialX, movingyAddress, {align: 'center'});
    movingyAddress = nextLine(movingyAddress, 8); 
	
	doc.text("www.spca.com * admin@spca.com",  initialX, movingyAddress, {align: 'center'}); 
	movingyAddress = nextLine(movingyAddress, 8); 
	
	doc.text("Agence du revenue du Canada - www.cra-arc.gc.ca/bienfaisance",  15, movingyAddress);
	doc.text("Numéro d'organisme caritatif",  400, movingyAddress);
	
	movingyAddress = nextLine(movingyAddress, 8); 
	
	
	doc.text("Canada Revenue Agency - www.cra.arc.gc.ca/charities",  15, movingyAddress);
	doc.text("Charitable ID#: 11921 9954 RR0001",  400, movingyAddress);
	movingyAddress = nextLine(movingyAddress, 8); 
	
	
	
	/*
	* DASHED LINE
	*/
	movingyAddress = nextLine(movingyAddress,  10);
	doc.moveTo(15, movingyAddress)                            
		.lineTo(590, movingyAddress) 
		.lineWidth(2)
		.strokeColor(black)
		.dash(5, {space:10})
		.stroke() 
	
	 doc.end();
	 writeStream.on('finish', function(){
		 callback(true)
	 });
}

function nextLine(y, dist) {
    return y + dist;
}

module.exports = SPCApdf;