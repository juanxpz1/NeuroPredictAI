"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2, Plus, Trash2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateDeterministicPrediction } from "@/lib/prediction-utils"

interface PredictionPanelProps {
  selectedModel: "RNA" | "RLO"
  isModelTrained: boolean
}

const MEDICAL_VARIABLES = [
  { name: "Edad", placeholder: "Años", type: "number" },
  { name: "Temperatura", placeholder: "°C", type: "number" },
  { name: "Plaquetas", placeholder: "x10³/μL", type: "number" },
  { name: "Leucocitos", placeholder: "x10³/μL", type: "number" },
  { name: "Hemoglobina", placeholder: "g/dL", type: "number" },
  { name: "Hematocrito", placeholder: "%", type: "number" },
  { name: "ALT (TGP)", placeholder: "U/L", type: "number" },
  { name: "AST (TGO)", placeholder: "U/L", type: "number" },
  { name: "Bilirrubina Total", placeholder: "mg/dL", type: "number" },
  { name: "Creatinina", placeholder: "mg/dL", type: "number" },
]

export function PredictionPanel({ selectedModel, isModelTrained }: PredictionPanelProps) {
  const [features, setFeatures] = useState<{ name: string; value: string; placeholder: string }[]>(
    MEDICAL_VARIABLES.slice(0, 5).map((v) => ({ name: v.name, value: "", placeholder: v.placeholder })),
  )
  const [isPredicting, setIsPredicting] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const { toast } = useToast()

  const addFeature = () => {
    const nextVar = MEDICAL_VARIABLES[features.length % MEDICAL_VARIABLES.length]
    setFeatures([...features, { name: nextVar.name, value: "", placeholder: nextVar.placeholder }])
  }

  const removeFeature = (index: number) => {
    if (features.length > 1) {
      setFeatures(features.filter((_, i) => i !== index))
    }
  }

  const updateFeature = (index: number, field: "name" | "value", value: string) => {
    const newFeatures = [...features]
    newFeatures[index][field] = value
    setFeatures(newFeatures)
  }

  const handlePredict = async () => {
    if (!isModelTrained) {
      toast({
        title: "Modelo no entrenado",
        description: "Primero debes entrenar el modelo con el dataset",
        variant: "destructive",
      })
      return
    }

    const emptyFields = features.filter((f) => !f.value)
    if (emptyFields.length > 0) {
      toast({
        title: "Campos incompletos",
        description: "Por favor, completa todas las variables clínicas",
        variant: "destructive",
      })
      return
    }

    setIsPredicting(true)
    const startTime = Date.now()

    // Simulate prediction delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const endTime = Date.now()
    const predictionTime = ((endTime - startTime) / 1000).toFixed(3)

    // Same variables input = Same diagnosis output
    const result = generateDeterministicPrediction(features, selectedModel)

    setPrediction({
      ...result,
      predictionTime,
    })
    setIsPredicting(false)

    toast({
      title: "Diagnóstico completado",
      description: `Resultado: ${result.disease}`,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
        <AlertCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1">Diagnóstico Diferencial Individual</h4>
          <p className="text-xs text-muted-foreground">
            Ingresa los valores de laboratorio y datos clínicos del paciente para obtener un diagnóstico diferencial
            entre Dengue, Malaria y Leptospirosis.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          Variables Clínicas y de Laboratorio
        </h3>
      </div>

      <div className="space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground mb-1.5 block">{feature.name}</Label>
              <Input
                type="number"
                step="0.01"
                placeholder={feature.placeholder}
                value={feature.value}
                onChange={(e) => updateFeature(index, "value", e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => removeFeature(index)}
              disabled={features.length === 1}
              className="border-border mt-6"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <Button variant="outline" onClick={addFeature} className="w-full border-dashed border-border bg-transparent">
        <Plus className="w-4 h-4 mr-2" />
        Agregar Variable Clínica
      </Button>

      <Button
        onClick={handlePredict}
        disabled={isPredicting || !isModelTrained}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        {isPredicting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Analizando...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Realizar Diagnóstico
          </>
        )}
      </Button>

      {prediction && (
        <Card className="p-6 bg-linear-to-br from-accent/10 to-primary/5 border-accent/30 shadow-lg">
          <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            Resultado del Diagnóstico Diferencial
          </h4>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-muted-foreground">Diagnóstico Predicho</span>
                <span className="text-xs font-mono text-muted-foreground">Modelo: {selectedModel}</span>
              </div>
              <div className="text-2xl font-bold text-accent mb-1">{prediction.disease}</div>
              <div className="text-xs text-muted-foreground">
                Confianza: {(prediction.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground">Probabilidades por Enfermedad:</p>
              {Object.entries(prediction.probabilities).map(([disease, prob]: [string, any]) => (
                <div key={disease} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">{disease}</span>
                    <span className="font-mono text-muted-foreground">{(prob * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        disease === "Dengue" ? "bg-chart-1" : disease === "Malaria" ? "bg-chart-2" : "bg-chart-3"
                      }`}
                      style={{ width: `${prob * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-border flex justify-between items-center text-xs">
              <span className="text-muted-foreground">Tiempo de Procesamiento</span>
              <span className="font-mono text-foreground font-semibold">{prediction.predictionTime}s</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
