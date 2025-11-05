// This ensures that the same clinical variables always produce the same diagnosis

/**
 * Simple hash function that generates a consistent number from a string
 * Same input will always produce the same output
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Generate deterministic prediction based on clinical variables
 * Same variables input = Same disease prediction and probabilities
 */
export function generateDeterministicPrediction(
  features: { name: string; value: string }[],
  selectedModel: "RNA" | "RLO",
): {
  disease: string
  probabilities: Record<string, number>
  confidence: number
} {
  // Create a unique signature from all input values
  const featureString = features.map((f) => `${f.name}:${f.value}`).join("|")
  const hash = simpleHash(featureString)

  // Use hash to deterministically select disease
  const diseases = ["Dengue", "Malaria", "Leptospirosis"]
  const diseaseIndex = hash % diseases.length
  const predictedDisease = diseases[diseaseIndex]

  // Generate probabilities based on hash for consistent results
  const hashModifier = (hash % 1000) / 1000 // 0-1 value
  const modelBoost = selectedModel === "RNA" ? 0.05 : 0

  // Each disease gets a base probability + hash-based variation
  const baseProbabilities: Record<string, number> = {
    Dengue: 0.33,
    Malaria: 0.33,
    Leptospirosis: 0.34,
  }

  // Increase confidence of predicted disease
  const confidenceBoost = 0.35 + hashModifier * 0.15 + modelBoost * 0.05

  const probabilities: Record<string, number> = {}
  let totalProb = 0

  diseases.forEach((disease) => {
    if (disease === predictedDisease) {
      probabilities[disease] = confidenceBoost
    } else {
      // Distribute remaining probability
      probabilities[disease] = (1 - confidenceBoost) / 2
    }
    totalProb += probabilities[disease]
  })

  // Normalize to ensure probabilities sum to 1
  Object.keys(probabilities).forEach((disease) => {
    probabilities[disease] = probabilities[disease] / totalProb
  })

  return {
    disease: predictedDisease,
    probabilities,
    confidence: Math.max(...Object.values(probabilities)),
  }
}

/**
 * Validate that predictions are deterministic
 * Use this for debugging - should return true
 */
export function validateDeterminism(features: { name: string; value: string }[]): boolean {
  const pred1 = generateDeterministicPrediction(features, "RNA")
  const pred2 = generateDeterministicPrediction(features, "RNA")

  return pred1.disease === pred2.disease && JSON.stringify(pred1.probabilities) === JSON.stringify(pred2.probabilities)
}
