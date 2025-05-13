/**
 * Processes raw pitch deck content into structured slides
 * @param {string} rawContent - The raw text content of the pitch deck
 * @returns {Array} Array of structured slide objects
 */
export async function processInput(rawContent) {
    try {
      const slideDelimiters = [/---+/, /slide\s+\d+/i, /^\d+\.\s+/m];
      
      let slides = [rawContent];

      for (const delimiter of slideDelimiters) {
        if (delimiter.test(rawContent)) {
          slides = rawContent.split(delimiter).filter(content => content.trim().length > 0);
          break;
        }
      }
      
      const processedSlides = slides.map((content, index) => {
        const titleMatch = content.match(/^#+\s+(.+?)$/m) || content.match(/^(.+?)\n/);
        const title = titleMatch ? titleMatch[1].trim() : `Slide ${index + 1}`;

        const cleanContent = content.trim();
        
        let slideType = 'general';
        if (/problem|challenge|pain/i.test(cleanContent)) slideType = 'problem';
        else if (/solution|offer|provide/i.test(cleanContent)) slideType = 'solution';
        else if (/market|opportunity|tam|sam|som/i.test(cleanContent)) slideType = 'market';
        else if (/team|founders|experience/i.test(cleanContent)) slideType = 'team';
        else if (/traction|metrics|growth|progress/i.test(cleanContent)) slideType = 'traction';
        else if (/competition|competitors|landscape/i.test(cleanContent)) slideType = 'competition';
        else if (/business model|revenue|monetization/i.test(cleanContent)) slideType = 'business_model';
        else if (/ask|seeking|investment|funding/i.test(cleanContent)) slideType = 'ask';
        
        return {
          id: index + 1,
          title,
          type: slideType,
          content: cleanContent
        };
      });
      
      return processedSlides;
    } catch (error) {
      console.error('Error processing input:', error);
      throw new Error('Failed to process deck input');
    }
  }