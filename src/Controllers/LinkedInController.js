import axios from 'axios';

const CLIENT_ID = '78b9afwvpxvaw8';
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = 'https://jobing.az/api/auth/linkedin/callback';

const LinkedInController = {

    /**
     * Step 1: Redirect user to LinkedIn authorization page
     */
    auth: (req, res) => {
        const url =
            'https://www.linkedin.com/oauth/v2/authorization' +
            '?response_type=code' +
            `&client_id=${CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
            '&scope=w_member_social';
        res.redirect(url);
    },

    /**
     * Step 2: LinkedIn redirects here with ?code=...
     * Exchange code for access token and save to .env
     */
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

            // Update .env with new token
            const envPath = process.env.ENV_PATH || '.env';
            const fs = await import('fs');
            let envContent = fs.readFileSync(envPath, 'utf8');

            if (envContent.includes('LINKEDIN_ACCESS_TOKEN=')) {
                envContent = envContent.replace(
                    /LINKEDIN_ACCESS_TOKEN=.*/,
                    `LINKEDIN_ACCESS_TOKEN=${access_token}`
                );
            } else {
                envContent += `\nLINKEDIN_ACCESS_TOKEN=${access_token}\n`;
            }

            if (!envContent.includes('LINKEDIN_PERSON_ID=')) {
                envContent += 'LINKEDIN_PERSON_ID=850595767\n';
            }

            fs.writeFileSync(envPath, envContent, 'utf8');

            res.send(
                `<html><body style="font-family:sans-serif;padding:40px;text-align:center">` +
                `<h1>✅ LinkedIn Token Alındı!</h1>` +
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
