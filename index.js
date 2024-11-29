const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// Define the path for session storage
const sessionPath = './sessions';  // This is where session data will be saved

// Initialize the client with session handling
const client = new Client({
    authStrategy: new LocalAuth({
        clientId: "whatsapp_bot",  // Unique session ID
        dataPath: sessionPath,  // Use a local folder to store session data
    }),
    puppeteer: {
        headless: true, 
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ]
    }
});

// Check if session already exists
const checkSession = () => {
    // Check if the session folder exists
    if (fs.existsSync(sessionPath)) {
        console.log("Session folder found. Trying to load session...");
    } else {
        console.log("No session found. Please scan the QR code to authenticate.");
    }
};

// Event when QR code is generated
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code above with your WhatsApp');
});

// Event when authentication is successful
client.on('authenticated', () => {
    console.log('Authenticated successfully!');
});

// Event when client is ready to receive messages
client.on('ready', () => {
    console.log('WhatsApp Bot is ready!');
    
    // Listen for incoming messages
    client.on('message', msg => {
        const userMessage = msg.body.toLowerCase();
        const responseKeywords = [
            'ممكن تبعت كتاب', 'ممكن كتب', 'ممكن كتاب', 'ممكن الكتب',
            'ينفع تعبت كتاب', 'ابعت كتاب', 'ابعت كتب',
            'المواد التي ندرسها', 'مواد الكلية', 'إبعتلي الكتب'
        ];

        if (responseKeywords.some(keyword => userMessage.includes(keyword))) {
            msg.reply('Here is the link to the materials: https://drive.google.com/drive/folders/1cOm2lvTV2fssx90WrC0FSAgkjIMXFx8Q?usp=sharing');
        }
    });
});

// Event when client is disconnected
client.on('disconnected', (reason) => {
    console.log('WhatsApp Bot disconnected:', reason);
    reconnect();
});

// Event when authentication fails
client.on('auth_failure', (msg) => {
    console.error('Authentication failed:', msg);
});

// Reconnect function if disconnected
function reconnect() {
    console.log('Reconnecting...');
    client.initialize();
}

// Check if a valid session exists before starting the client
checkSession();
client.initialize();  // Initialize the WhatsApp client
