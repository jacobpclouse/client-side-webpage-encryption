// when report is submitted, we grab the text in the description
document.getElementById("report-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // Get the input value
    var text = document.getElementById("Description").value;

    // Call the function from the linked JavaScript file
    printText(text);
  });

  // Define the function to print text
function printText(text) {
    console.log("Text submitted:", text);
    // You can perform any encryption or further processing here
  }