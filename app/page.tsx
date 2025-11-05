"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ModelSelector } from "@/components/model-selector"
import { TrainingPanel } from "@/components/training-panel"
import { PredictionPanel } from "@/components/prediction-panel"
import { BatchPredictionPanel } from "@/components/batch-prediction-panel"
import { Activity, Microscope, MapPin, Database, Github } from "lucide-react"

export default function Home() {
  const [selectedModel, setSelectedModel] = useState<"RNA" | "RLO">("RNA")
  const [isModelTrained, setIsModelTrained] = useState(false)
  const [modelMetrics, setModelMetrics] = useState<any>(null)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-primary via-accent to-primary/80 shadow-lg">
                <div className="absolute inset-0 bg-linear-to-br from-primary/30 to-accent/30 animate-pulse rounded-2xl" />
                <Microscope className="w-8 h-8 text-primary-foreground relative z-10" strokeWidth={2.5} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse shadow-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-2">
                  NeuroPredict<span className="text-accent">AI</span>
                </h1>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3 h-3" />
                  Sistema de Diagnóstico Diferencial - Región Caribe Colombiana
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2 hover:bg-accent/10 hover:text-accent hover:border-accent transition-colors bg-transparent"
                onClick={() => window.open("https://github.com/juanxpz1/NeuroPredictAI", "_blank")}
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </Button>
              <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
                <Database className="w-4 h-4 text-accent" />
                <div className="text-left">
                  <p className="text-[10px] text-muted-foreground font-medium">Dataset</p>
                  <p className="text-xs font-semibold text-foreground">81 pacientes, 56 variables</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted/50 border border-border">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${isModelTrained ? "bg-accent shadow-lg shadow-accent/50 animate-pulse" : "bg-muted-foreground/50"}`}
                />
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-foreground">
                  {isModelTrained ? "Modelo Activo" : "Sin Entrenar"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-chart-1/10 border border-chart-1/20">
              <div className="w-2 h-2 rounded-full bg-chart-1" />
              <span className="text-xs font-medium text-foreground">Dengue</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-chart-2/10 border border-chart-2/20">
              <div className="w-2 h-2 rounded-full bg-chart-2" />
              <span className="text-xs font-medium text-foreground">Malaria</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-chart-3/10 border border-chart-3/20">
              <div className="w-2 h-2 rounded-full bg-chart-3" />
              <span className="text-xs font-medium text-foreground">Leptospirosis</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Sidebar - Model Selection & Training */}
          <div className="lg:col-span-4 space-y-6">
            <ModelSelector selectedModel={selectedModel} onModelChange={setSelectedModel} />

            <TrainingPanel
              selectedModel={selectedModel}
              onTrainingComplete={(metrics) => {
                setIsModelTrained(true)
                setModelMetrics(metrics)
              }}
            />

            {modelMetrics && (
              <Card className="p-6 bg-card border-border shadow-lg">
                <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-accent" />
                  Métricas del Modelo
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                    <span className="text-xs font-medium text-muted-foreground">Precisión (Accuracy)</span>
                    <span className="text-sm font-mono font-bold text-accent">{modelMetrics.accuracy}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                    <span className="text-xs font-medium text-muted-foreground">F1-Score</span>
                    <span className="text-sm font-mono font-bold text-accent">{modelMetrics.f1Score}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-muted/50">
                    <span className="text-xs font-medium text-muted-foreground">Tiempo de Entrenamiento</span>
                    <span className="text-sm font-mono font-bold text-muted-foreground">
                      {modelMetrics.trainingTime}s
                    </span>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Main Panel - Predictions */}
          <div className="lg:col-span-8">
            <Card className="bg-card border-border shadow-lg">
              <Tabs defaultValue="individual" className="w-full">
                <div className="border-b border-border px-6 pt-6">
                  <TabsList className="w-full grid grid-cols-2 bg-muted/50">
                    <TabsTrigger
                      value="individual"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
                    >
                      Diagnóstico Individual
                    </TabsTrigger>
                    <TabsTrigger
                      value="batch"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-semibold"
                    >
                      Análisis por Lotes
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="individual" className="p-6 mt-0">
                  <PredictionPanel selectedModel={selectedModel} isModelTrained={isModelTrained} />
                </TabsContent>

                <TabsContent value="batch" className="p-6 mt-0">
                  <BatchPredictionPanel selectedModel={selectedModel} isModelTrained={isModelTrained} />
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="text-xs text-muted-foreground">
                Dataset:{" "}
                <span className="font-semibold text-foreground">
                  Enfermedades Tropicales - Región Endémica de Colombia
                </span>
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Universidad Cooperativa de Colombia
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Powered by</span>
              <span className="font-bold text-accent">NeuroPredictAI</span>
              <span>© 2025</span>
              <span className="font-bold text-accent">Autores: Juan Argüelles y Juan de la Espriella</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
