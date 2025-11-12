"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import { Sparkles, Loader2, AlertCircle, User, Thermometer, AlertTriangle, Droplet, FlaskConical } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateDeterministicPrediction } from "@/lib/prediction-utils"

interface PredictionPanelProps {
  selectedModel: "RNA" | "RLO"
  isModelTrained: boolean
}

// Interface para los datos del formulario
interface PredictionFormData {
  // Información Básica
  age: string
  male: number
  female: number
  urban_origin: number
  rural_origin: number
  occupation: string // "homemaker" | "student" | "professional" | "merchant" | "agriculture_livestock" | "various_jobs" | "unemployed"
  hospitalization_days: string

  // Síntomas (21 síntomas - todos binarios 0/1)
  fever: number
  headache: number
  vomiting: number
  abdominal_pain: number
  diarrhea: number
  myalgias: number
  arthralgias: number
  rash: number
  jaundice: number
  hemorrhages: number
  respiratory_difficulty: number
  dizziness: number
  loss_of_appetite: number
  weakness: number
  eye_pain: number
  chills: number
  hemoptysis: number
  edema: number
  bruises: number
  petechiae: number
  itching: number

  // Signos Vitales
  body_temperature: string

  // Hemograma (10 campos)
  platelets: string
  white_blood_cells: string
  hemoglobin: string
  hematocrit: string
  red_blood_cells: string
  neutrophils: string
  lymphocytes: string
  eosinophils: string
  basophils: string
  monocytes: string

  // Bioquímica (10 campos)
  creatinine: string
  urea: string
  total_bilirubin: string
  direct_bilirubin: string
  indirect_bilirubin: string
  AST: string
  ALT: string
  ALP: string
  albumin: string
  total_proteins: string
}

// Reglas de validación
const VALIDATION_RULES = {
  age: { min: 0, max: 110, type: "integer", label: "Edad", unit: "años", rangeText: "0-110 años" },
  body_temperature: { min: 30.0, max: 45.0, type: "decimal", label: "Temperatura Corporal", unit: "°C", rangeText: "30.0-45.0 °C" },
  hospitalization_days: { min: 0, max: 120, type: "integer", label: "Días de Hospitalización", unit: "días", rangeText: "0-120 días" },
  platelets: { min: 0, max: 1500, type: "decimal", label: "Plaquetas", unit: "x10³/μL", rangeText: "0-1500 x10³/μL" },
  white_blood_cells: { min: 0, max: 200, type: "decimal", label: "Leucocitos", unit: "x10³/μL", rangeText: "0-200 x10³/μL" },
  hemoglobin: { min: 0, max: 25, type: "decimal", label: "Hemoglobina", unit: "g/dL", rangeText: "0-25 g/dL" },
  hematocrit: { min: 0, max: 70, type: "decimal", label: "Hematocrito", unit: "%", rangeText: "0-70%" },
  red_blood_cells: { min: 0, max: 10, type: "decimal", label: "Glóbulos rojos", unit: "x10⁶/μL", rangeText: "0-10 x10⁶/μL" },
  neutrophils: { min: 0, max: 100, type: "decimal", label: "Neutrófilos", unit: "%", rangeText: "0-100%" },
  lymphocytes: { min: 0, max: 100, type: "decimal", label: "Linfocitos", unit: "%", rangeText: "0-100%" },
  eosinophils: { min: 0, max: 100, type: "decimal", label: "Eosinófilos", unit: "%", rangeText: "0-100%" },
  basophils: { min: 0, max: 100, type: "decimal", label: "Basófilos", unit: "%", rangeText: "0-100%" },
  monocytes: { min: 0, max: 100, type: "decimal", label: "Monocitos", unit: "%", rangeText: "0-100%" },
  creatinine: { min: 0, max: 20, type: "decimal", label: "Creatinina", unit: "mg/dL", rangeText: "0-20 mg/dL" },
  urea: { min: 0, max: 300, type: "decimal", label: "Urea", unit: "mg/dL", rangeText: "0-300 mg/dL" },
  total_bilirubin: { min: 0, max: 50, type: "decimal", label: "Bilirrubina Total", unit: "mg/dL", rangeText: "0-50 mg/dL" },
  direct_bilirubin: { min: 0, max: 50, type: "decimal", label: "Bilirrubina Directa", unit: "mg/dL", rangeText: "0-50 mg/dL" },
  indirect_bilirubin: { min: 0, max: 50, type: "decimal", label: "Bilirrubina Indirecta", unit: "mg/dL", rangeText: "0-50 mg/dL" },
  AST: { min: 0, max: 2000, type: "decimal", label: "AST (SGOT)", unit: "U/L", rangeText: "0-2000 U/L" },
  ALT: { min: 0, max: 2000, type: "decimal", label: "ALT (SGPT)", unit: "U/L", rangeText: "0-2000 U/L" },
  ALP: { min: 0, max: 3000, type: "decimal", label: "Fosfatasa Alcalina (ALP)", unit: "U/L", rangeText: "0-3000 U/L" },
  albumin: { min: 0, max: 6, type: "decimal", label: "Albúmina", unit: "g/dL", rangeText: "0-6 g/dL" },
  total_proteins: { min: 0, max: 12, type: "decimal", label: "Proteínas Totales", unit: "g/dL", rangeText: "0-12 g/dL" },
} as const

