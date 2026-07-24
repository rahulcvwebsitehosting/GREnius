# 🧠 GREnius: The Cognitive Blueprint

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Express](https://img.shields.io/badge/Express-5.0-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

> **A premium, high-performance cognitive training platform engineered for GRE aspirants and chess enthusiasts. Built with a focus on algorithmic precision and architectural elegance.**

---

## 🏗️ Problem vs. Solution

| The Problem | The GREnius Solution |
| :--- | :--- |
| **Cognitive Fatigue** | Dynamic, game-based learning modules that maintain high engagement through gamification. |
| **Static Learning** | Algorithmic difficulty scaling that adapts to the user's performance in real-time. |
| **Fragmented Prep** | A unified ecosystem combining GRE Quantitative practice with advanced strategic training (Chess). |
| **Lack of Assessment** | Deep-dive post-game analysis and ELO-based performance tracking. |

---

## 🧠 Intelligence & Architecture

GREnius is built on a **Full-Stack Blueprint** utilizing a custom Express server with Vite middleware integration for seamless development and production-grade performance.

### ♟️ Chess Engine: "The Grandmaster Algorithm"
The core engine utilizes a **Negamax search with Alpha-Beta pruning** and **Quiescence Search** to eliminate the horizon effect.

```mermaid
graph TD
    A[User Move] --> B{AI Thinking}
    B --> C[Opening Book Lookup]
    C -- Match Found --> D[Instant Theory Move]
    C -- No Match --> E[Negamax Search]
    E --> F[Alpha-Beta Pruning]
    F --> G[Quiescence Search]
    G --> H[Static Evaluation + PST]
    H --> I[Optimal Move Selection]
    I --> J[ELO Assessment]
```

### 📊 System Flow

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend (React)
    participant B as Backend (Express)
    participant E as Engine (Negamax)
    
    U->>F: Performs Action (Game/Quant)
    F->>F: Update Local State (XP/Stats)
    F->>B: Sync Progress (Optional)
    F->>E: Request AI Move (Chess)
    E-->>F: Return Optimized Move
    F-->>U: Render UI Update + Feedback
```

---

## 🚀 Primary Features

### 1. **Advanced Chess Suite**
- **Difficulty Scaling**: Three distinct tiers (600, 1200, 1800+ ELO).
- **Opening Book**: Integrated theory for Sicilian, Ruy Lopez, and Queen's Gambit.
- **Post-Game Analysis**: Interactive accuracy summary with "Show me how" correction logic.

### 2. **GRE Quantitative Mastery**
- **250+ High-Difficulty Questions**: Covering Geometry, Algebra, and Data Interpretation.
- **Question Types**: Quantitative Comparison (QC), Multiple Choice (MC), and Numeric Entry (NE).

### 3. **Cognitive Game Modules**
- **Mental Math**: Stress-based arithmetic challenges.
- **Memory Palace**: Grid-based visual pattern recognition.
- **Speed Blitz**: Rapid-fire vocabulary and logic puzzles.

---

## 🛠️ Setup & Installation

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation

1. **Clone the Blueprint**
   ```bash
   git clone https://github.com/rahulcvwebsitehosting/grenius.git
   cd grenius
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Launch Development Environment**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🎨 UI Layout Blueprint

| Component | Description | Visual Mood |
| :--- | :--- | :--- |
| **Dashboard** | Central hub for all cognitive modules and XP tracking. | Minimalist, High-Contrast |
| **Chess Arena** | Professional-grade board with material advantage indicators. | Classic, Strategic |
| **Quant Lab** | Focused environment for GRE question sets. | Academic, Clean |
| **Analysis Modal** | Deep-dive metrics and Mermaid-style performance charts. | Data-Driven, Dark Mode |

---

## 🤝 Connect

Developed with ❤️ by **Rahul Shyam**. Let's build the future of cognitive technology together.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/rahulshyamcivil)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rahulcvwebsitehosting)

---

<p align="center">
  <i>"Precision in every move, intelligence in every line."</i><br>
  © 2026 GREnius Cognitive Systems. All rights reserved.
</p>
