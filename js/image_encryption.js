// js for image encryption
function executeImageMain(){
    handleImage("inputImage",inputKeyImage.value);  // main function houses subfuctions
}

// function that does the heavy lifting with encryption and decryption
function handleImage(imageID,imageKey){
    var inputElementImage = document.getElementById(imageID);   // get image value
    // var inputElementKey = document.getElementById(imageKey);   // get key value
    var inputElementKey = imageKey;
    // console.log(`imageKey: ${imageKey}`);


    var file = inputElementImage.files[0];
    var reader = new FileReader();

    // read data for the image into base64 and then encrypt
    reader.onload = async function(){
        let base64data = reader.result;
        // console.log(base64data); // this is your image in base 64 format (bytes)
        let base64header = base64data.split(",")[0]; // get the header "data:image/png;base64" no comma
        let base64image = base64data.split(",")[1];// get values after header, no comma

        // IV
        let iv_hash = await sha256HashFunc(generateIV());
        console.log(`IV Hash: ${iv_hash}`);

        // Encrypt
        // let returnedEncrypted = await encryptionFunc(base64data,inputElementKey, iv_hash);
        let returnedEncrypted = await encryptionFunc(base64image,inputElementKey, iv_hash);
        console.log(`Final Image Blocks: ${returnedEncrypted}`);
        // updateHTML(returnedEncrypted,"displayValueEncrypted")

        // downloadFile(returnedEncrypted,"encrypted_image","txt"); // download encrypted

        // Decrypt
        let decryptedReturned = await decryptionFunc(returnedEncrypted, inputElementKey, iv_hash);
        console.log(`Decrypted Image: ${decryptedReturned}`);
        // updateHTML(decryptedReturned,"displayValueDecrypted");

        // create image from Base64 decrypted string
        createImageFromBase64(decryptedReturned,base64header)
        
    }
    reader.readAsDataURL(file);
}

// create image from base 64 string function -- jpeg
function createImageFromBase64(base64String,header64){
    let img = new Image();
    img.onload = function(){
        document.body.appendChild(img);
    }
    // img.src = 'data:image/jpeg;base64,' + base64String;
    img.src = header64+','+base64String;
}

