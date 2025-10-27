"use client"

import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Network, TrendingUp, Info } from "lucide-react"

interface ModelSelectorProps {
  selectedModel: "RNA" | "RLO"
  onModelChange: (model: "RNA" | "RLO") => void
}

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  return (
    <Card className="p-6 bg-card border-border shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-bold text-foreground">Seleccionar Modelo de ML</h3>
        <Info className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-xs text-muted-foreground mb-4">Elige el algoritmo para el diagnóstico diferencial</p>
      <RadioGroup value={selectedModel} onValueChange={(value) => onModelChange(value as "RNA" | "RLO")}>
        <div className="space-y-3">
          <div
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedModel === "RNA"
                ? "border-primary bg-primary/5 shadow-sm"
                : "border-border hover:bg-muted/50 hover:border-primary/30"
            }`}
          >
            <RadioGroupItem value="RNA" id="rna" />
            <Label htmlFor="rna" className="flex items-center gap-3 cursor-pointer flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  selectedModel === "RNA" ? "bg-primary/20" : "bg-primary/10"
                }`}
              >
                <Network className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">Red Neuronal Artificial (RNA)</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Deep Learning - Mayor precisión en patrones complejos
                </div>
              </div>
            </Label>
          </div>

          <div
            className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedModel === "RLO"
                ? "border-secondary bg-secondary/5 shadow-sm"
                : "border-border hover:bg-muted/50 hover:border-secondary/30"
            }`}
          >
            <RadioGroupItem value="RLO" id="rlo" />
            <Label htmlFor="rlo" className="flex items-center gap-3 cursor-pointer flex-1">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                  selectedModel === "RLO" ? "bg-secondary/20" : "bg-secondary/10"
                }`}
              >
                <TrendingUp className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">Regresión Logística (RLO)</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Clasificación Lineal - Rápido e interpretable
                </div>
              </div>
            </Label>
          </div>
        </div>
      </RadioGroup>
    </Card>
  )
}