// Estado inicial del formulario
const initialFormData: PredictionFormData = {
  age: "",
  male: 0,
  female: 0,
  urban_origin: 0,
  rural_origin: 0,
  occupation: "",
  hospitalization_days: "",
  fever: 0,
  headache: 0,
  vomiting: 0,
  abdominal_pain: 0,
  diarrhea: 0,
  myalgias: 0,
  arthralgias: 0,
  rash: 0,
  jaundice: 0,
  hemorrhages: 0,
  respiratory_difficulty: 0,
  dizziness: 0,
  loss_of_appetite: 0,
  weakness: 0,
  eye_pain: 0,
  chills: 0,
  hemoptysis: 0,
  edema: 0,
  bruises: 0,
  petechiae: 0,
  itching: 0,
  body_temperature: "",
  platelets: "",
  white_blood_cells: "",
  hemoglobin: "",
  hematocrit: "",
  red_blood_cells: "",
  neutrophils: "",
  lymphocytes: "",
  eosinophils: "",
  basophils: "",
  monocytes: "",
  creatinine: "",
  urea: "",
  total_bilirubin: "",
  direct_bilirubin: "",
  indirect_bilirubin: "",
  AST: "",
  ALT: "",
  ALP: "",
  albumin: "",
  total_proteins: "",
}

