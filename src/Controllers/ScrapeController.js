import axios from 'axios';
import * as cheerio from 'cheerio';

const scrapeController = {
    getData: async (req, res) => {
        try {
            const url = 'https://boss.az';
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);

            const options = [];
            $('#search_category_id option').each((i, el) => {
                const value = $(el).attr('value');
                const text = $(el).text();
                options.push({ value, text });
            });

            res.json({
                options: options
            });
        } catch (error) {
            console.error(error);
            res.status(500).send('Scraping error');
        }
    }
};

export default scrapeController;
