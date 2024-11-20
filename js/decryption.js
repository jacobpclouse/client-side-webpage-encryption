document.getElementById("text-decryption-form").addEventListener("submit", async function (event) {
    // document.getElementById("decryption-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    // Read files
    const encryptedFile = document.getElementById("encryptedFile").files[0];
    const passwordFile = document.getElementById("passwordFile").files[0];
    const ivFile = document.getElementById("ivFile").files[0];

    if (!encryptedFile || !passwordFile || !ivFile) {
        alert("Please upload all required files.");
        return;
    }

    const encryptedData = await readFileAsText(encryptedFile);
    const password = await readFileAsText(passwordFile);
    const ivHash = await readFileAsText(ivFile);

    console.log(`Encrypted data: ${encryptedData}`);
    console.log(`Password data: ${password}`);
    console.log(`IvHash data: ${ivHash}`);

    // Execute Decryption
    let decryptedReturned = await decryptionFunc(encryptedData, password, ivHash);
    console.log(`Decrypted: ${decryptedReturned}`);
    document.getElementById("decryptedOutput").textContent = decryptedReturned;

    // try {
    //     // Decrypt the data
    //     const decryptedData = await decryptionFunc(
    //         JSON.parse(encryptedData), // parse back to array of blocks
    //         password,
    //         ivHash
    //     );

    //     // Check if it's text or an image
    //     if (isBase64(decryptedData)) {
    //         const imgHeader = "data:image/png;base64"; // Default to PNG
    //         createImageFromBase64(decryptedData, imgHeader);
    //     } else {
    //         // Display decrypted text
    //         document.getElementById("decryptedOutput").textContent = decryptedData;
    //     }
    // } catch (error) {
    //     console.error(error);
    //     alert("Decryption failed. Ensure the uploaded files are correct.");
    // }
});

function readFileAsText(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsText(file);
    });
}

function isBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (e) {
        return false;
    }
}

// Function to display decrypted image
function createImageFromBase64(base64String, header64) {
    const img = new Image();
    img.onload = function () {
        document.getElementById("decryptedOutput").appendChild(img);
    };
    img.src = `${header64},${base64String}`;
}
