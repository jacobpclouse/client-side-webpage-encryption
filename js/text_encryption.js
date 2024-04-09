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

  // Generate IV
  let iv_hash = await sha256HashFunc(generateIV());
  console.log(`IV Hash: ${iv_hash}`);

  // Execute Encryption
  let returned = await encryptionFunc(inputText,inputKey,iv_hash);
  console.log(`Final Blocks: ${returned}`);
  updateHTML(returned, "displayValueEncrypted");

  // Execute Decryption
  let decryptedReturned = await decryptionFunc(returned, inputKey, iv_hash);
  console.log(`Decrypted: ${decryptedReturned}`);
  updateHTML(decryptedReturned, "displayValueDecrypted");
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

// encryption function 
async function encryptionFunc(msn,enck,h0){

  // msn: message
  // n: number of blocks -- not used in this
  // enck: key
  // name_e_File_encrypted: name of file of store e value -- not used in this
  // h0: IV

  
  // STEP 1: e = HASH(MSN, H0);
  let msn_chunks = [];
  for (let i = 0; i < msn.length; i += enck.length){
    let chunk = msn.slice(i,i + enck.length);
    msn_chunks.push(chunk);
  }
  let e_val = await sha256HashFunc(msn + h0); // can also use msn.concat(h0) to concate, prob with images tho
  console.log(`e (plaintext) Hash: ${e_val}`);


  // STEP 2: H1 = HASH(ENCK, H0);
  let h1 = await sha256HashFunc(enck + h0);  // can also use msn.concat(h0) to concate, prob with images tho
  console.log(`h1 (key) Hash: ${h1}`);


  // STEP 3: BLK[0] = e XOR ENCK;
  let blocks = [];
  let xored = "";
  for(let i = 0; i < e_val.length; i++){
    let initialXor = e_val.charCodeAt(i) ^ h1.charCodeAt(i);
    xored += String.fromCharCode(initialXor);
  }
  blocks.push(xored);


  // STEP 4: H1 = HASH(e, H1);
  // let concat_e_h1 = e_val + h1;
  // h1 = await sha256HashFunc(concat_e_h1);
  h1 = await sha256HashFunc(e_val + h1);


  // STEP 5: ENCRYPT EACH BLOCK
  for(let msn_block_no = 0; msn_block_no < msn_chunks.length; msn_block_no++){
    // BLK[x] = blk[x] XOR H1;
    let current_block = msn_chunks[msn_block_no];
    let cipher_block = "";
    for (let i = 0; i < current_block.length; i++){
      cipher_block += String.fromCharCode(current_block.charCodeAt(i) ^ h1.charCodeAt(i));
    }
    blocks.push(cipher_block);

    // H1 = HASH(H1,H1);
    h1 = await sha256HashFunc(h1 + h1)
  }

  // console.log(blocks.length === msn.length);
  return blocks;
}


// decryption function
async function decryptionFunc(blk,enck,h0){

  // blk: encrypted blocks of size n
  // n: block size
  // enck: key
  // h0: IV

  // STEP 1: H1 = HASH(ENCK, H0);
  let h1 = await sha256HashFunc(enck + h0);


  // STEP 2: e = BLK[0] XOR ENCK;
  initial_block = blk[0];
  // console.log(`Block Length: ${blk[0].length}`)

  let e_val = "";
  for (let index = 0; index < blk[0].length; index++){
    let initial_xor = initial_block.charCodeAt(index) ^ h1.charCodeAt(index);
    e_val += String.fromCharCode(initial_xor);
  }


  // STEP 3: H1 = HASH(e, H1);
  h1 = await sha256HashFunc(e_val + h1);
  // console.log(`decrypt h1: ${h1}`);


  // STEP 4 - REST OF DECRYPT
  let blocks = [];
  for (let ciphertext_block = 1; ciphertext_block < blk.length; ciphertext_block++){
    let current_block = blk[ciphertext_block];
    let plaintext_block = "";

    // debugging statements:
    // console.log(`ciphertext_block: ${ciphertext_block}`);
    // console.log(`current_block: ${current_block}`);
    // console.log(`blk.length: ${blk.length}`);
    // console.log(`blk: ${blk}`);

    for (let i = 0; i < current_block.length; i++){
      plaintext_block += String.fromCharCode(current_block.charCodeAt(i) ^ h1.charCodeAt(i));
      // console.log(plaintext_block);
    }
    blocks.push(plaintext_block);

    
    // H1 = HASH(H1,H1);
    h1 = await sha256HashFunc(h1 + h1);
  }

  // console.log(blocks);
  return blocks.join('');
}