import axios from "axios";
import fs from "fs";

export const downloadExtension = async (args) => {
  const {
    extensionId,
    destinationPath = "extension.crx",
    prodversion = "129.0",
    acceptformat = "crx2,crx3",
  } = args;
  // Construct the URL for the Chrome extension
  const url = `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${prodversion}&acceptformat=${acceptformat}&x=id%3D${extensionId}%26uc`;

  console.log(`Attempting to download extension from URL: ${url}`);

  try {
    const response = await axios({
      method: "get",
      url: url,
      responseType: "stream",
    });

    console.log(`Received response with status code: ${response.status}`);

    if (response.status === 200) {
      const file = fs.createWriteStream(destinationPath);
      response.data.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Extension downloaded successfully to ${destinationPath}`);
      });
    } else {
      console.log(
        `Failed to download extension. Status code: ${response.status}`
      );
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};
