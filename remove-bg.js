import { Jimp } from "jimp";

async function removeBackground() {
  console.log("Reading image...");
  try {
    const imagePath = "public/LOGO.png";
    const image = await Jimp.read(imagePath);

    console.log("Processing pixels...");
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
      const red = this.bitmap.data[idx + 0];
      const green = this.bitmap.data[idx + 1];
      const blue = this.bitmap.data[idx + 2];
      
      // If the pixel is very dark (close to black)
      if (red < 30 && green < 30 && blue < 30) {
        // Set alpha to 0 (transparent)
        this.bitmap.data[idx + 3] = 0;
      }
    });

    console.log("Saving image...");
    await image.write("public/LOGO_transparent.png");
    console.log("Done! Saved as public/LOGO_transparent.png");
  } catch (err) {
    console.error("Error processing image:", err);
  }
}

removeBackground();
