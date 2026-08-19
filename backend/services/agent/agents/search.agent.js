import { searchTool } from "../config/tavily.js";

export const searchAgent = async (state) => {
  try {
    const results = await searchTool.invoke({
      query: state.prompt,
      includeImages: true,
    });

    if (!results || results.error) {
      console.error(
        "searchAgent error: no results or error response",
        results?.error || results,
      );
      return {
        ...state,
        searchResults: [],
        searchAnswer: null,
        images: [],
      };
    }

    const normalizedResults = Array.isArray(results.results)
      ? results.results
      : [];

    const images = Array.isArray(results.images)
      ? results.images
      : normalizedResults.flatMap((r) =>
          Array.isArray(r.images) ? r.images : [],
        );

    const searchAnswer =
      typeof results.answer === "string" && results.answer.trim()
        ? results.answer.trim()
        : null;

    return {
      ...state,
      searchResults: normalizedResults,
      searchAnswer,
      images,
    };
  } catch (error) {
    console.error("searchAgent error:", error);
    return {
      ...state,
      searchResults: [],
      searchAnswer: null,
      images: [],
    };
  }
};
