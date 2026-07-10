"use client";

import SectionHeader from "../ui/SectionHeader";
import ProjectCard, { ProjectCardProps } from "../ui/ProjectCard";

const missions: ProjectCardProps[] = [
  {
    number: "01",
    title: "Multimodal Alzheimer's Detection System",
    stack: ["Python", "PyTorch", "OpenCV", "scikit-learn"],
    typeBadge: "Deep Learning · Computer Vision · Healthcare AI",
    accent: "cyan",
    blocks: [
      {
        heading: "The Problem",
        body: "Alzheimer's diagnosis relies on neurologists manually interpreting MRI scans and clinical assessments in isolation. By the time patterns become obvious to human review, intervention windows have often narrowed significantly.",
      },
      {
        heading: "The Approach",
        body: "A multimodal fusion architecture that processes MRI neuroimaging data and clinical tabular features simultaneously — neither alone, both together.",
      },
      {
        heading: "The Architecture",
        bullets: [
          "CNN Branch: Extracts spatial feature maps from MRI neuroimages",
          "MLP Branch: Processes clinical biomarkers and patient history data",
          "Decision-Level Fusion: Both branches contribute to final classification",
          "Output: Probability scores across AD progression (Normal → MCI → AD)",
        ],
      },
    ],
  },
  {
    number: "02",
    title: "Galaxy Morphology Classification",
    stack: ["Python", "TensorFlow", "Keras", "NumPy"],
    typeBadge: "Transfer Learning · Astronomical Data · Computer Vision",
    accent: "violet",
    blocks: [
      {
        heading: "The Problem",
        body: "Modern astronomical surveys generate millions of galaxy images that require morphological classification. Manual annotation by astronomers doesn't scale to the volume modern telescopes produce.",
      },
      {
        heading: "The Approach",
        body: "Transfer learning on ResNet — pre-trained ImageNet weights adapted to astronomical imagery, with a custom data augmentation pipeline to handle significant class imbalance across galaxy types.",
      },
      {
        heading: "The Architecture",
        bullets: [
          "Base: ResNet with frozen early layers, fine-tuned deeper layers",
          "Augmentation: Rotation, flip, brightness variation for minority classes",
          "Output: Multi-class prediction — Spiral · Elliptical · Irregular",
          "Validation: Cross-class accuracy on imbalanced astronomical distributions",
        ],
      },
    ],
  },
  {
    number: "03",
    title: "Krishi Mitra — Smart Farming Assistant",
    stack: ["Python", "scikit-learn", "Pandas", "Flask"],
    typeBadge: "Ensemble ML · AgriTech · Predictive Analytics",
    accent: "cyan",
    blocks: [
      {
        heading: "The Problem",
        body: "Most Indian small-scale farmers make planting, soil management, and harvest decisions based on intuition and tradition. Precision agriculture intelligence exists — it's just inaccessible at their scale.",
      },
      {
        heading: "The Approach",
        body: "An ensemble ML pipeline trained on combined soil chemistry, climate data, and historical yield records that converts raw field data into actionable farming decisions.",
      },
      {
        heading: "The Models",
        bullets: [
          "Crop Recommendation: Random Forest on soil NPK + pH + climate features",
          "Yield Prediction: XGBoost on multi-year agricultural and weather data",
          "Soil Analysis: Multi-class classification on soil composition profiles",
          "API Layer: Flask backend exposing predictions as clean REST endpoints",
        ],
      },
    ],
  },
];

export default function Missions() {
  return (
    <section id="missions" className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-28">
      <SectionHeader eyebrow="Missions" title="Problems I've solved." />

      <div className="mt-12 space-y-8">
        {missions.map((m) => (
          <ProjectCard key={m.number} {...m} />
        ))}
      </div>
    </section>
  );
}
