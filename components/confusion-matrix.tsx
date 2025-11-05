"use client"

import { Card } from "@/components/ui/card"

interface ConfusionMatrixProps {
  matrix: number[][]
  diseases?: string[]
}

export function ConfusionMatrix({ matrix, diseases = ["Clase A", "Clase B", "Clase C"] }: ConfusionMatrixProps) {
  const total = matrix.flat().reduce((a, b) => a + b, 0)
  const maxValue = Math.max(...matrix.flat())

  const diseaseColors = [
    "bg-chart-1", // Dengue - green
    "bg-chart-2", // Malaria - amber
    "bg-chart-3", // Leptospirosis - teal
  ]

  return (
    <Card className="p-6 bg-card border-border shadow-lg">
      <h4 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">Matriz de Confusión</h4>
      <p className="text-xs text-muted-foreground mb-4">
        Comparación entre diagnósticos reales y predichos por el modelo
      </p>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="grid gap-2" style={{ gridTemplateColumns: `auto repeat(${matrix[0].length}, 1fr)` }}>
            {/* Header */}
            <div className="col-span-1"></div>
            {diseases.map((disease, idx) => (
              <div key={`header-${idx}`} className="text-center text-xs font-semibold text-muted-foreground p-2">
                Predicho:
                <br />
                {disease}
              </div>
            ))}

            {/* Matrix rows */}
            {matrix.map((row, rowIdx) => (
              <>
                <div
                  key={`label-${rowIdx}`}
                  className="text-xs font-semibold text-muted-foreground p-2 flex items-center"
                >
                  Real:
                  <br />
                  {diseases[rowIdx]}
                </div>
                {row.map((value, colIdx) => {
                  const isCorrect = rowIdx === colIdx
                  const opacity = value / maxValue

                  return (
                    <div key={`cell-${rowIdx}-${colIdx}`} className="relative">
                      <div
                        className={`absolute inset-0 rounded-lg ${
                          isCorrect ? diseaseColors[rowIdx] + "/30" : "bg-destructive/20"
                        }`}
                        style={{ opacity: Math.max(opacity, 0.2) }}
                      />
                      <div className="relative p-4 text-center">
                        <div className={`text-2xl font-bold ${isCorrect ? "text-foreground" : "text-destructive"}`}>
                          {value}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{((value / total) * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                  )
                })}
              </>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-primary/40" />
            <span className="text-muted-foreground">Diagnósticos Correctos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-destructive/40" />
            <span className="text-muted-foreground">Diagnósticos Incorrectos</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          La diagonal principal representa los diagnósticos correctos. Los valores fuera de la diagonal indican
          confusiones entre enfermedades.
        </p>
      </div>
    </Card>
  )
}
