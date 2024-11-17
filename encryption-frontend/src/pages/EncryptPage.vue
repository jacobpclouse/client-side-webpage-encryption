<template>
    <div class="encrypt-container">
      <q-card bordered class="q-mb-md">
        <q-card-section>
          <h2 class="text-center">Encrypt/Decrypt Text</h2>
  
          <q-form id="report-form" @submit="handleSubmit">
            <!-- Description Text Input -->
            <q-input
              filled
              v-model="description"
              label="Enter Text"
              type="textarea"
              autofocus
              class="q-mb-md"
              :rows="5"
              debounce="300"
            />
  
            <!-- Key Input -->
            <q-input
              filled
              v-model="inputKey"
              label="Enter Encryption Key"
              class="q-mb-md"
              debounce="300"
            />
  
            <!-- Buttons -->
            <div class="button-container q-mt-md">
              <q-btn label="Encrypt & Decrypt" type="submit" color="primary" class="full-width" />
            </div>
          </q-form>
  
          <!-- Encrypted Output -->
          <div v-if="encryptedValue" class="q-mt-md">
            <q-card class="q-mb-md">
              <q-card-section>
                <h6>Encrypted Text</h6>
                <div>{{ encryptedValue }}</div>
              </q-card-section>
            </q-card>
          </div>
  
          <!-- Decrypted Output -->
          <div v-if="decryptedValue" class="q-mt-md">
            <q-card>
              <q-card-section>
                <h6>Decrypted Text</h6>
                <div>{{ decryptedValue }}</div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        description: '',
        inputKey: '',
        encryptedValue: '',
        decryptedValue: ''
      };
    },
    methods: {
      handleSubmit(event) {
        event.preventDefault();
        this.mainBody(this.description, this.inputKey);
      },
  
      async mainBody(inputText, inputKey) {
        // Generate IV
        let iv_hash = await this.sha256HashFunc(this.generateIV());
        console.log(`IV Hash: ${iv_hash}`);
  
        // Execute Encryption
        let returned = await this.encryptionFunc(inputText, inputKey, iv_hash);
        console.log(`Final Blocks: ${returned}`);
        this.encryptedValue = returned;
  
        // Execute Decryption
        let decryptedReturned = await this.decryptionFunc(returned, inputKey, iv_hash);
        console.log(`Decrypted: ${decryptedReturned}`);
        this.decryptedValue = decryptedReturned;
      },
  
      generateIV() {
        const array = new Uint8Array(256);
        window.crypto.getRandomValues(array);
        return array;
      },
  
      async sha256HashFunc(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
      },
  
      async encryptionFunc(msn, enck, h0) {
        let msn_chunks = [];
        for (let i = 0; i < msn.length; i += enck.length) {
          let chunk = msn.slice(i, i + enck.length);
          msn_chunks.push(chunk);
        }
  
        let e_val = await this.sha256HashFunc(msn + h0);
        let h1 = await this.sha256HashFunc(enck + h0);
  
        let blocks = [];
        let xored = "";
        for (let i = 0; i < e_val.length; i++) {
          let initialXor = e_val.charCodeAt(i) ^ h1.charCodeAt(i);
          xored += String.fromCharCode(initialXor);
        }
        blocks.push(xored);
  
        h1 = await this.sha256HashFunc(e_val + h1);
  
        for (let msn_block_no = 0; msn_block_no < msn_chunks.length; msn_block_no++) {
          let current_block = msn_chunks[msn_block_no];
          let cipher_block = "";
          for (let i = 0; i < current_block.length; i++) {
            cipher_block += String.fromCharCode(current_block.charCodeAt(i) ^ h1.charCodeAt(i));
          }
          blocks.push(cipher_block);
  
          h1 = await this.sha256HashFunc(h1 + h1);
        }
  
        return blocks;
      },
  
      async decryptionFunc(blk, enck, h0) {
        let h1 = await this.sha256HashFunc(enck + h0);
        let initial_block = blk[0];
        let e_val = "";
        for (let index = 0; index < blk[0].length; index++) {
          let initial_xor = initial_block.charCodeAt(index) ^ h1.charCodeAt(index);
          e_val += String.fromCharCode(initial_xor);
        }
  
        h1 = await this.sha256HashFunc(e_val + h1);
  
        let blocks = [];
        for (let ciphertext_block = 1; ciphertext_block < blk.length; ciphertext_block++) {
          let current_block = blk[ciphertext_block];
          let plaintext_block = "";
          for (let i = 0; i < current_block.length; i++) {
            plaintext_block += String.fromCharCode(current_block.charCodeAt(i) ^ h1.charCodeAt(i));
          }
          blocks.push(plaintext_block);
  
          h1 = await this.sha256HashFunc(h1 + h1);
        }
  
        return blocks.join('');
      }
    }
  };
  </script>
  
  <style scoped>
  .encrypt-container {
    padding: 20px;
  }
  
  .q-card {
    padding: 15px;
  }
  
  .button-container {
    display: flex;
    justify-content: center;
  }
  
  .q-input {
    width: 100%;
  }
  
  .q-card-section {
    margin-bottom: 15px;
  }
  
  h2 {
    margin-bottom: 15px;
  }
  
  h6 {
    margin-top: 10px;
    font-size: 1rem;
  }
  
  .q-mt-md {
    margin-top: 20px;
  }
  
  .q-mb-md {
    margin-bottom: 20px;
  }
  </style>
  



