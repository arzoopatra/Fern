import { OpenAI } from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: ""
});

const getSystemMessage = (
  daysPerWeek: string,
  timePerDay: string,
  exersizeConstraints: string,
  height: string,
  weight: string,
  age: string,
  goal: string
): string => {
  return `You are a PCOS health assistant specializing in workout plans. Your task is to generate a detailed, personalized workout plan based on the user's body type and fitness goals. The user has PCOS, so the plan must use moderate intensity to avoid hormonal stress. The plan must be returned as a valid JSON object (and output only valid JSON with no extra text).

### USER PROFILE:
- Height: ${height} in
- Weight: ${weight} lb
- Age: ${age}
- Goal: ${goal} (Gain Weight / Lose Weight)
- Workout Frequency: ${daysPerWeek} days per week
- Workout Duration: ${timePerDay} minutes per session
- Available Equipment: ${exersizeConstraints}

### REQUIREMENTS:
1. The workout schedule MUST include exactly ${daysPerWeek} days.
2. For each day, provide:
   - "bodyParts": A string describing the primary muscle groups targeted.
   - "exercises": An array of exercises where each exercise is an object with:
      - "name": The exercise name.
      - "sets": The number of sets (as a number).
      - "reps": The recommended repetitions (as a string, e.g., "8-10").
      - "rest": Rest period (e.g., "60 sec").
      - "intensity": Recommended intensity (e.g., "moderate").
   - "notes": A short note explaining why this day’s workout is suited for someone managing hormonal balance.
3. Include a "workoutSplit" key that specifies the split type (for example, "Push/Pull/Legs" or "Upper/Lower").
4. Include a "recovery" key with a detailed recovery and stress management strategy including rest recommendations, mobility work, hydration, and other techniques.

### OUTPUT JSON FORMAT EXAMPLE:
{
  "workoutSplit": "Push/Pull/Legs",
  "schedule": {
    "Day 1": {
      "bodyParts": "Chest, Shoulders, Triceps",
      "exercises": [
        { "name": "Bench Press", "sets": 3, "reps": "8-10", "rest": "60 sec", "intensity": "moderate" },
        { "name": "Overhead Press", "sets": 3, "reps": "8-10", "rest": "60 sec", "intensity": "moderate" }
      ],
      "notes": "This session emphasizes compound movements with controlled intensity to support hormonal balance."
    },
    "Day 2": { ... },
    ...
  },
  "recovery": "Include at least one full rest day per week along with foam rolling, stretching, and proper hydration to ensure minimal hormonal stress."
}

Ensure that the workout details and recovery recommendations are tailored to someone with PCOS, emphasizing progressive overload for strength while avoiding excessive cardio.
`;
};

export async function POST(req: Request) {
  try {
    const { messages, daysPerWeek, timePerDay, exersizeConstraints, height, weight, age, goal } = await req.json();

    const systemMessage = {
      role: "system",
      content: getSystemMessage(daysPerWeek, timePerDay, exersizeConstraints, height, weight, age, goal),
    };

    const enhancedMessages = [systemMessage, ...messages];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: enhancedMessages,
    });

    // Parse and return the valid JSON output from the assistant.
    return NextResponse.json(JSON.parse(completion.choices[0].message.content));
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}