import fs from 'fs';
import fsp from 'fs/promises';
import http from 'http';
import path from 'path';
import url from 'url';
import { fileURLToPath } from 'url';
import replaceTemplate from './replaceTemplate.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getFixturePath = (filename) => path.join(__dirname, filename);

const overviewTemp = fs.readFileSync(getFixturePath('./templates/overview-temp.html'), 'utf-8');
const productTemp = fs.readFileSync(getFixturePath('./templates/product-temp.html'), 'utf-8');
const cardTemp = fs.readFileSync(getFixturePath('./templates/card-temp.html'), 'utf-8');
const jsonData = fs.readFileSync(getFixturePath('./dev-data/data.json'), 'utf-8');
const dataObj = JSON.parse(jsonData);

/*
const replaceTemplate2 = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
  }
  return output;
};

const replaceTemplate = (template, product) => {
  const dataKeys = Object.keys(product);
  const output = dataKeys.reduce((acc, it) => {
    const placeholder = `{%${it.toUpperCase()}%}`;
    const newAcc = acc.replaceAll(placeholder, product[it]);
    
    return newAcc;
  }, template);
  if (!product.organic) {
    const res = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return res;
  }
  return output;
};
*/

// http://127.0.0.1:8000/
const setServer = () => {
  const server = http.createServer((req, res) => {
    // const reqURL = req.url;
    // const parsedURL = url.parse(req.url, true);
    // const pathName = parsedURL.pathname;
    // console.log(reqURL);
    // console.log('BASYAA', parsedURL.query.id);
    const { pathname, query } = url.parse(req.url, true);

    switch (pathname) {
      /*
      case '/':
        res.end('Privet from the server! Meow!');
        break;
      */
      case '/':
      case '/overview':
        res.writeHead(200, {
          'Content-type': 'text/html',
        });

        const cardsHtml = dataObj.map((el) => replaceTemplate(cardTemp, el)).join('');
        const filledOverviewHtml = overviewTemp.replaceAll('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(filledOverviewHtml);

        // res.end('Privet from the OVERVIEW');
        break;
      case '/product':
        res.writeHead(200, {
          'Content-type': 'text/html',
        });
        const productData = dataObj[query.id];
        // const productData = dataObj.find((prd) => prd.id.toString() === query.id);
        const productHtml = replaceTemplate(productTemp, productData);
        // console.log('FOUND', productData);
        res.end(productHtml);
        break;
      case '/api':
        res.writeHead(200, {
          'Content-type': 'application/json',
        });
        res.end(jsonData);
        break;
      default:
        res.writeHead(404, {
          'Content-type': 'text/html',
          'my-own-header': 'mrrrp!!',
        });
        res.end('<h1>Page not found</h1>');
    }
  });

  return server;
};

const server = setServer();

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
