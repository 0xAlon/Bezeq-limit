const puppeteer = require('puppeteer');
var api_key = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
var domain = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
const password = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
const username = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
let value = NaN


function getData(){
	(async () => {
		const browser = await puppeteer.launch({headless: false});
		const page = await browser.newPage();
		const query = "https://bmy.bezeq.co.il/actions/login?appid=WORTHINESS&WT.isp=menu"
		await page.goto(query, {waitUntil : 'networkidle2' }).catch(e => void 0);
		console.log("Enter to bmy.bezeq.co.il");
		
		const selector = '#loginBySms';
		await page.waitForSelector(selector);
		await page.click("#tabpanel > div > div.floatDiv.logintype.loginIcon.notactive");
		console.log("Login by password");

		const selector1 = '#loginByUsername > form > fieldset > div:nth-child(3) > div:nth-child(1) > div > input';
		await page.waitForSelector(selector1);
		await page.type(selector1, username);
	
		const selector2 = '#loginByUsername > form > fieldset > div:nth-child(3) > div:nth-child(2) > div > input';
		await page.waitForSelector(selector2);
		await page.type(selector2, password);
	
		const selector3 = "#loginByUsername > form > fieldset > div.floatDivLeft > div:nth-child(1) > button"
		await page.waitForSelector(selector3);
		await page.click(selector3);
		console.log("Login successful!");
	
		const selector4 = '#MainCategory_31 > div > div > div.widgetsRows.clearfix > div:nth-child(2) > div:nth-child(3)';
		await page.waitForSelector(selector4);
		await page.click("#Widget_186 > div > div");
	
		const s = "#extension_188 > div > div"
	
		const selector5 = "#WorthinessInfoMinutes > span"
		await page.waitForSelector("#extension_188 > div > div > div.records.ng-scope");
		const element = await page.waitForSelector(selector5);
		value = await page.evaluate(element => element.textContent, element);
		console.log(value);
		await browser.close();
		emailNotification()
	  })();
}

function emailNotification(){
	var data = {
		from: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
		to: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
		subject: 'Bezeq limit',
		text: value
	  };
	   
	  mailgun.messages().send(data, function (error, body) {
		console.log(body);
	  });
}

getData()