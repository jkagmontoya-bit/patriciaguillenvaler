import { Jimp } from "jimp";

async function createFavicon() {
  console.log("Reading transparent logo...");
  try {
    const image = await Jimp.read("public/LOGO_transparent.png");
    
    // Resize to 64x64 for a high-quality favicon using object syntax for Jimp v1+
    image.resize({ w: 64, h: 64 });
    
    await image.write("public/favicon.png");
    console.log("Favicon created as public/favicon.png");
  } catch (err) {
    console.error("Error creating favicon:", err);
  }
}

createFavicon();
