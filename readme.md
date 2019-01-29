# hipchat-room-history-exporter

## Overview

Since HipChat is shutting down on February 15th, 2019, you may want to archive
your rooms. HipChat group administrators have the option to export history for
all rooms, but there is no option to export a single room. This script exports
all messages from a single HipChat room.

## Setup

1. Create a personal access token by navigating to your HipChat site at
   `/account/api` (e.g. <https://hipchat.com/account/api>). Your token must have
   the "View Messages" scope.
2. Create a `HIPCHAT_AUTH_TOKEN` environment variable with your new token.
3. Find the room ID for the room you want to export. You can find this by
   navigating to your HipChat site at `/rooms`, searching for the room by name,
   and clicking on the room name. The "API ID" field listed in the "Room Details"
   section is what you need.
4. Create a `HIPCHAT_ROOM_ID` environment variable with your room ID, or pass
   the room ID to the script as the first argument.

## Usage

Make sure you have Node.js installed, and run the script with the following
command:

```
node export.js
```

The script fetches messages in groups of 1000 and logs the current iteration and
message count to the console as it executes.

When all of the message history has been retrieved, it will be written to the
`history.json` file in the current directory.

You can use the `convertToPlainText.js` script to convert the JSON output into
a plain text file:

```
node convertToPlainText.js <json-file-path> <output-text-file-path>
```
