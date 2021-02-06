// Include modules
const puppeteer = require('puppeteer');
const fs = require('fs');
const cronJob = require('cron').CronJob;
var nodemailer = require('nodemailer');

// Global variables
let username = NaN
let site_password = NaN
let email = NaN
let email_password = NaN
let value = NaN

/**
     * Get configuration details from json file.
     * @function config
*/
function config(){
	let configPromise = new Promise(
		(resolve, reject) => {
			fs.readFile('./config.json', (err, data) => {
				if (err){
					reject(err);
				}
				else{
					let config = JSON.parse(data);
					username = config[0]['username']
					site_password = config[0]['password']
					email = config[1]['username']
					email_password = config[1]['password']
					resolve('configure successful')
				}
			});
		}
	);
	return configPromise;
}

function notification(){
	// Allow less secure apps: ON

	var transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
		user: email,
		pass: email_password
		}
	});
	
	var mailOptions = {
		from: 'noreply@bezeq-limits.com',
		to: 'alon.ttp@gmail.com',
		subject: 'Bezeq limits',
		text: value
	};
	
	transporter.sendMail(mailOptions, function(error, info){
		if (error) {
		console.log(error);
		} else {
		console.log('Email sent: ' + info.response);
		}
	});
}

function getData() {
	let getDataPromise = new Promise(
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
				await page.type(selector2, site_password);
				const selector3 = "#loginByUsername > form > fieldset > div.floatDivLeft > div:nth-child(1) > button"
				await page.waitForSelector(selector3);
				await page.click(selector3);
				console.log('Login successful!');
				const selector4 = '#MainCategory_31 > div > div > div.widgetsRows.clearfix > div:nth-child(2) > div:nth-child(3)';
				await page.waitForSelector(selector4);
				await page.click("#Widget_186 > div > div");
				const selector5 = "#WorthinessInfoMinutes > span"
				await page.waitForSelector("#extension_188 > div > div > div.records.ng-scope");
				const element = await page.waitForSelector(selector5);
				value = await page.evaluate(element => element.textContent, element);
				resolve(value)
				await browser.close();
			})();
		}
	);
	return getDataPromise;
}

const job = new cronJob('*/300 * * * * *', () => {
	config().then( 
		(result) => { console.log(result)
			getData().then( 
				(result) => {
					if(result > 20){
						console.log(result);
					}
					else{
						console.log(result);
						if(result == 0){
							job.start();
						}
						else{
							notification()
						}
					}
				},
				(error) => { console.log("Bad error:" + error) }
			);
		},
		(error) => { console.log("Bad error:" + error) }
	);
});

job.start();