import { getModel } from "../config/llm.model.js";

export const codingAgent = async (state) => {
  try {
    const intentLlm = await getModel("intent");
    const llm = await getModel("code");
    const intentRes = await intentLlm.invoke(`
You are an intent classifier.

Return ONLY one of these values.

CODE_GENERATION
CODE_REVIEW
CODE_EXPLANATION
DEBUGGING
OPTIMIZATION
CONVERSION
DOCUMENTATION

User Request:
${state.prompt}
        `);

    const intent = intentRes.content.trim();
    let prompt;

    // for code generation
    if (intent == "CODE_GENERATION") {
      prompt = `

        You are CortexAI Coding Agent.

Generate the requested project.

Default stack:
- HTML
- CSS
- JavaScript

Use React / Next.js / Vue ONLY if explicitly requested.

Rules:

- Responsive
- Modern UI
- CSS Variables
- Flexbox/Grid
- Smooth Scroll
- Hover Effects
- Beautiful spacing
- Single page unless user asks otherwise.

Return ONLY valid JSON.

Schema:

{
  "files": [
    {
      "name": "index.html",
      "content": "..."
    },
    {
      "name": "style.css",
      "content": "..."
    },
    {
      "name": "script.js",
      "content": "..."
    }
  ]
}

Rules:

- Output must start with {
- Output must end with }
- No markdown
- No explanation
- No extra text
- No \`\`\`
- Never mention intent

User Request:
${state.prompt}
        `;

      const response = await llm.invoke(prompt);

      const data = JSON.parse(response.content);

      return {
        ...state,
        aiResponse: "code generated successfully",
        artifacts: [
          {
            id: Date.now(),
            type: "project_code",
            files: data.files || [],
            title: state.prompt,
          },
        ],
      };
    } else {
      prompt = `You are CortexAI Coding Agent.

The user's coding intent is ${intent}. Provide a clear, practical answer with
valid code where useful. Use Markdown and explain any important assumptions.

User Request:
${state.prompt}`;

      const response = await llm.invoke(prompt);
      return {
        ...state,
        aiResponse: response.content,
        artifacts: [],
      };
    }
  } catch (error) {
    throw new Error(`coding agent failed: ${error.message}`);
  }
};
