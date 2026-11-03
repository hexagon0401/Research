/** Editorial placement only. Text is resolved from the preserved reading editions. */
export const readingGuide = [
  {
    report: "S06",
    anchor: "S06-R006-P002",
    scene: "survival",
    sentences: [4, 6],
  },
  {
    report: "S16",
    anchor: "S16-R002-P003",
    scene: "korea-chips",
    sentences: [0, 2],
    caution: 5,
  },
  {
    report: "S17",
    anchor: "S17-R003-P001",
    scene: "spatial-method",
    sentences: [0, 3],
  },
] as const;
export const methodSources = [
  {
    report: "S17",
    anchor: "S17-R003-P003",
    label: {
      ko: "VAR(2) · VARX(2) · IRF · FEVD",
      en: "VAR(2) · VARX(2) · IRF · FEVD",
    },
  },
  {
    report: "S08",
    anchor: "S08-R003-P003",
    label: {
      ko: "스케일 전환 · 공간 데이터 비교",
      en: "Scale comparison · spatial data",
    },
  },
  {
    report: "S06",
    anchor: "S06-R001-P004",
    label: {
      ko: "Spearman · SHAP · 반사실 분석",
      en: "Spearman · SHAP · counterfactual analysis",
    },
  },
  {
    report: "S17",
    anchor: "S17-R003-P001",
    label: { ko: "PCA · K-means · DVI", en: "PCA · k-means · DVI" },
  },
] as const;
