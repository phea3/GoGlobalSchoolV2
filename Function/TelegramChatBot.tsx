import axios from "axios";

const BOT_API_TOKEN = "6017570441:AAH97g8HOGxroGZA8K7828hNS5-pNQSkF84";
const sendMessageToTelegram = async (message: string) => {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${BOT_API_TOKEN}/sendMessage`,
      {
        chat_id: "-1001814182076", // Replace 'CHAT_ID' with your actual chat ID
        text: message,
      }
    );
    // console.log("Message sent:", response.data);
  } catch (error) {
    // console.error("Error sending message:", error);
  }
};

const handleSend = () => {
  sendMessageToTelegram("Hi wanna change password");
};
