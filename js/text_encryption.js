// when report is submitted, we grab the text in the description
document.getElementById("report-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the input value
    var text = document.getElementById("Description").value;

    // Call the function from the linked JavaScript file
    printText(text);
  });

// --- Define the function to print text ---
function printText(dataToHash) {
    // console.log("Text submitted:", text);
    // You can perform any encryption or further processing here


    // Sample data to hash
    // const dataToHash = "Hello, World!";

    // Convert data to hash into a WordArray
    const dataWordArray = CryptoJS.enc.Utf8.parse(dataToHash);

    // Calculate SHA-256 hash
    const hash = CryptoJS.SHA256(dataWordArray);

    // Convert hash to a hexadecimal string
    const hashHex = hash.toString(CryptoJS.enc.Hex);

    console.log("SHA-256 Hash:", hashHex);
  }