import axios from 'axios';
import * as cheerio from 'cheerio';

const scrapeHelper = async (url, res) => {
    try {
        const { data } = await axios.get(url);
        return cheerio.load(data);
    } catch (error) {
        console.error(error);
        res.status(500).send('Scraping error');
        return null;
    }
};

export default scrapeHelper;
