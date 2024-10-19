import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const scrapeHelper = async (url, html = null, res,) => {
    try {
        let data = {};
        if (html) {
            const filePath = path.join(__dirname, url);
            data = fs.readFileSync(filePath, 'utf8');
            return cheerio.load(data);
        } else {
            const { data } = await axios.get(url);
            return cheerio.load(data);
        }
    } catch (error) {
        console.error(error); 
        throw new Error('Error fetching jobs' + error);
    }
};

export default scrapeHelper;
