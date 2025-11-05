"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, Loader2, Download, AlertCircle, FileSpreadsheet } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ConfusionMatrix } from "@/components/confusion-matrix"
import { MetricsDisplay } from "@/components/metrics-display"

interface BatchPredictionPanelProps {
  selectedModel: "RNA" | "RLO"
  isModelTrained: boolean
}

export function BatchPredictionPanel({ selectedModel, isModelTrained }: BatchPredictionPanelProps) {
  const [batchFile, setBatchFile] = useState<File | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [results, setResults] = useState<any>(null)
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
        setBatchFile(file)
        toast({
          title: "Archivo cargado exitosamente",
          description: `${file.name} listo para análisis por lotes`,
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

  const handleBatchPredict = async () => {
    if (!isModelTrained) {
      toast({
        title: "Modelo no entrenado",
        description: "Primero debes entrenar el modelo con el dataset",
        variant: "destructive",
      })
      return
    }

    if (!batchFile) {
      toast({
        title: "Archivo requerido",
        description: "Por favor, carga un archivo con datos de pacientes",
        variant: "destructive",
      })
      return
    }

    setIsPredicting(true)
    const startTime = Date.now()

    // Simulate batch prediction
    await new Promise((resolve) => setTimeout(resolve, 2500))

    const endTime = Date.now()
    const predictionTime = ((endTime - startTime) / 1000).toFixed(2)

    const confusionMatrix = [
      [28, 2, 1], // Dengue: 28 correct, 2 confused with Malaria, 1 with Leptospirosis
      [1, 25, 2], // Malaria: 1 confused with Dengue, 25 correct, 2 with Leptospirosis
      [2, 1, 19], // Leptospirosis: 2 confused with Dengue, 1 with Malaria, 19 correct
    ]

    const metrics = {
      accuracy: selectedModel === "RNA" ? 0.889 : 0.827,
      precision: selectedModel === "RNA" ? 0.883 : 0.815,
      recall: selectedModel === "RNA" ? 0.891 : 0.834,
      f1Score: selectedModel === "RNA" ? 0.887 : 0.824,
      totalSamples: 81,
      predictionTime,
    }

    setResults({
      confusionMatrix,
      metrics,
      diseases: ["Dengue", "Malaria", "Leptospirosis"],
    })

    setIsPredicting(false)

    toast({
      title: "Análisis por lotes completado",
      description: `${metrics.totalSamples} pacientes procesados exitosamente`,
    })
  }

  const handleDownloadResults = () => {
    toast({
      title: "Descargando resultados",
      description: "Exportando diagnósticos y métricas a CSV...",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10 border border-accent/20">
        <AlertCircle className="w-5 h-5 text-accent mt-0.5 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-1">Análisis Masivo de Pacientes</h4>
          <p className="text-xs text-muted-foreground">
            Carga un archivo CSV o XLSX con datos clínicos de múltiples pacientes para realizar diagnósticos
            diferenciales en lote y obtener métricas de rendimiento del modelo.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="batch-file" className="text-xs font-semibold text-foreground mb-2 block">
            Archivo de Datos Clínicos
          </Label>
          <div className="relative">
            <Input id="batch-file" type="file" accept=".csv,.xlsx" onChange={handleFileChange} className="hidden" />
            <Label
              htmlFor="batch-file"
              className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 hover:border-accent/50 transition-all"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
                {batchFile ? (
                  <FileSpreadsheet className="w-6 h-6 text-accent" />
                ) : (
                  <Upload className="w-6 h-6 text-muted-foreground" />
                )}
              </div>
              <div className="text-center">
                <span className="text-sm font-medium text-foreground block mb-1">
                  {batchFile ? batchFile.name : "Cargar archivo CSV o XLSX"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {batchFile ? "Archivo listo para procesar" : "Arrastra o haz clic para seleccionar"}
                </span>
              </div>
            </Label>
          </div>
        </div>

        <Button
          onClick={handleBatchPredict}
          disabled={isPredicting || !isModelTrained || !batchFile}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          size="lg"
        >
          {isPredicting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Procesando {batchFile?.name}...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Analizar Lote de Pacientes
            </>
          )}
        </Button>
      </div>

      {results && (
        <div className="space-y-6 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-foreground flex items-center gap-2">Resultados del Análisis</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadResults}
              className="border-border bg-transparent hover:bg-accent/10 hover:border-accent"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          <MetricsDisplay metrics={results.metrics} />

          <ConfusionMatrix matrix={results.confusionMatrix} diseases={results.diseases} />
        </div>
      )}
    </div>
  )
}