<!-- WORKING ALT N BIT BELOW -->
<!-- <template>
    <q-page>
      <q-form @submit.prevent="onSubmit">
        <q-input
          v-model="inputText"
          label="Enter text to encrypt"
          outlined
          type="textarea"
          id="Description"
          autofocus
        />
        <q-input
          v-model="inputKey"
          label="Enter encryption key"
          outlined
          id="inputKey"
          type="text"
        />
        <q-btn label="Encrypt & Decrypt" type="submit" color="primary" />
      </q-form>
  
      <div>
        <h6>Encrypted Value:</h6>
        <pre id="displayValueEncrypted">{{ encryptedValue }}</pre>
  
        <h6>Decrypted Value:</h6>
        <pre id="displayValueDecrypted">{{ decryptedValue }}</pre>
      </div>
    </q-page>
  </template>
  
  <script>
  export default {
    data() {
      return {
        inputText: '', // The text to encrypt
        inputKey: '',  // The encryption key
        encryptedValue: '', // Store encrypted value
        decryptedValue: '', // Store decrypted value
      };
    },
    methods: {
      async onSubmit() {
        // Get input values
        const inputText = this.inputText;
        const inputKey = this.inputKey;
        console.log(inputText, inputKey);
  
        // Execute the main encryption/decryption logic
        await this.mainBody(inputText, inputKey);
      },
  
      async mainBody(inputText, inputKey) {
        // Generate IV
        let iv_hash = await this.sha256HashFunc(this.generateIV());
        console.log(`IV Hash: ${iv_hash}`);
  
        // Execute Encryption
        let returned = await this.encryptionFunc(inputText, inputKey, iv_hash);
        console.log(`Final Blocks: ${returned}`);
        this.encryptedValue = returned.join(''); // Display encrypted value
  
        // Execute Decryption
        let decryptedReturned = await this.decryptionFunc(returned, inputKey, iv_hash);
        console.log(`Decrypted: ${decryptedReturned}`);
        this.decryptedValue = decryptedReturned; // Display decrypted value
      },
  
      generateIV() {
        const array = new Uint8Array(256);
        window.crypto.getRandomValues(array);
        return array;
      },
  
      async sha256HashFunc(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
      },
  
      async encryptionFunc(msn, enck, h0) {
        let msn_chunks = [];
        for (let i = 0; i < msn.length; i += enck.length) {
          let chunk = msn.slice(i, i + enck.length);
          msn_chunks.push(chunk);
        }
        let e_val = await this.sha256HashFunc(msn + h0);
        console.log(`e (plaintext) Hash: ${e_val}`);
  
        let h1 = await this.sha256HashFunc(enck + h0);
        console.log(`h1 (key) Hash: ${h1}`);
  
        let blocks = [];
        let xored = "";
        for (let i = 0; i < e_val.length; i++) {
          let initialXor = e_val.charCodeAt(i) ^ h1.charCodeAt(i);
          xored += String.fromCharCode(initialXor);
        }
        blocks.push(xored);
  
        h1 = await this.sha256HashFunc(e_val + h1);
  
        for (let msn_block_no = 0; msn_block_no < msn_chunks.length; msn_block_no++) {
          let current_block = msn_chunks[msn_block_no];
          let cipher_block = "";
          for (let i = 0; i < current_block.length; i++) {
            cipher_block += String.fromCharCode(current_block.charCodeAt(i) ^ h1.charCodeAt(i));
          }
          blocks.push(cipher_block);
  
          h1 = await this.sha256HashFunc(h1 + h1);
        }
  
        return blocks;
      },
  
      async decryptionFunc(blk, enck, h0) {
        let h1 = await this.sha256HashFunc(enck + h0);
        let initial_block = blk[0];
        let e_val = "";
        for (let index = 0; index < blk[0].length; index++) {
          let initial_xor = initial_block.charCodeAt(index) ^ h1.charCodeAt(index);
          e_val += String.fromCharCode(initial_xor);
        }
  
        h1 = await this.sha256HashFunc(e_val + h1);
  
        let blocks = [];
        for (let ciphertext_block = 1; ciphertext_block < blk.length; ciphertext_block++) {
          let current_block = blk[ciphertext_block];
          let plaintext_block = "";
  
          for (let i = 0; i < current_block.length; i++) {
            plaintext_block += String.fromCharCode(current_block.charCodeAt(i) ^ h1.charCodeAt(i));
          }
          blocks.push(plaintext_block);
  
          h1 = await this.sha256HashFunc(h1 + h1);
        }
  
        return blocks.join('');
      },
    },
  };
  </script>
  
  <style scoped>
  #displayValueEncrypted, #displayValueDecrypted {
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 100%;
  }
  </style> -->
  
