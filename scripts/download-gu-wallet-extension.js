import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, mkdirSync, readFileSync, writeFileSync, createWriteStream } from "fs";
import axios from "axios";
import { createRequire } from "module";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Use require for CommonJS modules
const require = createRequire(import.meta.url);

// Try to use adm-zip if available
let AdmZip;
try {
  AdmZip = require("adm-zip");
} catch (e) {
  console.error("adm-zip is not installed. Please run: npm install adm-zip --save-dev");
  process.exit(1);
}

// Define the path to the extensions directory and the output file
const extensionsDir = join(__dirname, "../extensions");
const outputFilePath = join(extensionsDir, "gu-wallet.crx");
const outputDir = join(extensionsDir, "gu-wallet");

const GU_WALLET_EXTENSION_ID = "nfinomegcaccbhchhgflladpfbajihdf";

async function downloadExtension() {
  // Create the extensions directory if it does not exist
  if (!existsSync(extensionsDir)) {
    mkdirSync(extensionsDir, { recursive: true });
    console.log(`Created directory: ${extensionsDir}`);
  }

  if (existsSync(outputFilePath)) {
    console.log(
      `Extension already exists at ${outputFilePath}. Skipping download.`
    );
    return;
  }

  console.log(`Downloading extension ${GU_WALLET_EXTENSION_ID}...`);

  try {
    // Construct the URL for the Chrome extension
    const url = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=129.0&acceptformat=crx2,crx3&x=id%3D${GU_WALLET_EXTENSION_ID}%26uc`;

    console.log(`Attempting to download extension from URL: ${url}`);

    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });

    console.log(`Received response with status code: ${response.status}`);

    if (response.status === 200) {
      await new Promise((resolve, reject) => {
        const file = createWriteStream(outputFilePath);
        response.data.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log(`Extension downloaded successfully to ${outputFilePath}`);
          resolve();
        });
        file.on("error", (err) => {
          reject(new Error(`Error writing file: ${err.message}`));
        });
        response.data.on("error", (err) => {
          reject(new Error(`Error downloading: ${err.message}`));
        });
      });
    } else {
      throw new Error(`Failed to download extension. Status code: ${response.status}`);
    }
  } catch (error) {
    console.error(`Error downloading extension: ${error.message}`);
    throw error;
  }
}

function unpackCRX(crxPath, outputDir) {
  try {
    // Read the CRX file
    const crxBuffer = readFileSync(crxPath);

    console.log(`Reading CRX file: ${crxPath} (${crxBuffer.length} bytes)`);

    // Check the magic number
    const magic = crxBuffer.toString("ascii", 0, 4);
    if (magic !== "Cr24") {
      throw new Error(`Invalid CRX format. Expected magic number 'Cr24', got '${magic}'`);
    }

    // Parse CRX3 header
    const version = crxBuffer.readUInt32LE(4);
    if (version !== 3) {
      throw new Error(`Unsupported CRX version: ${version}. Only version 3 is supported.`);
    }

    // Find where the ZIP file starts by looking for "PK" signature
    let zipStartOffset = -1;
    for (let i = 16; i < Math.min(5000, crxBuffer.length - 1); i++) {
      if (crxBuffer[i] === 0x50 && crxBuffer[i + 1] === 0x4B) {
        zipStartOffset = i;
        break;
      }
    }

    if (zipStartOffset === -1) {
      throw new Error("Could not find ZIP file signature (PK) in CRX file");
    }

    console.log(`Found ZIP file at offset: ${zipStartOffset} (0x${zipStartOffset.toString(16)})`);

    // Extract the ZIP portion
    const zipBuffer = crxBuffer.slice(zipStartOffset);

    // Create output directory if it doesn't exist
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
      console.log(`Created output directory: ${outputDir}`);
    }

    // Extract all files from ZIP
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    console.log(`Extracting ${zipEntries.length} files...`);

    zipEntries.forEach((entry) => {
      if (!entry.isDirectory) {
        const entryPath = join(outputDir, entry.entryName);
        const entryDir = dirname(entryPath);

        // Create directory if it doesn't exist
        if (!existsSync(entryDir)) {
          mkdirSync(entryDir, { recursive: true });
        }

        // Extract file
        const content = entry.getData();
        writeFileSync(entryPath, content);
      }
    });

    console.log(`Successfully unpacked extension to ${outputDir}`);
    console.log(`Extracted ${zipEntries.filter(e => !e.isDirectory).length} files`);
  } catch (error) {
    console.error(`Error unpacking CRX: ${error.message}`);
    if (error.stack) {
      console.error(error.stack);
    }
    throw error;
  }
}

async function main() {
  try {
    // Step 1: Download extension if needed
    await downloadExtension();

    // Step 2: Unpack extension if needed
    if (!existsSync(outputFilePath)) {
      console.error(`CRX file not found: ${outputFilePath}`);
      process.exit(1);
    }

    // Check if already unpacked
    if (existsSync(outputDir) && existsSync(join(outputDir, "manifest.json"))) {
      console.log(`Extension already unpacked at ${outputDir}. Skipping unpack.`);
      return;
    }

    unpackCRX(outputFilePath, outputDir);
    console.log("\n✅ Extension setup complete!");
  } catch (error) {
    console.error(`\n❌ Error setting up extension: ${error.message}`);
    process.exit(1);
  }
}

main();
