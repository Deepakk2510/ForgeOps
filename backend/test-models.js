import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`)
  .then(res => {
    const models = res.data.models;
    const generate = models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent'));
    console.log(generate.map(m => m.name).join('\n'));
  }).catch(console.error);
