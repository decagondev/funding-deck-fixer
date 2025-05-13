// agents/investor.js - Investor AI Agent

import { OpenAI } from 'openai';

// Initialize OpenAI client (you would use your preferred AI provider)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Investor Agent - Evaluates pitch deck content from an investor perspective
 * @param {Object} slide - Slide object containing content to analyze
 * @returns {Object} Investor perspective feedback and recommendations
 */
export async function investorAgent(slide) {
  try {
    // Prepare the prompt for the AI
    const prompt = generateInvestorPrompt(slide);
    
    // Call AI model to get analysis
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are the Investor Agent, an experienced venture capitalist who has 
          evaluated thousands of startup pitch decks. Your job is to analyze pitch deck slides 
          from an investor's perspective and provide feedback focusing on traction metrics, 
          market size (TAM/SAM/SOM), go-to-market strategy, and potential red flags.
          
          Be critical but constructive. Rate investor appeal on a scale of 1-10 where 10 
          would immediately attract investment. Structure your response in JSON format.`
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
      score: feedbackData.investorScore,
      analysis: feedbackData.analysis,
      redFlags: feedbackData.redFlags || [],
      recommendations: feedbackData.recommendations,
      missingElements: feedbackData.missingElements || []
    };
  } catch (error) {
    console.error('Error in Investor agent:', error);
    // Return fallback response in case of error
    return {
      score: 5,
      analysis: "Unable to process slide for investor analysis.",
      redFlags: [],
      recommendations: ["Ensure slide contains specific metrics and data points."],
      missingElements: []
    };
  }
}

/**
 * Generates a prompt for the Investor AI
 * @param {Object} slide - Slide object to generate prompt for
 * @returns {string} Prompt for the AI
 */
function generateInvestorPrompt(slide) {
  // Customize the prompt based on slide type
  let specificGuidance = "";
  
  switch (slide.type) {
    case 'problem':
      specificGuidance = "Focus on problem validity, market size, and pain point intensity.";
      break;
    case 'solution':
      specificGuidance = "Evaluate solution differentiation, scalability, and unique value.";
      break;
    case 'market':
      specificGuidance = "Analyze TAM/SAM/SOM credibility, growth potential, and market dynamics.";
      break;
    case 'traction':
      specificGuidance = "Assess metrics validity, growth curves, user engagement, and revenue trends.";
      break;
    case 'team':
      specificGuidance = "Evaluate team credentials, domain expertise, and track record.";
      break;
    case 'competition':
      specificGuidance = "Analyze competitive landscape awareness, differentiation strategy, and barriers to entry.";
      break;
    case 'business_model':
      specificGuidance = "Evaluate revenue model viability, scaling potential, and unit economics.";
      break;
    case 'ask':
      specificGuidance = "Assess funding request reasonability, use of funds clarity, and valuation justification.";
      break;
    default:
      specificGuidance = "Evaluate this slide for key investor-relevant information and metrics.";
  }
  
  return `
    Please analyze the following pitch deck slide from an investor's perspective:
    
    SLIDE ID: ${slide.id}
    SLIDE TITLE: ${slide.title}
    SLIDE TYPE: ${slide.type}
    
    CONTENT:
    ${slide.content}
    
    ${specificGuidance}
    
    Please provide:
    1. An investor appeal score (1-10)
    2. Analysis from an investor's perspective
    3. Any red flags for investors
    4. Specific recommendations for improvement
    5. Important elements missing from this slide
    
    Format your response as a JSON object with the following structure:
    {
      "investorScore": number,
      "analysis": "string with analysis",
      "redFlags": ["array", "of", "red flags"],
      "recommendations": ["array", "of", "recommendations"],
      "missingElements": ["array", "of", "missing elements"]
    }
  `;
}