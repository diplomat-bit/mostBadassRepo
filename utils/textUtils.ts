// REPOSITORY SOURCE: diplomat-bit/tts-ai-book-reader-it-can-read-entire-books | PATH: diplomat-bit-tts-ai-book-reader-it-can-read-entire-books-128ebf1/utils/textUtils.ts
================================================================================


/**
 * Splits massive text into segments safe for Gemini TTS (8192 token limit).
 * Each segment is roughly 1200 characters to ensure we stay well under limits.
 */
export function splitTextIntoChunks(text: string, maxChars: number = 1200): string[] {
  if (!text || text.trim().length === 0) return [];

  const segments: string[] = [];
  // Clean text of extreme whitespace
  let remaining = text.replace(/\s+/g, ' ').trim();

  while (remaining.length > 0) {
    if (remaining.length <= maxChars) {
      segments.push(remaining);
      break;
    }

    let splitIndex = maxChars;
    const chunk = remaining.substring(0, maxChars + 100); // Look-ahead buffer

    // Strategy 1: Look for paragraph ends or sentence ends in the last 40% of the target size
    const lookbackLimit = Math.floor(maxChars * 0.6);
    const lastParagraph = chunk.lastIndexOf('\n', maxChars);
    const lastSentence = Math.max(
      chunk.lastIndexOf('. ', maxChars),
      chunk.lastIndexOf('! ', maxChars),
      chunk.lastIndexOf('? ', maxChars)
    );

    if (lastParagraph > lookbackLimit) {
      splitIndex = lastParagraph + 1;
    } else if (lastSentence > lookbackLimit) {
      splitIndex = lastSentence + 1;
    } else {
      // Strategy 2: Last space
      const lastSpace = chunk.lastIndexOf(' ', maxChars);
      if (lastSpace > 0) {
        splitIndex = lastSpace;
      }
    }

    segments.push(remaining.substring(0, splitIndex).trim());
    remaining = remaining.substring(splitIndex).trim();
    
    // Emergency break for infinite loops
    if (splitIndex === 0) {
      segments.push(remaining.substring(0, maxChars));
      remaining = remaining.substring(maxChars);
    }
  }

  return segments.filter(s => s.length > 3);
}
