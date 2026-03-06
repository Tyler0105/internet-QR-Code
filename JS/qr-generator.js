const QRCode = require('qrcode');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query) => new Promise(resolve => rl.question(query, resolve));

async function createQRImage(data, filename) {
    try {
        await QRCode.toFile(filename, data, {
            errorCorrectionLevel: 'H',
            margin: 4,
            width: 300,
            color: { dark: '#000000', light: '#FFFFFF' }
        });
        console.log(`\nSuccess! QR code saved successfully as '${filename}'.\n`);
    } catch (err) {
        console.error(`\nError generating QR code:`, err, `\n`);
    }
}

async function menu() {
    while (true) {
        console.log("=== Permanent QR Code Generator ===");
        console.log("1. Webpage URL");
        console.log("2. WiFi Login");
        console.log("3. Exit");
        
        const choice = (await askQuestion("Select an option (1-3): ")).trim();

        if (choice === '1') {
            const url = (await askQuestion("Enter the webpage URL (e.g., https://example.com): ")).trim();
            if (!url) {
                console.log("\nURL cannot be empty.\n");
                continue;
            }
            
            let filename = (await askQuestion("Enter filename to save as (default: url_qr.png): ")).trim();
            if (!filename) filename = "url_qr.png";
            
            await createQRImage(url, filename);

        } else if (choice === '2') {
            const ssid = (await askQuestion("Enter the WiFi Network Name (SSID): ")).trim();
            if (!ssid) {
                console.log("\nNetwork Name (SSID) cannot be empty.\n");
                continue;
            }

            const password = (await askQuestion("Enter the WiFi Password (leave blank if none): ")).trim();
            
            console.log("Select Encryption Type:");
            console.log("1. WPA/WPA2/WPA3 (Most common)");
            console.log("2. WEP (Older, less secure)");
            console.log("3. None (Open network)");
            const encChoice = (await askQuestion("Choose (1-3, default 1): ")).trim();
            
            let encryption = 'WPA';
            if (encChoice === '2') encryption = 'WEP';
            if (encChoice === '3' || !password) encryption = 'nopass';

            const hiddenChoice = (await askQuestion("Is this a hidden network? (y/n, default n): ")).trim().toLowerCase();
            const hiddenStr = hiddenChoice === 'y' ? 'true' : 'false';

            const wifiData = `WIFI:T:${encryption};S:${ssid};P:${password};H:${hiddenStr};;`;

            let filename = (await askQuestion("Enter filename to save as (default: wifi_qr.png): ")).trim();
            if (!filename) filename = "wifi_qr.png";

            await createQRImage(wifiData, filename);

        } else if (choice === '3') {
            console.log("Exiting.");
            rl.close();
            break;
        } else {
            console.log("\nInvalid choice. Please enter 1, 2, or 3.\n");
        }
    }
}

menu();