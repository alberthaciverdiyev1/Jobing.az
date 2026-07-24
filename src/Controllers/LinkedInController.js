import fs from 'fs';
import path from 'path';
import axios from 'axios';

const CLIENT_ID = '78b9afwvpxvaw8';
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = 'https://jobing.az/api/auth/linkedin/callback';
const ENV_PATH = path.resolve(process.cwd(), '.env');

const LinkedInController = {

    auth: (req, res) => {
        const url =
            'https://www.linkedin.com/oauth/v2/authorization' +
            '?response_type=code' +
            `&client_id=${CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            '&scope=w_member_social%20openid%20profile%20email';
        res.redirect(url);
    },

    callback: async (req, res) => {
        const { code } = req.query;
        if (!code) {
            return res.status(400).send('Authorization failed — no code received.');
        }

        try {
            const tokenRes = await axios.post(
                'https://www.linkedin.com/oauth/v2/accessToken',
                null,
                {
                    params: {
                        grant_type: 'authorization_code',
                        code,
                        redirect_uri: REDIRECT_URI,
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET,
                    },
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                }
            );

            const { access_token, expires_in } = tokenRes.data;

            // Fetch person ID via OpenID Connect
            let personId = '850595767';
            try {
                const userInfoRes = await axios.get('https://api.linkedin.com/v2/userinfo', {
                    headers: { Authorization: `Bearer ${access_token}` }
                });
                if (userInfoRes.data && userInfoRes.data.sub) {
                    personId = userInfoRes.data.sub;
                }
            } catch (e) {
                // use fallback
            }

            let envContent = fs.readFileSync(ENV_PATH, 'utf8');

            if (envContent.includes('LINKEDIN_ACCESS_TOKEN=')) {
                envContent = envContent.replace(
                    /LINKEDIN_ACCESS_TOKEN=.*/,
                    `LINKEDIN_ACCESS_TOKEN=${access_token}`
                );
            } else {
                envContent += `\nLINKEDIN_ACCESS_TOKEN=${access_token}\n`;
            }

            if (envContent.includes('LINKEDIN_PERSON_ID=')) {
                envContent = envContent.replace(
                    /LINKEDIN_PERSON_ID=.*/,
                    `LINKEDIN_PERSON_ID=${personId}`
                );
            } else {
                envContent += `\nLINKEDIN_PERSON_ID=${personId}\n`;
            }

            fs.writeFileSync(ENV_PATH, envContent, 'utf8');

            res.send(
                `<html><body style="font-family:sans-serif;padding:40px;text-align:center">` +
                `<h1>✅ LinkedIn Token Alındı!</h1>` +
                `<p>Person ID: <strong>${personId}</strong></p>` +
                `<p>Token qüvvədədir: <strong>${Math.round(expires_in / 86400)} gün</strong></p>` +
                `<p>Tokenin sonu: ${new Date(Date.now() + expires_in * 1000).toLocaleDateString('az-AZ')}</p>` +
                `<p>İndi bu səhifəni bağlaya bilərsiniz.</p>` +
                `<p style="color:#666;font-size:13px;margin-top:30px">Jobing.az - LinkedIn Auto-Share</p>` +
                `</body></html>`
            );
        } catch (error) {
            const detail = error.response?.data?.error_description || error.response?.data?.error || error.message;
            res.status(500).send(
                `<html><body style="font-family:sans-serif;padding:40px;text-align:center">` +
                `<h1>❌ Xəta baş verdi</h1>` +
                `<p style="color:red">${detail}</p>` +
                `</body></html>`
            );
        }
    },
};

export default LinkedInController;
