import { clarityCoachAgent } from '../agents/clarityCoach.js';
import { investorAgent } from '../agents/investor.js';

/**
 * Generates comprehensive feedback for the pitch deck using both AI agents
 * @param {Array} slides - Array of processed slide objects
 * @returns {Object} Structured feedback from both agents
 */
export async function generateFeedback(slides) {
  try {
    // Process each slide with both agents in parallel
    const feedbackPromises = slides.map(async (slide) => {
      // Run both agents in parallel for efficiency
      const [clarityFeedback, investorFeedback] = await Promise.all([
        clarityCoachAgent(slide),
        investorAgent(slide)
      ]);
      
      // Compile the feedback for this slide
      return {
        slideId: slide.id,
        slideTitle: slide.title,
        slideType: slide.type,
        feedback: {
          clarity: clarityFeedback,
          investor: investorFeedback,
          // Generate combined recommendations
          combinedRecommendations: combineRecommendations(clarityFeedback, investorFeedback)
        }
      };
    });
    
    // Wait for all feedback to be generated
    const slideFeedback = await Promise.all(feedbackPromises);
    
    // Generate overall deck feedback
    const overallFeedback = generateOverallFeedback(slides, slideFeedback);
    
    return {
      slideFeedback,
      overallFeedback
    };
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw new Error('Failed to generate deck feedback');
  }
}

/**
 * Combines recommendations from both agents into a unified set
 * @param {Object} clarityFeedback - Feedback from clarity coach agent
 * @param {Object} investorFeedback - Feedback from investor agent
 * @returns {Array} Combined recommendations
 */
function combineRecommendations(clarityFeedback, investorFeedback) {
  const recommendations = [];
  
  // Add clarity recommendations
  if (clarityFeedback.recommendations && clarityFeedback.recommendations.length) {
    recommendations.push(...clarityFeedback.recommendations);
  }
  
  // Add investor recommendations (avoiding duplicates)
  if (investorFeedback.recommendations && investorFeedback.recommendations.length) {
    investorFeedback.recommendations.forEach(rec => {
      // Simple duplicate check - can be enhanced for production
      const isDuplicate = recommendations.some(
        existing => existing.toLowerCase().includes(rec.toLowerCase().substring(0, 20))
      );
      
      if (!isDuplicate) {
        recommendations.push(rec);
      }
    });
  }
  
  return recommendations;
}

/**
 * Generates overall feedback for the entire deck
 * @param {Array} slides - Original processed slides
 * @param {Array} slideFeedback - Feedback for individual slides
 * @returns {Object} Overall deck feedback
 */
function generateOverallFeedback(slides, slideFeedback) {
  // Check for missing critical slides
  const slideTypes = slides.map(slide => slide.type);
  const missingSlideTypes = checkMissingSlideTypes(slideTypes);
  
  // Calculate overall clarity score (simple average for demo)
  const clarityScores = slideFeedback.map(sf => sf.feedback.clarity.score || 0);
  const averageClarity = clarityScores.reduce((a, b) => a + b, 0) / clarityScores.length;
  
  // Calculate overall investor appeal score
  const investorScores = slideFeedback.map(sf => sf.feedback.investor.score || 0);
  const averageInvestorAppeal = investorScores.reduce((a, b) => a + b, 0) / investorScores.length;
  
  // Generate top overall recommendations
  const allRecommendations = slideFeedback.flatMap(sf => sf.feedback.combinedRecommendations);
  const topRecommendations = getTopRecommendations(allRecommendations, 5);
  
  return {
    overallClarity: Math.round(averageClarity * 10) / 10,
    overallInvestorAppeal: Math.round(averageInvestorAppeal * 10) / 10,
    overallScore: Math.round(((averageClarity + averageInvestorAppeal) / 2) * 10) / 10,
    missingSlideTypes,
    topRecommendations
  };
}

/**
 * Checks for missing critical slide types in the deck
 * @param {Array} slideTypes - Types of slides present in the deck
 * @returns {Array} Missing critical slide types
 */
function checkMissingSlideTypes(slideTypes) {
  const criticalSlideTypes = [
    'problem',
    'solution',
    'market',
    'traction',
    'team',
    'business_model',
    'ask'
  ];
  
  return criticalSlideTypes.filter(type => !slideTypes.includes(type));
}

/**
 * Gets top recommendations based on importance
 * @param {Array} recommendations - All recommendations
 * @param {number} count - Number of top recommendations to return
 * @returns {Array} Top recommendations
 */
function getTopRecommendations(recommendations, count) {
  // For demo purposes, we're just selecting unique recommendations
  // In production, this would use more sophisticated prioritization
  const uniqueRecommendations = [...new Set(recommendations)];
  return uniqueRecommendations.slice(0, count);
}