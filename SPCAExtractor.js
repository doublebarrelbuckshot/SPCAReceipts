function SPCAExtractor(payment) {
    var payerinfo = payment.payer.payer_info;
    var address = payerinfo.shipping_address;

	this.id = payment.transactions[0].related_resources[0].sale.id;
    this.email = payerinfo.email;
    this.first_name = payerinfo.first_name;
    this.last_name = payerinfo.last_name;
    this.street = address.line1;
    this.city = address.city;
    this.state = address.state;
    this.postalcode = address.postal_code;
    this.countrycode = address.country_code;
    this.amount = payment.transactions[0].amount.total;
    this.createtime = payment.create_time;
}

module.exports = SPCAExtractor;