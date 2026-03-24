const fs = require('fs');
const path = require('path');
const { parseResume } = require('../src/services/resumeParser');

async function test() {
  try {
    const filePath = path.join(__dirname, 'dummy.pdf');
    if (!fs.existsSync(filePath)) {
      console.log('dummy.pdf not found');
      return;
    }
    const buffer = fs.readFileSync(filePath);
    const mimetype = 'application/pdf';
    console.log('Testing with dummy.pdf...');
    const text = await parseResume(buffer, mimetype);
    console.log('Extracted text length:', text.length);
    console.log('First 100 chars:', text.substring(0, 100));
  } catch (err) {
    console.error('Error parsing dummy.pdf:', err);
  }
}

test();
