<template>
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
              />
              <q-input
                filled
                label="Input Key to Use"
                v-model="inputKey"
                :rules="[val => val && val.length > 0 || 'Key is required']"
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
  
          <!-- Display encrypted value -->
          <div v-if="encryptedText">
            <div class="q-mt-md">
              <div class="text-h6">Encrypted Value:</div>
              <p>{{ encryptedText }}</p>
            </div>
  
            <!-- Display decrypted value -->
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
    max-width: 400px;
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
  </style>
  