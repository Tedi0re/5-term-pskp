const puppeteer = require('puppeteer');

(async () => {
   const browser = await puppeteer.launch({
        headless: true,
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        args: ['--incognito'],
        defaultNavigationTimeout: 60000,
        //executablePath : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    });
    const page = await browser.newPage();

    // Перейдите на страницу входа
    await page.goto('https://www.21vek.by/');
    //принять куки
    console.log('pre wait')
        //await page.waitForSelector('button[class="Button-module__button Button-module__blue-primary"]');
    await page.waitForSelector('button[class="Button-module__button AgreementCookie_reject__f5oqP Button-module__gray-secondary"]');
    console.log('post wait');
    await page.click('button[class="Button-module__button AgreementCookie_reject__f5oqP Button-module__gray-secondary"]');
    console.log('click');
    await page.waitForSelector('button[class="Button-module__button AgreementCookie_reject__f5oqP Button-module__gray-secondary"]');
    console.log('post second wait');
    await page.click('button[class="Button-module__button AgreementCookie_reject__f5oqP Button-module__gray-secondary"]');
    console.log('second click');

    //
    await page.click('button[class="Button-module__button Button-module__blue-primary"]');

    //кнопка аккаунт
    await page.waitForSelector('button[class="styles_userToolsToggler__c2aHe"]');
    await page.click('button[class="styles_userToolsToggler__c2aHe"]');
    //нопка войти
    await page.waitForSelector('button[data-testid="loginButton"]');
    await page.click('button[data-testid="loginButton"]');
    //ввод email
    await page.type('#login-email', 'simonovandrej522@gmail.com');

    //ввод password
    await page.type('#login-password', '123456');
    //кнопка войти
    await page.click('button[data-testid="loginSubmit"]') ;

    // Проверьте, что вы вошли на сайт, например, проверяя наличие элемента на новой странице
    const loggedInElement = await page.$('span[class="userToolsSubtitle"]');
    if (loggedInElement) {
        console.log('Вход выполнен успешно.');
    } else {
        console.error('Ошибка входа.');
    }

    // Закройте браузер
    await browser.close();
})();