export function PredictionPanel({ selectedModel, isModelTrained }: PredictionPanelProps) {
  const [formData, setFormData] = useState<PredictionFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isPredicting, setIsPredicting] = useState(false)
  const [prediction, setPrediction] = useState<any>(null)
  const { toast } = useToast()

  // Validar campo numérico
  const validateNumericField = (fieldName: string, value: string): string | null => {
    if (!value || value.trim() === "") {
      const rule = VALIDATION_RULES[fieldName as keyof typeof VALIDATION_RULES]
      const fieldLabel = rule?.label || fieldName
      return `${fieldLabel} es obligatorio`
    }

    const rule = VALIDATION_RULES[fieldName as keyof typeof VALIDATION_RULES]
    if (!rule) return null

    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      return `Debe ser un número válido`
    }

    if (numValue < 0) {
      return `No se permiten valores negativos. Rango: ${rule.rangeText}`
    }

    if (rule.type === "integer" && !Number.isInteger(numValue)) {
      return `Debe ser un número entero. Rango: ${rule.rangeText}`
    }

    if (numValue < rule.min || numValue > rule.max) {
      return `Valor fuera de rango. Debe estar entre ${rule.min} y ${rule.max} ${rule.unit || ""}`.trim()
    }

    return null
  }

  // Validar formulario completo
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validar campos numéricos
    Object.keys(VALIDATION_RULES).forEach((field) => {
      const value = formData[field as keyof PredictionFormData] as string
      const error = validateNumericField(field, value)
      if (error) {
        newErrors[field] = error
      }
    })

    // Validar género (debe haber exactamente uno seleccionado)
    if (formData.male === 0 && formData.female === 0) {
      newErrors.gender = "Debe seleccionar un género"
    } else if (formData.male === 1 && formData.female === 1) {
      newErrors.gender = "Solo puede seleccionar un género"
    }

    // Validar origen (debe haber exactamente uno seleccionado)
    if (formData.urban_origin === 0 && formData.rural_origin === 0) {
      newErrors.origin = "Debe seleccionar una procedencia"
    } else if (formData.urban_origin === 1 && formData.rural_origin === 1) {
      newErrors.origin = "Solo puede seleccionar una procedencia"
    }

    // Validar ocupación
    if (!formData.occupation || formData.occupation.trim() === "") {
      newErrors.occupation = "Debe seleccionar una ocupación"
    }

    // Validar advertencia de diferenciales (no bloquea, solo advertencia)
    const differentialSum =
      parseFloat(formData.neutrophils || "0") +
      parseFloat(formData.lymphocytes || "0") +
      parseFloat(formData.eosinophils || "0") +
      parseFloat(formData.basophils || "0") +
      parseFloat(formData.monocytes || "0")

    if (differentialSum > 100) {
      // Solo advertencia, no bloquea
      console.warn("La suma de diferenciales excede 100%")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Actualizar campo numérico
  const updateNumericField = (field: keyof PredictionFormData, value: string) => {
    let sanitized = value.replace(/[^0-9.]/g, "")

    const parts = sanitized.split(".")
    if (parts.length > 2) {
      sanitized = parts[0] + "." + parts.slice(1).join("")
    }

    const rule = VALIDATION_RULES[field as keyof typeof VALIDATION_RULES]
    if (rule && sanitized) {
      const numValue = parseFloat(sanitized)
      if (!isNaN(numValue)) {
        if (numValue > rule.max) {
          sanitized = rule.max.toString()
        }
        if (numValue < 0) {
          sanitized = "0"
        }
      }
    }

    setFormData({ ...formData, [field]: sanitized })
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  // Actualizar campo binario (síntoma)
  const updateBinaryField = (field: keyof PredictionFormData, value: number) => {
    setFormData({ ...formData, [field]: value })
  }

  // Actualizar género
  const updateGender = (value: "male" | "female") => {
    setFormData({
      ...formData,
      male: value === "male" ? 1 : 0,
      female: value === "female" ? 1 : 0,
    })
    if (errors.gender) {
      const newErrors = { ...errors }
      delete newErrors.gender
      setErrors(newErrors)
    }
  }

  // Actualizar origen
  const updateOrigin = (value: "urban" | "rural") => {
    setFormData({
      ...formData,
      urban_origin: value === "urban" ? 1 : 0,
      rural_origin: value === "rural" ? 1 : 0,
    })
    if (errors.origin) {
      const newErrors = { ...errors }
      delete newErrors.origin
      setErrors(newErrors)
    }
  }

  // Convertir datos del formulario a features para predicción
  const convertFormDataToFeatures = (data: PredictionFormData) => {
    // Convertir ocupación a one-hot encoding
    const occupationFields = {
      homemaker: 0,
      student: 0,
      professional: 0,
      merchant: 0,
      agriculture_livestock: 0,
      various_jobs: 0,
      unemployed: 0,
    }

    if (data.occupation && occupationFields.hasOwnProperty(data.occupation)) {
      occupationFields[data.occupation as keyof typeof occupationFields] = 1
    }

    // Crear array de features en el formato esperado
    const features = [
      { name: "age", value: data.age },
      { name: "male", value: data.male.toString() },
      { name: "female", value: data.female.toString() },
      { name: "urban_origin", value: data.urban_origin.toString() },
      { name: "rural_origin", value: data.rural_origin.toString() },
      { name: "homemaker", value: occupationFields.homemaker.toString() },
      { name: "student", value: occupationFields.student.toString() },
      { name: "professional", value: occupationFields.professional.toString() },
      { name: "merchant", value: occupationFields.merchant.toString() },
      { name: "agriculture_livestock", value: occupationFields.agriculture_livestock.toString() },
      { name: "various_jobs", value: occupationFields.various_jobs.toString() },
      { name: "unemployed", value: occupationFields.unemployed.toString() },
      { name: "hospitalization_days", value: data.hospitalization_days },
      { name: "fever", value: data.fever.toString() },
      { name: "headache", value: data.headache.toString() },
      { name: "vomiting", value: data.vomiting.toString() },
      { name: "abdominal_pain", value: data.abdominal_pain.toString() },
      { name: "diarrhea", value: data.diarrhea.toString() },
      { name: "myalgias", value: data.myalgias.toString() },
      { name: "arthralgias", value: data.arthralgias.toString() },
      { name: "rash", value: data.rash.toString() },
      { name: "jaundice", value: data.jaundice.toString() },
      { name: "hemorrhages", value: data.hemorrhages.toString() },
      { name: "respiratory_difficulty", value: data.respiratory_difficulty.toString() },
      { name: "dizziness", value: data.dizziness.toString() },
      { name: "loss_of_appetite", value: data.loss_of_appetite.toString() },
      { name: "weakness", value: data.weakness.toString() },
      { name: "eye_pain", value: data.eye_pain.toString() },
      { name: "chills", value: data.chills.toString() },
      { name: "hemoptysis", value: data.hemoptysis.toString() },
      { name: "edema", value: data.edema.toString() },
      { name: "bruises", value: data.bruises.toString() },
      { name: "petechiae", value: data.petechiae.toString() },
      { name: "itching", value: data.itching.toString() },
      { name: "body_temperature", value: data.body_temperature },
      { name: "platelets", value: data.platelets },
      { name: "white_blood_cells", value: data.white_blood_cells },
      { name: "hemoglobin", value: data.hemoglobin },
      { name: "hematocrit", value: data.hematocrit },
      { name: "red_blood_cells", value: data.red_blood_cells },
      { name: "neutrophils", value: data.neutrophils },
      { name: "lymphocytes", value: data.lymphocytes },
      { name: "eosinophils", value: data.eosinophils },
      { name: "basophils", value: data.basophils },
      { name: "monocytes", value: data.monocytes },
      { name: "creatinine", value: data.creatinine },
      { name: "urea", value: data.urea },
      { name: "total_bilirubin", value: data.total_bilirubin },
      { name: "direct_bilirubin", value: data.direct_bilirubin },
      { name: "indirect_bilirubin", value: data.indirect_bilirubin },
      { name: "AST", value: data.AST },
      { name: "ALT", value: data.ALT },
      { name: "ALP", value: data.ALP },
      { name: "albumin", value: data.albumin },
      { name: "total_proteins", value: data.total_proteins },
    ]

    return features
  }

  // Manejar predicción
  const handlePredict = async () => {
    if (!isModelTrained) {
      toast({
        title: "Modelo no entrenado",
        description: "Primero debes entrenar el modelo con el dataset",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      toast({
        title: "Formulario incompleto",
        description: "Por favor, completa todos los campos requeridos y corrige los errores",
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

    // Convertir datos del formulario a features
    const features = convertFormDataToFeatures(formData)

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

  // Calcular suma de diferenciales para advertencia
  const differentialSum =
    parseFloat(formData.neutrophils || "0") +
    parseFloat(formData.lymphocytes || "0") +
    parseFloat(formData.eosinophils || "0") +
    parseFloat(formData.basophils || "0") +
    parseFloat(formData.monocytes || "0")

  const showDifferentialWarning = differentialSum > 100

  return (
    <div className="space-y-4">
      {/* Información Básica */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <User className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Información Básica</h3>
        </div>
        <Separator className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Edad */}
          <div className="space-y-1.5">
            <Label htmlFor="age" className="text-xs text-muted-foreground">
              Edad <span className="text-muted-foreground/70 font-normal">(Rango: {VALIDATION_RULES.age.rangeText})</span>
            </Label>
            <Input
              id="age"
              type="number"
              min="0"
              max="110"
              step="1"
              placeholder={VALIDATION_RULES.age.rangeText}
              value={formData.age}
              onChange={(e) => updateNumericField("age", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault()
                }
              }}
              className={errors.age ? "border-destructive" : ""}
              aria-invalid={!!errors.age}
            />
            {errors.age && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.age}
              </p>
            )}
          </div>

          {/* Género */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Género
            </Label>
            <ToggleGroup
              type="single"
              value={formData.male === 1 ? "male" : formData.female === 1 ? "female" : ""}
              onValueChange={(value) => {
                if (value) updateGender(value as "male" | "female")
              }}
              variant="outline"
              className="w-full"
            >
              <ToggleGroupItem value="male" aria-label="Masculino" className="flex-1">
                Masculino
              </ToggleGroupItem>
              <ToggleGroupItem value="female" aria-label="Femenino" className="flex-1">
                Femenino
              </ToggleGroupItem>
            </ToggleGroup>
            {errors.gender && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.gender}
              </p>
            )}
          </div>

          {/* Procedencia */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Procedencia
            </Label>
            <ToggleGroup
              type="single"
              value={formData.urban_origin === 1 ? "urban" : formData.rural_origin === 1 ? "rural" : ""}
              onValueChange={(value) => {
                if (value) updateOrigin(value as "urban" | "rural")
              }}
              variant="outline"
              className="w-full"
            >
              <ToggleGroupItem value="urban" aria-label="Urbana" className="flex-1">
                Urbana
              </ToggleGroupItem>
              <ToggleGroupItem value="rural" aria-label="Rural" className="flex-1">
                Rural
              </ToggleGroupItem>
            </ToggleGroup>
            {errors.origin && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.origin}
              </p>
            )}
          </div>

          {/* Ocupación */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Ocupación
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "homemaker", label: "Ama de casa" },
                { value: "student", label: "Estudiante" },
                { value: "professional", label: "Profesional" },
                { value: "merchant", label: "Comerciante" },
                { value: "agriculture_livestock", label: "Agricultura/Ganadería" },
                { value: "various_jobs", label: "Oficios varios" },
                { value: "unemployed", label: "Desempleado", colSpan: 2 },
              ].map((occupation) => (
                <Toggle
                  key={occupation.value}
                  pressed={formData.occupation === occupation.value}
                  onPressedChange={(pressed) => {
                    // Si se presiona este toggle, seleccionarlo y deseleccionar otros
                    // Si se despresiona, solo limpiar si este estaba seleccionado
                    if (pressed) {
                      setFormData({ ...formData, occupation: occupation.value })
                      if (errors.occupation) {
                        const newErrors = { ...errors }
                        delete newErrors.occupation
                        setErrors(newErrors)
                      }
                    } else if (formData.occupation === occupation.value) {
                      // Solo limpiar si este toggle estaba seleccionado
                      setFormData({ ...formData, occupation: "" })
                    }
                  }}
                  variant="outline"
                  aria-label={occupation.label}
                  className={`text-xs h-9 whitespace-normal ${occupation.colSpan === 2 ? "col-span-2" : ""}`}
                >
                  {occupation.label}
                </Toggle>
              ))}
            </div>
            {errors.occupation && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.occupation}
              </p>
            )}
          </div>

          {/* Días de Hospitalización */}
          <div className="space-y-1.5">
            <Label htmlFor="hospitalization_days" className="text-xs text-muted-foreground">
              Días de Hospitalización{" "}
              <span className="text-muted-foreground/70 font-normal">
                (Rango: {VALIDATION_RULES.hospitalization_days.rangeText})
              </span>
            </Label>
            <Input
              id="hospitalization_days"
              type="number"
              min="0"
              max="120"
              step="1"
              placeholder={VALIDATION_RULES.hospitalization_days.rangeText}
              value={formData.hospitalization_days}
              onChange={(e) => updateNumericField("hospitalization_days", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault()
                }
              }}
              className={errors.hospitalization_days ? "border-destructive" : ""}
              aria-invalid={!!errors.hospitalization_days}
            />
            {errors.hospitalization_days && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.hospitalization_days}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Signos Vitales */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Thermometer className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Signos Vitales</h3>
        </div>
        <Separator className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Temperatura Corporal */}
          <div className="space-y-1.5">
            <Label htmlFor="body_temperature" className="text-xs text-muted-foreground">
              Temperatura Corporal{" "}
              <span className="text-muted-foreground/70 font-normal">
                (Rango: {VALIDATION_RULES.body_temperature.rangeText})
              </span>
            </Label>
            <Input
              id="body_temperature"
              type="number"
              min="30"
              max="45"
              step="0.1"
              placeholder={VALIDATION_RULES.body_temperature.rangeText}
              value={formData.body_temperature}
              onChange={(e) => updateNumericField("body_temperature", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                  e.preventDefault()
                }
              }}
              className={errors.body_temperature ? "border-destructive" : ""}
              aria-invalid={!!errors.body_temperature}
            />
            {errors.body_temperature && (
              <p className="text-xs text-destructive flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.body_temperature}
              </p>
            )}
          </div>
        </div>
      </Card>

      {/* Síntomas */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Síntomas</h3>
        </div>
        <Separator className="mb-4" />

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {[
            { key: "fever", label: "Fiebre" },
            { key: "headache", label: "Dolor de cabeza" },
            { key: "vomiting", label: "Vómitos" },
            { key: "abdominal_pain", label: "Dolor abdominal" },
            { key: "diarrhea", label: "Diarrea" },
            { key: "myalgias", label: "Mialgias" },
            { key: "arthralgias", label: "Artralgias" },
            { key: "rash", label: "Erupción cutánea" },
            { key: "jaundice", label: "Ictericia" },
            { key: "hemorrhages", label: "Hemorragias" },
            { key: "respiratory_difficulty", label: "Dificultad respiratoria" },
            { key: "dizziness", label: "Mareo" },
            { key: "loss_of_appetite", label: "Pérdida de apetito" },
            { key: "weakness", label: "Debilidad" },
            { key: "eye_pain", label: "Dolor ocular" },
            { key: "chills", label: "Escalofríos" },
            { key: "hemoptysis", label: "Hemoptisis" },
            { key: "edema", label: "Edema" },
            { key: "bruises", label: "Moretones" },
            { key: "petechiae", label: "Petequias" },
            { key: "itching", label: "Prurito/Picazón" },
          ].map((symptom) => (
            <Toggle
              key={symptom.key}
              pressed={formData[symptom.key as keyof PredictionFormData] === 1}
              onPressedChange={(pressed) => {
                updateBinaryField(symptom.key as keyof PredictionFormData, pressed ? 1 : 0)
              }}
              variant="outline"
              aria-label={symptom.label}
              className="text-xs h-auto min-h-[2.25rem] py-2 px-3 whitespace-normal text-center justify-center hover:bg-accent/50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground transition-colors"
            >
              {symptom.label}
            </Toggle>
          ))}
        </div>
      </Card>

      {/* Hemograma */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Droplet className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Hemograma</h3>
        </div>
        {showDifferentialWarning && (
          <div className="mb-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Advertencia: La suma de diferenciales (Neutrófilos + Linfocitos + Eosinófilos + Basófilos + Monocitos) es{" "}
              {differentialSum.toFixed(1)}%, excede el 100%.
            </p>
          </div>
        )}
        <Separator className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { field: "platelets", label: "Plaquetas" },
            { field: "white_blood_cells", label: "Leucocitos" },
            { field: "hemoglobin", label: "Hemoglobina" },
            { field: "hematocrit", label: "Hematocrito" },
            { field: "red_blood_cells", label: "Glóbulos rojos" },
            { field: "neutrophils", label: "Neutrófilos" },
            { field: "lymphocytes", label: "Linfocitos" },
            { field: "eosinophils", label: "Eosinófilos" },
            { field: "basophils", label: "Basófilos" },
            { field: "monocytes", label: "Monocitos" },
          ].map((item) => {
            const rule = VALIDATION_RULES[item.field as keyof typeof VALIDATION_RULES]
            return (
              <div key={item.field} className="space-y-1.5">
                <Label htmlFor={item.field} className="text-xs text-muted-foreground">
                  {item.label}{" "}
                  <span className="text-muted-foreground/70 font-normal">(Rango: {rule.rangeText})</span>
                </Label>
                <Input
                  id={item.field}
                  type="number"
                  min={rule.min}
                  max={rule.max}
                  step={rule.type === "integer" ? "1" : "0.01"}
                  placeholder={rule.rangeText}
                  value={formData[item.field as keyof PredictionFormData] as string}
                  onChange={(e) => updateNumericField(item.field as keyof PredictionFormData, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                      e.preventDefault()
                    }
                  }}
                  className={errors[item.field] ? "border-destructive" : ""}
                  aria-invalid={!!errors[item.field]}
                />
                {errors[item.field] && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors[item.field]}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Bioquímica */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="w-4 h-4 text-accent" />
          <h3 className="text-sm font-semibold text-foreground">Bioquímica</h3>
        </div>
        <Separator className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { field: "creatinine", label: "Creatinina" },
            { field: "urea", label: "Urea" },
            { field: "total_bilirubin", label: "Bilirrubina Total" },
            { field: "direct_bilirubin", label: "Bilirrubina Directa" },
            { field: "indirect_bilirubin", label: "Bilirrubina Indirecta" },
            { field: "AST", label: "AST (SGOT)" },
            { field: "ALT", label: "ALT (SGPT)" },
            { field: "ALP", label: "Fosfatasa Alcalina (ALP)" },
            { field: "albumin", label: "Albúmina" },
            { field: "total_proteins", label: "Proteínas Totales" },
          ].map((item) => {
            const rule = VALIDATION_RULES[item.field as keyof typeof VALIDATION_RULES]
            return (
              <div key={item.field} className="space-y-1.5">
                <Label htmlFor={item.field} className="text-xs text-muted-foreground">
                  {item.label}{" "}
                  <span className="text-muted-foreground/70 font-normal">(Rango: {rule.rangeText})</span>
                </Label>
                <Input
                  id={item.field}
                  type="number"
                  min={rule.min}
                  max={rule.max}
                  step={rule.type === "integer" ? "1" : "0.01"}
                  placeholder={rule.rangeText}
                  value={formData[item.field as keyof PredictionFormData] as string}
                  onChange={(e) => updateNumericField(item.field as keyof PredictionFormData, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e" || e.key === "E" || e.key === "+") {
                      e.preventDefault()
                    }
                  }}
                  className={errors[item.field] ? "border-destructive" : ""}
                  aria-invalid={!!errors[item.field]}
                />
                {errors[item.field] && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors[item.field]}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Botón de predicción */}
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

      {/* Resultado de la predicción */}
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
