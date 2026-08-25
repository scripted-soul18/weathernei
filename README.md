# TERRA-GUARD: Weather Forecast & Landslide Risk Prediction Platform

A full-stack, production-grade meteorological forecasting and geotechnical landslide risk assessment platform powered by machine learning, multi-factor environmental modeling, and Explainable AI (SHAP).

![Platform Architecture](https://img.shields.io/badge/Architecture-Fullstack_FastAPI_+_React_Vite-06b6d4)
![ML Model](https://img.shields.io/badge/ML-Gradient_Boosting_+_Random_Forest-8b5cf6)
![Explainability](https://img.shields.io/badge/Explainable_AI-SHAP_TreeExplainer-10b981)

---

## 🌟 Key Features

1. **Interactive Windy-Style GIS Map**:
   - Leaflet-powered global interactive map with Dark, Satellite, and OpenStreetMap basemaps.
   - Click-anywhere risk prediction and live coordinates pinpointing.
   - Spatial risk heatmap overlay (Micro-grid showing Low = Green, Moderate = Yellow, High = Orange, Very High = Red).

2. **Multi-Factor Machine Learning Landslide Model**:
   - Geotechnically grounded multi-factor model evaluated across **Random Forest, Gradient Boosting, Extra Trees, and Neural Networks**.
   - Optimized for **High Recall** and **ROC-AUC (0.934)** to prevent catastrophic false negatives.
   - Features: Cumulative rainfall (1h, 3h, 6h, 12h, 24h, 3d, 7d), max intensity, antecedent precipitation index (ARI), terrain slope, elevation, aspect, curvature, soil moisture, vegetation density (NDVI), land cover, and lithology.

3. **Explainable AI (SHAP)**:
   - Visual feature contribution breakdown (*"Why is the risk high?"*).
   - Human-readable risk factor checklist (*"Heavy accumulated rainfall (85.0 mm)", "Steep terrain slope (34.5°)", "Critical soil saturation (72%)"*).

4. **Prediction Timeline Forecast (+72 Hours)**:
   - Trajectory forecast across Now, +1h, +3h, +6h, +12h, +24h, +48h, and +72h based on simulated cumulative precipitation and subsurface soil saturation.

5. **Meteorological Forecasting Charts (Recharts)**:
   - Hourly precipitation bar charts, temperature & humidity area charts, wind speed/direction, and 7-day outlook.

6. **Hazard Alerting & Database Logging**:
   - Prominent alert banners for High/Very High hazard conditions with official disaster management disclaimers.
   - Bookmarked saved locations and searchable historical prediction logs stored via SQLite / PostgreSQL.

7. **What-If Scenario Simulation**:
   - Dynamic real-time parameter tweaking in the UI to simulate heavy downpours or steep slopes.

---

## 🏗️ Project Structure

```
weatherprediction/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI entrypoint, middleware, routes
│   │   ├── config.py             # Settings, environment variables, CORS
│   │   ├── models/
│   │   │   ├── schemas.py        # Pydantic request/response schemas
│   │   │   └── db_models.py      # SQLAlchemy database models
│   │   ├── services/
│   │   │   ├── weather_service.py # Open-Meteo & custom weather API client
│   │   │   ├── terrain_service.py # DEM elevation sampling, slope, aspect, curvature
│   │   │   ├── ml_service.py      # ML inference & SHAP integration
│   │   │   ├── risk_map_service.py# Spatial risk heatmap grid generator
│   │   │   ├── timeline_service.py# 72-hour risk trajectory forecaster
│   │   │   └── db_service.py      # Async SQLite / PostgreSQL manager
│   │   └── routes/
│   │       ├── weather.py
│   │       ├── location.py
│   │       ├── prediction.py
│   │       └── history.py
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── LocationSearchBar.tsx
│   │   │   ├── TopStatsBar.tsx
│   │   │   ├── WeatherCard.tsx
│   │   │   ├── LandslideRiskCard.tsx
│   │   │   ├── AlertBanner.tsx
│   │   │   ├── RiskTimeline.tsx
│   │   │   ├── WeatherCharts.tsx
│   │   │   ├── ModelMetricsModal.tsx
│   │   │   └── SavedLocationsDrawer.tsx
│   │   ├── map/
│   │   │   ├── InteractiveMap.tsx
│   │   │   └── MapLegend.tsx
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.ts
│
├── ml/
│   ├── data/                     # Historical & benchmark training datasets
│   ├── preprocessing.py          # Data cleaning, scaling, stratified splits
│   ├── feature_engineering.py    # Multi-factor feature engineering formulas
│   ├── train.py                  # Model training, cross-validation, selection
│   ├── evaluate.py               # Evaluation reports & ROC curves
│   ├── predict.py                # Standalone inference & SHAP engine
│   ├── model.pkl                 # Winning trained model binary
│   ├── scaler.pkl                # Fitted StandardScaler
│   ├── metadata.json             # Model metrics & feature importances
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+ & npm**

### ⚡ Unified Single-URL Launch (Combined Mode)
Run both the React frontend and FastAPI backend together on a single URL:
```bash
# Option A: Run via Python runner
python run.py

# Option B: Run via Windows batch script
start.bat
```
- 🌐 **Combined Web App & API:** [http://localhost:8000](http://localhost:8000)
- 📚 **Interactive Swagger API Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 🛠️ Development Mode (Separate Hot-Reload Servers)
If you want to run frontend and backend with separate hot-reloading dev servers:

```bash
# Run both concurrently in one terminal:
python run.py --dev

# OR run separately:
# 1. Backend:
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 2. Frontend:
cd frontend
npm run dev
```
- Frontend Dev: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://127.0.0.1:8000](http://127.0.0.1:8000)


---

## 📊 Machine Learning Model Validation

| Model Architecture | Accuracy | Precision | Recall (Safety) | F1-Score | ROC-AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gradient Boosting (Winning)** | **87.9%** | **86.2%** | **76.1%** | **0.808** | **0.934** |
| Random Forest (Baseline) | 88.2% | 87.6% | 75.6% | 0.811 | 0.933 |
| Extra Trees | 87.8% | 86.5% | 75.1% | 0.804 | 0.934 |
| Neural Network (MLP) | 86.1% | 81.6% | 75.3% | 0.783 | 0.895 |

---

## 🛡️ Scientific & Safety Disclaimer
Landslide predictions generated by this platform are AI-based risk estimates determined from topographical slopes and meteorological precipitation models. Actual slope failure depends on localized geotechnical shear planes, underground drainage, and human engineering factors. **Always follow official emergency warnings issued by local civil protection and disaster management authorities.**
