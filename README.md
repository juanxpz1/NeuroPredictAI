## 🧠 NeuroPredictAI
Diagnóstico Inteligente con Aprendizaje Automático
NeuroPredictAI es una plataforma web interactiva que integra Next.js con Python para realizar diagnósticos diferenciales de enfermedades tropicales como Dengue, Malaria y Leptospirosis, utilizando modelos de Machine Learning entrenados con datos clínicos y de laboratorio.

---

## 🚀 Características principales
- 🔹 Entrenamiento de modelos de IA directamente desde la interfaz web.
- 📊 Diagnóstico individual y por lotes con reportes detallados.
- 📈 Cálculo automático de métricas de rendimiento (Accuracy, F1-Score, etc.).
- 🧩 Interfaz moderna y adaptable con TailwindCSS.
- 🔄 Integración fluida entre Next.js (Frontend) y Python (Backend).
- 📁 Soporte para datasets en formato .csv y .xlsx.

---

## 🧬 Dataset utilizado
Título: A dataset on dengue, malaria and leptospirosis from an endemic region in Colombia
- 📊 [Ver en Figshare](https://figshare.com/articles/dataset/A_dataset_on_dengue_malaria_and_leptospirosis_from_an_endemic_region_in_Colombia/29538161/1)
- Descripción:
- Contiene información clínica, sociodemográfica y de laboratorio de pacientes, con el objetivo de facilitar la identificación entre Dengue, Malaria y Leptospirosis.

---

## 🧩 Arquitectura del proyecto
```bash
NeuroPredictAI/
│
├── app/
│   ├── api/
│   │   ├── train/ → Entrena el modelo (train_model.py)
│   │   └── predict/ → Realiza predicciones (predict_model.py)
│   ├── components/
│   │   ├── training-panel.tsx
│   │   ├── prediction-panel.tsx
│   │   └── batch-prediction-panel.tsx
│   └── page.tsx / layout.tsx
│
├── scripts/
│   ├── train_model.py → Entrena el modelo de Machine Learning
│   ├── predict_model.py → Realiza predicciones individuales
│   └── model.pkl → Archivo del modelo entrenado
│
├── public/ → Recursos estáticos
├── package.json
├── next.config.js
└── README.md
```

---

## ⚙️ Configuración del entorno
- 🔧 Requisitos previos
- Node.js 18+
- Python 3.10+
- pip instalado

📦 Instalación
 Clona el repositorio:
 
 # git clone https://github.com/juanxpz1/NeuroPredictAI.git
  - cd NeuroPredictAI

 # Instala las dependencias del frontend:
  - npm install --legacy-peer-deps
  
 # Instala las dependencias de Python:
  - pip install pandas numpy scikit-learn joblib openpyxl
  
# Inicia el servidor:
  - npm run dev

---

## 👥 Autores
Desarrollado por:
- Juan Argüelles (@juanxpz1)
- Juan Luis de la Espriella. (@juanluis-xo)
- Inspirado en la unión entre la medicina, la inteligencia artificial y la innovación educativa.

## 📜 Licencia
Proyecto distribuido bajo la Licencia MIT.
Libre para uso académico, educativo y de investigación.

“La inteligencia artificial no reemplaza al médico,
pero potencia su capacidad de diagnóstico.”
— Equipo NeuroPredictAI





