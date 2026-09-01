import { AttritionPredictionInput } from "@/types";

export interface AttritionPrediction {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Critical';
  intervention: string;
}

export function calculateAttritionRisk(input: AttritionPredictionInput): AttritionPrediction {
  let baseScore = 20;

  if (input.sector === 'Retail & Logistics') baseScore += 8;

  if (input.monthlySalary < 15000 && input.commuteKm > 20) baseScore += 35;
  else if (input.monthlySalary < 18000 && input.commuteKm > 25) baseScore += 25;
  else if (input.commuteKm > 30) baseScore += 18;

  if (input.trainingRelevanceScore <= 2) baseScore += 28;
  else if (input.trainingRelevanceScore === 3) baseScore += 12;
  else baseScore -= 10;

  if (input.isInformal) baseScore += 22;

  if (input.shiftType === 'Rotational') baseScore += 10;
  if (input.shiftType === 'Night') baseScore += 15;

  if (input.monthsInJob <= 3) baseScore += 15;
  else if (input.monthsInJob >= 12) baseScore -= 15;

  const score = Math.max(5, Math.min(95, baseScore));

  let level: AttritionPrediction['level'] = 'Low';
  let intervention = 'Standard 6-month automated check-in cadence.';

  if (score >= 75) {
    level = 'Critical';
    intervention = 'URGENT: Trigger dedicated counselor call within 48 hours + evaluate transport subsidy or job re-match.';
  } else if (score >= 50) {
    level = 'High';
    intervention = 'Dispatch micro-survey on workplace satisfaction + offer weekend bridge upskilling module.';
  } else if (score >= 30) {
    level = 'Moderate';
    intervention = 'Monitor next monthly EPFO contribution + send peer community invite.';
  }

  return { score, level, intervention };
}
