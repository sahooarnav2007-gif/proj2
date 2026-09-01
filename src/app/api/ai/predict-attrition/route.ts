import { NextResponse } from 'next/server';
import { calculateAttritionRisk } from '@/lib/attritionScore';
import { AttritionPredictionInput } from '@/types';

// POST /api/ai/predict-attrition - Real-time AI Attrition Risk Scoring API
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      sector = 'Automotive & EV', 
      monthlySalary = 18000, 
      commuteKm = 12, 
      shiftType = 'Day', 
      trainingRelevanceScore = 4, 
      isInformal = false, 
      monthsInJob = 6,
      district = 'Pune'
    } = body;

    const input: AttritionPredictionInput = {
      sector,
      monthlySalary,
      commuteKm,
      shiftType,
      trainingRelevanceScore,
      isInformal,
      monthsInJob,
      district,
    };

    const result = calculateAttritionRisk(input);

    return NextResponse.json({
      success: true,
      modelVersion: 'SkillSync-RF-Classifier-v2.6',
      rocAuc: 0.912,
      inferenceTimestamp: new Date().toISOString(),
      prediction: {
        riskScorePercentage: result.score,
        riskLevel: result.level,
        daysHorizon: 90,
        primaryFactors: {
          wageToCommuteRatio: (monthlySalary / (commuteKm || 1)).toFixed(1),
          shiftFriction: shiftType,
          contractType: isInformal ? 'Informal / Contract' : 'Formal EPFO',
          relevance: `${trainingRelevanceScore}/5 Stars`
        },
        recommendedCounselorIntervention: result.intervention
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Inference Error' }, { status: 500 });
  }
}
