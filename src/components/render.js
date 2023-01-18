const { ipcRenderer } = require('electron');
const puppeteer = require('puppeteer');

document.addEventListener('DOMContentLoaded', () => {
    const node = {
        submit: document.querySelector('.form_content .submit'),
        loader: document.querySelector('.loader_background'),
        websiteAddress: document.querySelector('.website_address > input'),
        xpath: document.querySelector('.xpath > input'),
    }
    node.submit.addEventListener('click', async (e) => {
        if(node.websiteAddress.value.trim() && node.xpath.value.trim()){
            node.loader.classList.add('show_loader');

            
            // - https://www.electronjs.org/docs/latest/tutorial/quick-start
            // - /html/body/div/div[3]/div/main/div/div/div[1]/div/article/div[2]
            const result = await main(node.websiteAddress.value, node.xpath.value);
            if(result){
                node.websiteAddress.value = '';
                node.xpath.value = '';
                ipcRenderer.send('main:newWindow', result);
            }
            node.loader.classList.remove('show_loader');
        }
    });
});
    
async function main(url, xpath) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.goto(url);
        const element = await page.$x(xpath);
        const html = await page.evaluate(el => el.innerHTML, element[0]);

        await browser.close();
        return html;
    } catch (err) {
        console.error(err);
    }
    return null;
};