<!--  ceaser cipher below: -->

<!-- <template>
    <q-page>
      <q-card class="q-pa-md" bordered>
        <q-card-section>
          <div class="text-h5">Encrypting Text</div>
  
          <q-form @submit.prevent="encryptText">
            <div class="q-pa-md">
              <q-input
                filled
                label="Input Text To Encrypt"
                v-model="inputText"
                :rules="[val => val && val.length > 0 || 'Text is required']"
                class="full-width"
              />
              <q-input
                filled
                label="Input Key to Use"
                v-model="inputKey"
                :rules="[val => val && val.length > 0 || 'Key is required']"
                class="full-width"
              />
            </div>
  
            <q-btn
              type="submit"
              label="Encrypt Text!"
              color="primary"
              class="full-width"
              :disable="!inputText || !inputKey"
              style="background-color: #007BFF; border-color: #007BFF;"
              @mouseover="this.$refs.button.style.backgroundColor = '#0056b3'"
              @mouseleave="this.$refs.button.style.backgroundColor = '#007BFF'"
            />
          </q-form>
  
          <div v-if="encryptedText">
            <div class="q-mt-md">
              <div class="text-h6">Encrypted Value:</div>
              <p>{{ encryptedText }}</p>
            </div>
  
            <div v-if="decryptedText" class="q-mt-md">
              <div class="text-h6">Decrypted Value:</div>
              <p>{{ decryptedText }}</p>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script>
  export default {
    data() {
      return {
        inputText: '',
        inputKey: '',
        encryptedText: '',
        decryptedText: ''
      };
    },
    methods: {
      encryptText() {
        // Simple example of encryption and decryption (Caesar cipher for demonstration)
        this.encryptedText = this.caesarCipher(this.inputText, this.inputKey.length);
        this.decryptedText = this.caesarCipher(this.encryptedText, -this.inputKey.length);
      },
      caesarCipher(text, shift) {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';
        
        for (let i = 0; i < text.length; i++) {
          let char = text[i];
          let index = alphabet.indexOf(char);
  
          if (index === -1) {
            result += char;
          } else {
            let newIndex = (index + shift + alphabet.length) % alphabet.length;
            result += alphabet[newIndex];
          }
        }
  
        return result;
      }
    }
  };
  </script>
  
  <style scoped>
  .q-card {
    max-width: 600px;
    margin: 0 auto;
    background-color: #F8F9FA; /* light grayish background */
    color: #495057; /* dark grayish text */
  }
  
  .q-btn {
    background-color: #007BFF !important; /* blue button background */
    border-color: #007BFF !important;
  }
  
  .q-btn:hover {
    background-color: #0056b3 !important; /* darker blue hover */
  }
  
  .q-card-section {
    color: #495057;
  }
  
  .full-width {
    width: 100%;
  }
  </style>
   -->