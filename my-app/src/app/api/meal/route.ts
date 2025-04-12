import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: ""
});

const getSystemMessage = (
  dietaryRestrictions: string, 
  calorieGoal: string, 
  cuisinePreferences: string[], 
  height: string, 
  weight: string, 
  age: string, 
  goal: string
): string => {
  return `You are a PCOS nutrition specialist. Create a detailed meal plan in JSON format (and output only valid JSON, without any additional text) following these EXACT requirements:

### USER PROFILE:
- Height: ${height} in
- Weight: ${weight} lb
- Age: ${age}
- Goal: ${goal} (Gain Weight / Lose Weight)
- Daily Caloric Intake: ${calorieGoal} kcal
- Dietary Restrictions: ${dietaryRestrictions}
- Preferred Cuisines: ${cuisinePreferences.join(", ")}

Instructions:
1. For each preferred cuisine (for example, ${cuisinePreferences.join(", ")}), output exactly 3 authentic meal recipes.
2. Each meal recipe must include:
   - "mealName": Name of the traditional dish.
   - "totalCalories": A number representing total calories.
   - "ingredients": A string listing ingredients with exact quantities (adapted to be PCOS-friendly while preserving authenticity).
   - "caloriesPerServing": Calories per serving as a number.
   - "macros": An object with keys "protein", "carbs", and "fats" (each a string indicating quantity, e.g., "20g").
   - "note": A small note explaining why this adapted recipe is beneficial for hormonal balance and anti-inflammatory benefits (do not use the term "PCOS" in the note).
3. The final JSON object must have keys corresponding to each cuisine with an array of 3 meal recipes.

Example JSON format:
{
  "Chinese": [
    {
      "mealName": "Example Dish",
      "totalCalories": 400,
      "ingredients": "ingredient1: quantity, ingredient2: quantity, ...",
      "caloriesPerServing": 200,
      "macros": { "protein": "20g", "carbs": "30g", "fats": "10g" },
      "note": "This dish has been adapted to support hormonal balance by..."
    },
    ...
  ],
  "Italian": [ ... ]
}

Remember: Output ONLY valid JSON with no extra text.`;
};

export async function POST(req: Request) {
  try {
    const { messages, dietaryRestrictions, calorieGoal, cuisinePreferences, height, weight, age, goal } = await req.json();
    
    const systemMessage = {
      role: "system",
      content: getSystemMessage(dietaryRestrictions, calorieGoal, cuisinePreferences, height, weight, age, goal)
    };

    const enhancedMessages = [systemMessage, ...messages];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: enhancedMessages,
    });

    // Return the JSON response directly.
    return NextResponse.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}