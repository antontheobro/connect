const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Replace with your bot's token
const TOKEN = '7901428301:AAFaOAc3hZ2OogEgQboM54crQ2HU2RVw1_E';
const bot = new TelegramBot(TOKEN, { polling: true });

// Listen for any incoming message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  
  if (msg.document) {
    // If the user sent a document (file)
    handleFileUpload(msg.document, chatId);
  } else if (msg.photo) {
    // If the user sent a photo (file)
    const fileId = msg.photo[msg.photo.length - 1].file_id; // Get the highest quality photo
    handleFileUpload({ file_id: fileId }, chatId);
  } else {
    // Handle other types of messages (e.g., text)
    bot.sendMessage(chatId, 'Please send a file.');
  }
});

// Function to download the file from Telegram
function handleFileUpload(file, chatId) {
  const fileId = file.file_id;
  
  // Get file details from Telegram
  bot.getFile(fileId).then((fileDetails) => {
    const filePath = fileDetails.file_path;
    
    // Download the file
    const fileUrl = `https://api.telegram.org/file/bot${TOKEN}/${filePath}`;
    
    // Save the file to disk (you can customize the file path as needed)
    const fileName = path.basename(filePath);
    const savePath = path.join(__dirname, 'downloads', fileName);

    axios({
      url: fileUrl,
      method: 'GET',
      responseType: 'stream',
    }).then((response) => {
      response.data.pipe(fs.createWriteStream(savePath));
      
      // Notify user that file is saved
      bot.sendMessage(chatId, `File has been saved: ${fileName}`);
    }).catch((error) => {
      console.error('Error downloading the file:', error);
      bot.sendMessage(chatId, 'There was an error downloading the file.');
    });
  }).catch((error) => {
    console.error('Error getting file from Telegram:', error);
    bot.sendMessage(chatId, 'There was an error getting the file details.');
  });
}