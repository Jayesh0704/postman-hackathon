import { readFile } from '../utils/fileUtils.js';
import { generateAIContent } from '../services/aiService.js';
import { filterHospitalsBySpecialization } from '../services/hospitalService.js';

export const appendPromptAndProcess = async (req, res) => {
  const userInput = req.body.input;

  if (!userInput) {
    return res.status(400).json({ message: 'Input is required' });
  }

  try {
    const promptData = await readFile('./public/data/promptForAi.txt');
    const basePrompt = `${promptData.trim()} ${userInput}`;

    // Generate content using AI
    const aiResponse = await generateAIContent(basePrompt);

    // Filter hospitals by specializations
    const hospitals = await filterHospitalsBySpecialization(aiResponse);

    res.json({
      aiResponse,
      hospitals,
      total: hospitals.length,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error processing request',
      error: error.message,
    });
  }
};
