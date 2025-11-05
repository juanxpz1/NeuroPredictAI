"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Play, Loader2, Database, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TrainingPanelProps {
  selectedModel: "RNA" | "RLO"
  onTrainingComplete: (metrics: any) => void
}

export function TrainingPanel({ selectedModel, onTrainingComplete }: TrainingPanelProps) {
  const [isTraining, setIsTraining] = useState(false)
  const [trainingFile, setTrainingFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]
      if (validTypes.includes(file.type) || file.name.endsWith(".csv") || file.name.endsWith(".xlsx")) {
        setTrainingFile(file)
        toast({
          title: "Dataset cargado",
          description: `${file.name} listo para entrenamiento`,
        })
      } else {
        toast({
          title: "Formato inválido",
          description: "Por favor, sube un archivo CSV o XLSX con datos clínicos",
          variant: "destructive",
        })
      }
    }
  }

  const handleTrain = async () => {
    if (!trainingFile) {
      toast({
        title: "Archivo requerido",
        description: "Por favor, carga el dataset de entrenamiento",
        variant: "destructive",
      })
      return
    }

    setIsTraining(true)
    const startTime = Date.now()

    // Simulate training
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const endTime = Date.now()
    const trainingTime = ((endTime - startTime) / 1000).toFixed(2)

    const metrics = {
      accuracy: selectedModel === "RNA" ? "88.9" : "82.7",
      f1Score: selectedModel === "RNA" ? "0.887" : "0.824",
      trainingTime,
    }

    setIsTraining(false)
    onTrainingComplete(metrics)

    toast({
      title: "Entrenamiento completado exitosamente",
      description: `Modelo ${selectedModel} entrenado con ${trainingFile.name}`,
    })
  }

  return (
    <Card className="p-6 bg-card border-border shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4 text-accent" />
        <h3 className="text-sm font-bold text-foreground">Entrenar Modelo</h3>
      </div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/10 border border-accent/20 mb-4">
        <AlertCircle className="w-4 h-4 text-accent mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Carga el dataset con 56 variables sociodemográficas, clínicas y de laboratorio de pacientes con dengue,
          malaria o leptospirosis.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="training-file" className="text-xs font-semibold text-foreground mb-2 block">
            Dataset de Entrenamiento
          </Label>
          <div className="relative">
            <Input id="training-file" type="file" accept=".csv,.xlsx" onChange={handleFileChange} className="hidden" />
            <Label
              htmlFor="training-file"
              className="flex items-center justify-center gap-3 p-5 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-accent/50 transition-all"
            >
              <Upload className="w-5 h-5 text-muted-foreground" />
              <div className="text-center">
                <span className="text-sm font-medium text-foreground block">
                  {trainingFile ? trainingFile.name : "Cargar CSV o XLSX"}
                </span>
                {trainingFile && <span className="text-xs text-muted-foreground mt-1 block">Listo para entrenar</span>}
              </div>
            </Label>
          </div>
        </div>

        <Button
          onClick={handleTrain}
          disabled={isTraining || !trainingFile}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          size="lg"
        >
          {isTraining ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Entrenando Modelo {selectedModel}...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Entrenar Modelo {selectedModel}
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
