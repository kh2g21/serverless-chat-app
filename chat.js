var ws;
var numofUsers = 0;
var members = [];
const fileInput = document.getElementById("file-input");

var userName;

function connect() {
  var url = "wss://w4skv8lg4d.execute-api.eu-west-2.amazonaws.com/production/";
  ws = new WebSocket(url);

  ws.onopen = function (event) {
    // Prompt for user name and send setName action only if user types something
    userName = prompt("What is your name?");

    if (userName !== null && userName.trim() !== "") {
      ws.send(
        JSON.stringify({
          action: "setName",
          name: userName,
        })
      );
    } else {
      // If user cancels or enters without typing anything, do not open the connection
      ws.close();
    }
  };

  let alertShown = false;
  let alertUsername = null;

  ws.onmessage = function (event) {
    console.log("Received data:", event.data);
    var message = JSON.parse(event.data);

    if (message.members) {
      // Update the members list

      members = message.members;

      // Update the user count and list
      numofUsers = members.length;
      document.getElementById(
        "user-count"
      ).innerHTML = `${numofUsers} users connected:<br><br>${members.join(
        "<br> "
      )}`;
    } else if (message.message) {
      // Display chat message
      appendChatMessage(message.message);
    } else if (message.systemMessage) {
      // Display system message
      appendSystemMessage(message.systemMessage);
    } else if (message.publicMessage) {
      // Display public message
      const messageText = message.publicMessage; // Get the text of the publicMessage
      const elements = messageText.split(":"); // Split the text by ':'
      const firstElement = elements[0].trim(); // Get the first element and remove leading/trailing whitespace

      console.log(firstElement); // Output: 'cc'

      console.log(firstElement == userName);

      // Extract the message content after the username
      const messageContent = message.publicMessage; // Join elements after the first one and trim whitespace

      console.log(messageContent); // Output: 'cccc'

      if (firstElement === userName) {
        // Append the message content to the chat box with default styling
        appendChatMessage(messageContent);
      } else {
        var chatMessages = document.getElementById("chat-messages");

        var dividerElement = document.createElement("div");
        dividerElement.classList.add("new-message-divider");

        var lineElement = document.createElement("div");
        lineElement.classList.add("new-message-divider-line");
        lineElement.innerHTML = "<span>NEW MESSAGE</span>";

        chatMessages.appendChild(dividerElement);
        chatMessages.appendChild(lineElement);
        // Append the message content to the chat box with a different class for styling
        appendChatMessageFromOtherUser(messageContent);
      }
    }
  };

  function appendChatMessageFromOtherUser(message) {
    var chatMessages = document.getElementById("chat-messages");
    var chatMessageElement = document.createElement("div");
    var timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    chatMessageElement.classList.add("chat-message-other-user");

    // Create the timestamp element

    var timestampElement = document.createElement("span");
    timestampElement.textContent = timestamp;
    timestampElement.classList.add("message-time-chat");

    var space = document.createTextNode("  ");

    // Create the message element
    var messageElement = document.createElement("span");
    messageElement.textContent = message;

    // Append the timestamp and message elements to the chat message element
    chatMessageElement.appendChild(timestampElement);
    chatMessageElement.appendChild(messageElement);

    // Append the chat message element to the chat messages container
    chatMessages.appendChild(chatMessageElement);
    var timeContainer = document.createElement("div");
    timeContainer.classList.add("message-time-chat");
    timeContainer.appendChild(timestampElement);
    chatMessages.appendChild(timeContainer);
  }

  ws.onerror = function (event) {
    console.log("WebSocket error: ", event);
  };

  ws.onclose = function () {
    document.getElementById("chat-messages").innerHTML = "Connection is closed";
    ws = null;
  };
}

function appendSystemMessage(message) {
  var chatMessages = document.getElementById("chat-messages");
  var systemMessageElement = document.createElement("div");
  systemMessageElement.classList.add("system-message");
  systemMessageElement.textContent = message;
  chatMessages.appendChild(systemMessageElement);
}

function appendChatMessage(message) {
  var chatMessages = document.getElementById("chat-messages");
  var chatMessageElement = document.createElement("div");
  chatMessageElement.classList.add("chat-message");

  // Create a timestamp element
  var timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  var timestampElement = document.createElement("span");
  timestampElement.classList.add("message-time");

  timestampElement.textContent = timestamp;

  // Create a message element
  var messageElement = document.createElement("span");
  messageElement.textContent = message;

  // Append message and space elements to the chat message element
  chatMessageElement.appendChild(messageElement);

  // Append the chat message element to the chat messages container
  chatMessages.appendChild(chatMessageElement);

  // Create a timestamp element outside the chat message element
  var timeContainer = document.createElement("div");
  timeContainer.classList.add("message-time-container");
  timeContainer.appendChild(timestampElement);

  // Append the timestamp element to the chat messages container
  chatMessages.appendChild(timeContainer);
}

fileInput.addEventListener("change", function (event) {
  const file = event.target.files[0]; // Get the selected file
  const fileUrl = URL.createObjectURL(file); // Generate a URL for the file

  // Construct the message with the file name and URL
  const message = `Uploaded a file: ${file.name} (${fileUrl})`;

  // Create a message element for the text
  const messageElement = document.createElement("div");
  messageElement.textContent = message; // Set the text content of the div

  // Append the message element to the chat messages container

  // Send the message using the sendPublic action
  if (ws != null) {
    // Send the message to the server
    ws.send(
      JSON.stringify({
        action: "sendPublic",
        message: message, // Send the message with the file name and URL
      })
    );

    // Scroll to the bottom of the chat messages container
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } else {
    chatMessages.innerHTML =
      "Connection is closed. Open the connection first to send a message";
  }
});

document
  .getElementById("open-connection")
  .addEventListener("click", function () {
    if (ws == null) {
      connect();
    } else {
      document.gefileInputtElementById("chat-messages").innerHTML =
        "Connection is already open";
    }
  });

const messageInput = document.getElementById("message-input");

messageInput.addEventListener("keypress", function (event) {
  message = messageInput.value;

  if (event.key === "Enter") {
    event.preventDefault(); // Prevent default form submission behavior
    ws.send(
      JSON.stringify({
        action: "sendPublic",
        message,
      })
    );
  }
});

document.getElementById("send-icon").addEventListener("click", function () {
  if (ws != null) {
    var messageInput = document.getElementById("message-input"),
      message = messageInput.value;
    ws.send(
      JSON.stringify({
        action: "sendPublic",
        message,
      })
    );
    messageInput.value = "";
  } else {
    document.getElementById("chat-messages").innerHTML =
      "Connection is closed. Open the connection first to send a message";
  }
});

document
  .getElementById("close-connection")
  .addEventListener("click", function () {
    if (ws != null) {
      ws.close();
      document.getElementById("chat-messages").innerHTML =
        "Connection closed by user";
    } else {
      document.getElementById("chat-messages").innerHTML =
        "Connection is already closed";
    }
  });

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  ws.on("message", function incoming(message) {
    console.log("Received:", message);

    // Broadcast message to all clients
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
