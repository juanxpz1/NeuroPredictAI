"use client"

import { Card } from "@/components/ui/card"
import { Target, TrendingUp, Activity, Zap, Users, Clock } from "lucide-react"

interface MetricsDisplayProps {
  metrics: {
    accuracy: number
    precision: number
    recall: number
    f1Score: number
    totalSamples: number
    predictionTime: string
  }
}

export function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  const metricsData = [
    {
      label: "Accuracy",
      description: "Precisión general del modelo",
      value: (metrics.accuracy * 100).toFixed(2) + "%",
      icon: Target,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      label: "Precision",
      description: "Exactitud de predicciones positivas",
      value: (metrics.precision * 100).toFixed(2) + "%",
      icon: TrendingUp,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
      borderColor: "border-secondary/20",
    },
    {
      label: "Recall",
      description: "Sensibilidad del modelo",
      value: (metrics.recall * 100).toFixed(2) + "%",
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10",
      borderColor: "border-accent/20",
    },
    {
      label: "F1-Score",
      description: "Media armónica de Precision y Recall",
      value: metrics.f1Score.toFixed(3),
      icon: Zap,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
      borderColor: "border-chart-4/20",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsData.map((metric, index) => {
          const Icon = metric.icon
          return (
            <Card
              key={index}
              className={`p-4 bg-card border ${metric.borderColor} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-semibold text-foreground mb-0.5">{metric.label}</p>
                  <p className="text-[10px] text-muted-foreground">{metric.description}</p>
                </div>
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mt-2">{metric.value}</p>
            </Card>
          )
        })}
      </div>

      <Card className="p-5 bg-linear-to-br from-muted/50 to-muted/30 border-border shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pacientes Analizados</p>
              <p className="text-xl font-bold text-foreground">{metrics.totalSamples}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tiempo de Procesamiento</p>
              <p className="text-xl font-bold text-foreground">{metrics.predictionTime}s</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-secondary/10">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Velocidad de Análisis</p>
              <p className="text-xl font-bold text-foreground">
                {(metrics.totalSamples / Number.parseFloat(metrics.predictionTime)).toFixed(1)} pac/s
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
