import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { processInput } from './services/inputProcessor.js';
import { generateFeedback } from './services/feedbackGenerator.js';

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.static('public'));

// Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const { deckContent } = req.body;
    
    if (!deckContent || typeof deckContent !== 'string') {
      return res.status(400).json({ error: 'Valid deck content is required' });
    }
    
    // Process the input content
    const processedSlides = await processInput(deckContent);
    
    // Generate feedback using the AI crew
    const feedback = await generateFeedback(processedSlides);
    
    return res.json({ success: true, feedback });
  } catch (error) {
    console.error('Error processing deck:', error);
    return res.status(500).json({ error: 'Failed to process deck content' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});