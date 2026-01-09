export async function runWorkflow(base64Image: string, contextHint = "auto") {
  const workflowId = process.env.SNAPTRACK_WORKFLOW_ID;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!workflowId || !apiKey) {
    throw new Error("Missing SNAPTRACK_WORKFLOW_ID or OPENAI_API_KEY");
  }

  const response = await fetch(
    `https://api.openai.com/v1/workflows/${workflowId}/start`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        input: {
          contextHint,
          image: base64Image,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Workflow API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.output || data;
}
