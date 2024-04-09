// when report is submitted, we grab the text in the description
document.getElementById("report-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission

    // text to encrypt
    var inputText = document.getElementById("Description").value;
    console.log(inputText); 

    var inputKey = document.getElementById('inputKey').value;
    console.log(inputKey);

    // execute main body function
    mainBody(inputText,inputKey);


  });

async function mainBody(inputText,inputKey){

  //
}


// used to generate IV for initial randomness
function generateIV(){
  const array = new Uint8Array(256);
  window.crypto.getRandomValues(array);
  return array;
}

// hashing function
async function sha256HashFunc(message){
  const msgBuffer = new TextEncoder().encode(message);                  // encode as UTF 8 
  const hashBuffer = await crypto.subtle.digest('SHA-256',msgBuffer);   // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));             // convert ArrayBuffer to Array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  // console.log(`256 hash: ${hashHex}`);
  return hashHex;
}

// used to download a TEXT file *** 
function downloadFile(input,name,extension){
  var blob = new Blob([input], {type: "text/plain;charset=utf-8"});
  var url = URL.createObjectURL(blob);
  var link = document.createElement("a");
  link.href = url;
  // link.download = 'output.txt'
  link.download = `${name}.${extension}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// used to update the values in the file to display the new value
function updateHTML(value,idToUpdate){
  var displayElement = document.getElementById(idToUpdate); // select the element
  displayElement.innerHTML = value; // change its inner html
}