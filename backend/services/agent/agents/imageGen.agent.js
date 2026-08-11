import { getModel } from "../config/llm.model.js";
import axios from "axios";
import { uploadOnS3 } from "../utils/uploadOnS3.js";
import { getFromS3 } from "../utils/getFromS3.js";

export const imageGenAgent = async (state) => {
  try {
    const llm = await getModel("image");
    const res = await llm.invoke(`
    You are an elite AI image prompt engineer.

Convert the user request into a highly detailed image generation prompt.

Requirements:

- Cinematic lighting
- Professional composition
- Ultra realistic
- High detail
- Beautiful color palette
- Sharp focus
- 8K quality
- Photorealistic
- Depth of field
- Professional photography
- Stunning visuals

Return only the image prompt.

User Request:
${state.prompt}

    `);

    const prompt = res.content.trim();

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      prompt,
    )}`;

    const imgRes = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const buffer = Buffer.from(imgRes.data);
    const fileName = `image-${Date.now()}.png`;

    await uploadOnS3(fileName, buffer, "image/png");
    const downloadUrl = await getFromS3(fileName, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `## 🖼️ Image Generated Successfully

![Generated Image](${downloadUrl})

📥 [Download Image](${downloadUrl})

⏳ Link expires in 10 minutes.`,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: "Failed to generate image 😓",
    };
  }
};
