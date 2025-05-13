import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize OpenAI client (you would use your preferred AI provider)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Clarity Coach Agent - Analyzes and improves the clarity of pitch deck content
 * @param {Object} slide - Slide object containing content to analyze
 * @returns {Object} Clarity feedback and recommendations
 */
export async function clarityCoachAgent(slide) {
  try {
    // Prepare the prompt for the AI
    const prompt = generateClarityPrompt(slide);
    
    // Call AI model to get analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are the Clarity Coach, an expert in clear, compelling startup communication. 
          Your job is to analyze pitch deck slides and provide feedback to improve clarity, 
          messaging, and story impact. Focus on making language simple, sharp, and persuasive.
          
          Provide specific, actionable recommendations for improvement. 
          Rate clarity on a scale of 1-10 where 10 is perfect clarity.
          Structure your response in JSON format.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the AI response
    const responseContent = completion.choices[0].message.content;
    const feedbackData = JSON.parse(responseContent);
    
    // Process and structure the feedback
    return {
      score: feedbackData.clarityScore,
      analysis: feedbackData.analysis,
      recommendations: feedbackData.recommendations,
      improvedContent: feedbackData.improvedContent
    };
  } catch (error) {
    console.error('Error in Clarity Coach agent:', error);
    // Return fallback response in case of error
    return {
      score: 5,
      analysis: "Unable to process slide for clarity analysis.",
      recommendations: ["Review slide content for clarity and conciseness."],
      improvedContent: null
    };
  }
}

/**
 * Generates a prompt for the Clarity Coach AI
 * @param {Object} slide - Slide object to generate prompt for
 * @returns {string} Prompt for the AI
 */
function generateClarityPrompt(slide) {
  return `
    Please analyze the following pitch deck slide and provide clarity feedback:
    
    SLIDE ID: ${slide.id}
    SLIDE TITLE: ${slide.title}
    SLIDE TYPE: ${slide.type}
    
    CONTENT:
    ${slide.content}
    
    Please provide:
    1. A clarity score (1-10)
    2. Analysis of current clarity issues
    3. Specific recommendations for improvement
    4. Improved, clearer version of the content
    
    Format your response as a JSON object with the following structure:
    {
      "clarityScore": number,
      "analysis": "string with analysis",
      "recommendations": ["array", "of", "recommendations"],
      "improvedContent": "string with improved content"
    }
  `;
}