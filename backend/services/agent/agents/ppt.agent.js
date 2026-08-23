import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llm.model.js";
import { generatePPT } from "../utils/generatePPT.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadOnS3 } from "../utils/uploadOnS3.js";

export const pptAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "ppt");
    const llm = await getModel("ppt");
    const prompt = `You are a professional presentation designer.

        Return ONLY valid JSON.

Format:

{
  "title": "",
  "subtitle": "",
  "slides": [
    {
      "title": "",
      "points": [
        "",
        "",
        "",
        ""
      ]
    }
  ]
}

Rules:

- Generate exactly 6 content slides.
- Each slide should have 4-6 concise bullet points.
- No markdown.
- No explanation.
- No code block.
- Return ONLY JSON.

Topic:
${state.prompt}
        `;

    const res = await llm.invoke(prompt);
    const rawContent = res.content.trim();
    const jsonContent = rawContent.replace(/^```(?:json)?\s*|\s*```$/g, "");
    const data = JSON.parse(jsonContent);
    const ppt = await generatePPT(data);
    // sending to S3
    const buffer = await ppt.write({
      outputType: "nodebuffer",
    });
    const fileName = `ppt-${Date.now()}.pptx`;
    await uploadOnS3(
      fileName,
      buffer,
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    );
    // get from S3
    const downloadUrl = await getFromS3(fileName, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `# Presentation Generated 👍

**${data.title}**

❤️ [Download PPT](${downloadUrl})

Link expires in 24 hours.`,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate PPT 😓",
    };
  }
};
