// messages.js
// Function to get the token from local storage or wherever it's stored
function getToken() {
  return localStorage.getItem('authToken');
}

// Populate recipient dropdown with users
function loadRecipients() {
  const token = getToken();
  fetch('http://localhost:3000/api/auth/all', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  })
    .then(response => response.json())
    .then(users => {
      const recipientSelect = document.getElementById('recipientId');
      users.forEach(user => {
        const option = document.createElement('option');
        option.value = user.userID;
        option.textContent = user.userID;  // Assuming users have a 'username' field
        recipientSelect.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching users:', error));
}

// Send a new message
// Assuming you're sending a message when the form is submitted
document.getElementById('messageForm').addEventListener('submit', function(event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Create a FormData object from the form
  const form = new FormData(event.target);

  // Fetch API to send the message to the backend
  fetch('/api/messages/send', {
    method: 'POST',  // Specifies the HTTP method (POST in this case)
    body: form,      // Sends the FormData as the request body
    headers: {
      // Attach the Authorization token (JWT) from localStorage
      'Authorization': 'Bearer ' + localStorage.getItem('token'),
    },
  })
    .then(function(response) {
      // Check if the response is successful (status code 200-299)
      if (!response.ok) {
        throw new Error('Message sending failed!');
      }
      // Parse the JSON response from the server
      return response.json();
    })
    .then(function(data) {
      // Show an alert when the message is sent successfully
      alert('Message sent successfully!');

      // Optionally, reset the form after sending the message
      event.target.reset();
    })
    .catch(function(error) {
      // Handle any errors during the fetch or response parsing
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    });
});

// Display received messages and allow downloading attachments
fetch('/messages/received', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${getToken()}`,
  },
})
  .then(response => response.json())
  .then(messages => {
    const messageList = document.getElementById('messageList');
    messages.forEach(message => {
      const listItem = document.createElement('li');
      listItem.innerHTML = `
        <strong>From:</strong> ${message.senderId.username}<br />
        <strong>Message:</strong> ${message.messageText}<br />
        ${message.attachment ? `
          <a href="/${message.attachment}" download>Download Attachment</a>
        ` : ''}
        <button class="reply-btn" onclick="replyToMessage('${message._id}', '${message.senderId._id}')">Reply</button>
      `;
      messageList.appendChild(listItem);
    });
  })
  .catch(error => console.error('Error fetching messages:', error));

// Function to handle replying to a message
function replyToMessage(messageId, senderId) {
  // You can pre-fill the form with the details of the original sender and message
  document.getElementById('recipientId').value = senderId;
  document.getElementById('messageText').value = `Replying to message ID: ${messageId}`;
}

// Call the function to load the recipient list when the page loads
window.onload = loadRecipients;
