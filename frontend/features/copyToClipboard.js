async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error("copy to clipboard error:", error);
  }
}

export default copyToClipboard;
