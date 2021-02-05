const puppeteer = require('puppeteer');
const fs = require('fs');

var password = NaN
var username = NaN
var value = NaN


function config(){
	let myPromise = new Promise(
		(resolve, reject) => {
			fs.readFile('./config.json', (err, data) => {
				if (err) throw err;
				let config = JSON.parse(data);
				password = config[0]['password']
				username = config[0]['username']
				resolve('configure successful')
			});
		}
	);
	return myPromise;
}


function getData() {
	let myPromise = new Promise(
		(resolve, reject) => {
			(async () => {
				const browser = await puppeteer.launch({
					headless: true,
					defaultViewport: null,
					args: [
                        '--no-sandbox', 
                        '--disable-setuid-sandbox',
						'--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.132 Safari/537.36',
						'--user-data-dir=/tmp/user_data/',
                        '--disable-dev-shm-usage',
						'--window-size=1200,800'
    					],
				});
				const page = await browser.newPage();
				const query = "https://bmy.bezeq.co.il/actions/login?appid=WORTHINESS&WT.isp=menu"
				await page.goto(query, {waitUntil : 'domcontentloaded' }).catch(e => void 0)
				
				const selector = '#loginBySms';
				await page.waitForSelector(selector);
				await page.click("#tabpanel > div > div.floatDiv.logintype.loginIcon.notactive");
				const selector1 = '#loginByUsername > form > fieldset > div:nth-child(3) > div:nth-child(1) > div > input';
				await page.waitForSelector(selector1);
				await page.type(selector1, username);
				const selector2 = '#loginByUsername > form > fieldset > div:nth-child(3) > div:nth-child(2) > div > input';
				await page.waitForSelector(selector2);
				await page.type(selector2, password);
				const selector3 = "#loginByUsername > form > fieldset > div.floatDivLeft > div:nth-child(1) > button"
				await page.waitForSelector(selector3);
				await page.click(selector3);
				console.log('\x1b[33m%s\x1b[0m','Login successful!');
				const selector4 = '#MainCategory_31 > div > div > div.widgetsRows.clearfix > div:nth-child(2) > div:nth-child(3)';
				await page.waitForSelector(selector4);
				await page.click("#Widget_186 > div > div");
				const selector5 = "#WorthinessInfoMinutes > span"
				await page.waitForSelector("#extension_188 > div > div > div.records.ng-scope");
				const element = await page.waitForSelector(selector5);
				value = await page.evaluate(element => element.textContent, element);
				//console.log(value);
				resolve(value)
				await browser.close();
			})();
		}
	);
	return myPromise;
}

config().then( (result) => {
	console.log('\x1b[33m%s\x1b[0m',result)
	getData().then( (result) => {

		if(result > 20){
			console.log(result);
		}
		else{
			emailNotification()
			console.log(result);
		}
	});
});