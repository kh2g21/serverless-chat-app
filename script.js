/* script.js */

document.addEventListener("DOMContentLoaded", function () {
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-icon");
  const chatMessages = document.getElementById("chat-messages");
  const maxMessages = 5; // Maximum number of messages to display
  const fileInput = document.getElementById("file-input");

  let messageCount = 0; // Counter for the number of messages

  // Function to send message
  function sendMessage() {
    const message = messageInput.value.trim();

    if (message !== "") {
      appendMessage("You", message);
      messageInput.value = "";
    }
  }

  fileInput.addEventListener("change", function (event) {
    const file = event.target.files[0]; // Get the selected file
    const fileUrl = URL.createObjectURL(file); // Generate a URL for the file
    appendMessage(
      "You",
      `Uploaded a file <a href="${fileUrl}" target="_blank">(${file.name})</a>`
    );
  });

  // Event listener for Send button click
  sendButton.addEventListener("click", sendMessage);

  // Event listener for Enter key press in input field
  messageInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent default form submission behavior
      sendMessage();
    }
  });

  // Function to append message to chat area
  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatMessages.appendChild(messageElement);

    // Increment message count
    messageCount++;

    // Remove oldest message if count exceeds maximum
    if (messageCount > maxMessages) {
      chatMessages.classList.add("scrollbar-visible");
    }

    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
  }
});

function showPopup() {
  const popup = document.createElement("div");
  popup.classList.add("popup-box");
  popup.textContent = "Welcome to our chat!";

  document.body.appendChild(popup);
}

// Wait for 2 seconds before showing the popup
setTimeout(showPopup, 500); // Adjust the delay as needed (in milliseconds)
