const fs = require('fs');
const https = require('https');

// Create a personal access token:
// * Go to nice.hipchat.com/account/api
// * Generate a new token with "View Messages" scope
// * Create a HIPCHAT_AUTH_TOKEN environment variable with the token

// Repeat calls, iterate start-index by 1000 until response.items is empty.

const ISO_STRING_NOW = (new Date()).toISOString();
const ROOM_ID = process.argv[2] || process.env.HIPCHAT_ROOM_ID;
const RESULT_SIZE = 1000;
const HISTORY_PATH = '/v2/room/' + ROOM_ID + '/history?max-results=' + RESULT_SIZE + '&reverse=false&date=' + ISO_STRING_NOW;
const AUTH_TOKEN = process.env.HIPCHAT_AUTH_TOKEN;

function sendRequest(startIndex, callback) {
    let options = {
        hostname: 'nice.hipchat.com',
        path: HISTORY_PATH + '&start-index=' + startIndex,
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
            callback(JSON.parse(responseContent));
        });
    });

    request.on('error', (e) => {
        console.log(`ERROR: ${e.message}`);
    });

    request.end();
}

let currentIndex = 0;
let iterationCount = 0;
let allMessages = [];

function fetchNextSet(callback) {
    sendRequest(currentIndex, (response) => {
        let currentMessages = response.items;

        if (response.items.length > 0) {
            Array.prototype.push.apply(allMessages, currentMessages);
            console.log(`Iteration ${iterationCount}, message count: ${allMessages.length}`);
            currentIndex += RESULT_SIZE;
            fetchNextSet(callback);
        } else {
            callback();
        }
    });

    iterationCount += 1;
}

fetchNextSet(() => {
    fs.writeFileSync('history.json', JSON.stringify(allMessages, null, 2), 'utf8');
    console.log(`Message Count: ${allMessages.length}`);
});
