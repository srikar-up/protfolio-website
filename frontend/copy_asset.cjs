const fs = require('fs');
const src = "C:\\Users\\LENOVO\\.gemini\\antigravity-ide\\brain\\35e43923-04b6-4425-9052-d221e91812f3\\quote_bg_1789152041402.jpg";
const dest = "d:\\protfolio website\\frontend\\src\\assets\\quote_bg.jpg";
fs.copyFileSync(src, dest);
console.log('Successfully copied quote_bg.jpg');
