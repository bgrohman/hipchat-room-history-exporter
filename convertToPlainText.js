const fs = require('fs');
const path = require('path');

function convertToString(messageObjects) {
    let messages = [];

    for (var i = messageObjects.length - 1; i >= 0; i--) {
        let message = messageObjects[i];
        messages.push(`${message.date} ${message.from.name}: ${message.message}`);
    }

    return messages.join('\n');
}

function convert(jsonFilePath, outputFilePath) {
    let messagesObject = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    let messagesString = convertToString(messagesObject);
    fs.writeFileSync(outputFilePath, messagesString, 'utf8');
}

const inputFilePath = path.resolve(process.argv[2]);
const outputFilePath = path.resolve(process.argv[3]);
convert(inputFilePath, outputFilePath);
