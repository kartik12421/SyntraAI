async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "error in create conversation";
    throw new Error(message, { cause: error });
  }
}

export default copyToClipboard;
