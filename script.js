// User credentials for authentication
const validUser = {
    username: "admin",
    password: "1234"
  };
  
  function authenticateUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    if (username === validUser.username && password === validUser.password) {
      alert("Login successful!");
      document.getElementById('login-section').classList.add('hidden');
      document.getElementById('encryption-section').classList.remove('hidden');
      document.getElementById('decryption-section').classList.remove('hidden');
    } else {
      alert("Invalid username or password");
    }
  }
  
  function encryptImage() {
    const fileInput = document.getElementById('imageInput').files[0];
    const message = document.getElementById('message').value;
  
    if (!fileInput || !message) {
      alert("Please select an image and enter a message.");
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
  
      img.onload = function () {
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        let messageBinary = '';
        for (let i = 0; i < message.length; i++) {
          const charCode = message.charCodeAt(i).toString(2).padStart(8, '0');
          messageBinary += charCode;
        }
  
        messageBinary += '1111111111111110'; // Delimiter to mark end of message
  
        let dataIndex = 0;
        for (let i = 0; i < messageBinary.length; i++) {
          const bit = parseInt(messageBinary[i]);
          data[dataIndex] = (data[dataIndex] & ~1) | bit;
          dataIndex += 4; // Move to the next pixel's R channel
        }
  
        ctx.putImageData(imageData, 0, 0);
        const encryptedImage = canvas.toDataURL('image/png');
        document.getElementById('downloadLink').href = encryptedImage;
      };
    };
  
    reader.readAsDataURL(fileInput);
  }
  
  function decryptImage() {
    const fileInput = document.getElementById('decryptionInput').files[0];
  
    if (!fileInput) {
      alert("Please select an image to decrypt.");
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;
  
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        let binaryMessage = '';
        for (let i = 0; i < data.length; i += 4) {
          const bit = data[i] & 1;
          binaryMessage += bit;
  
          if (binaryMessage.endsWith('1111111111111110')) {
            break;
          }
        }
  
        binaryMessage = binaryMessage.slice(0, -16); // Remove the delimiter
  
        let message = '';
        for (let i = 0; i < binaryMessage.length; i += 8) {
          const byte = binaryMessage.slice(i, i + 8);
          message += String.fromCharCode(parseInt(byte, 2));
        }
  
        document.getElementById('extractedMessage').textContent = message;
      };
    };
  
    reader.readAsDataURL(fileInput);
  }