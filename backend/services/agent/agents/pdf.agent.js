import { checkAgentLimit } from "../config/agentLimit.js";
import { getModel } from "../config/llm.model.js";
import { generatePDF } from "../utils/generatePDF.js";
import { getFromS3 } from "../utils/getFromS3.js";
import { uploadOnS3 } from "../utils/uploadOnS3.js";

export const pdfAgent = async (state) => {
  try {
    await checkAgentLimit(state.userId, "pdf");
    const llm = await getModel("pdf");
    const prompt = `You are an expert document writer.

Return ONLY valid JSON.

Do NOT return markdown.

Do NOT return explanations.

Structure:

{
"title":"",
"subtitle":"",
"sections":[
{
"heading":"",
"points":[]
}
]
}

Generate 4-8 sections.

Each section should have 3-6 concise bullet points.

Topic: 

${state.prompt}

`;

    const res = await llm.invoke(prompt);
    const data = JSON.parse(res.content);
    const pdfBuffer = await generatePDF(data);

    const fileName = `pdf-${Date.now()}.pdf`;

    await uploadOnS3(fileName, pdfBuffer, "application/pdf");

    const downloadUrl = await getFromS3(fileName, 24 * 60 * 60);

    return {
      ...state,
      aiResponse: `# PDF Generated

**${data.title}**

📥 [Download PDF](${downloadUrl})

_Link expires in 24 Hours._`,
    };
  } catch (error) {
    return {
      ...state,
      aiResponse: error?.data?.message || "Failed to generate PDF 😓",
    };
  }
};
