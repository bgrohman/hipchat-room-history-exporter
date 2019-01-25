const https = require('https');

// Create a personal access token:
// * Go to nice.hipchat.com/account/api
// * Generate a new token with "View Messages" scope
// * Create a HIPCHAT_AUTH_TOKEN environment variable with the token

const ROOM_ID = process.argv[2] || process.env.HIPCHAT_ROOM_ID;
const HISTORY_PATH = '/v2/room/' + ROOM_ID + '/history';
const AUTH_TOKEN = process.env.HIPCHAT_AUTH_TOKEN;

function sendRequest(callback) {
    let options = {
        hostname: 'nice.hipchat.com',
        path: HISTORY_PATH,
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + AUTH_TOKEN
        }
    };

    let request = https.request(options, (response) => {
        let responseContent = '';
        response.setEncoding('utf8');

        response.on('data', (chunk) => {
            responseContent += chunk;
        });

        response.on('end', () => {
            callback(responseContent);
        });
    });

    request.on('error', (e) => {
        console.log(`ERROR: ${e.message}`);
    });

    request.end();
}

sendRequest((response) => {
    console.log(response);
});
