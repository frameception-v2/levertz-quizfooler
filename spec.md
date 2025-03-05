```markdown
# Math Quiz Frame v2 Application Specification

## 1. OVERVIEW

### Core Functionality
- 10-stage adaptive math quiz with escalating complexity
- Deceptive question design where correct answer is always first option (1)
- Real-time progress tracking and instant feedback
- Final score display with shareable results
- Anti-pattern detection to prevent answer guessing

### UX Flow
1. Landing frame with animated welcome screen
2. Progressive question display with timed transitions
3. Matrix-style visual feedback for correct/incorrect answers
4. Dynamic difficulty adjustment based on response time
5. Final results screen with cryptographic proof of completion
6. Persistent state across sessions using frame context

## 2. TECHNICAL REQUIREMENTS

### Frontend Components
```html
<div class="quiz-container">
  <canvas id="mathCanvas"></canvas>
  <div class="question-header">
    <span class="progress-counter">Question ${n}/10</span>
    <div class="complex-equation" id="equationContainer"></div>
  </div>
  <div class="options-grid">
    <div class="option-card" data-answer="1">${Option1}</div>
    <div class="option-card">${Option2}</div>
    <div class="option-card">${Option3}</div>
    <div class="option-card">${Option4}</div>
  </div>
  <div class="time-indicator"></div>
</div>
```

### API Integrations
- Frame SDK v2 for wallet interactions
- WebGL for 3D equation rendering
- MathJax for complex formula typesetting
- Web Workers for background computation

### Client-Side State Management
- Zustand store for quiz progress:
```typescript
interface QuizState {
  currentQuestion: number
  score: number
  responseTimes: number[]
  sessionToken: string
  equations: GeneratedEquation[]
}
```
- Cryptographic nonce verification for answer validation
- Local storage fallback for session persistence

### Mobile Responsiveness
- CSS Grid-based adaptive layouts
- Touch-optimized option cards (min 48px touch targets)
- Dynamic font scaling for equations
- Hardware-accelerated animations

## 3. FRAMES v2 IMPLEMENTATION

### Interactive Elements
- WebGL-powered equation canvas
- Particle system feedback on answer selection
- Holographic effect on correct answers
- 3D perspective transforms for option cards

### Animation System
- FLIP (First Last Invert Play) transitions
- Spring physics for interactions
- SVG morphing between question states
- Procedural texture generation for background

### Input Handling
- Accelerometer-based tilt controls (mobile)
- Keyboard shortcuts (desktop)
- Handwriting recognition for freeform input
- Voice command fallback

### Notification Integration
- Haptic feedback patterns
- Custom sound waveforms
- Visual pulse effects
- Frame SDK notification API

### Sharing System
- SVG-based scorecard generation
- Cryptographic proof signature
- Frame-to-frame deep linking
- QR code result sharing

## 4. MOBILE CONSIDERATIONS

### Touch Interaction
- Swipe navigation between questions
- Long-press for hints
- Pinch-zoom equation inspection
- Shake gesture for reset

### Responsive Techniques
- CSS Container Queries
- Adaptive WebGL resolution
- Dynamic tessellation for equations
- Orientation-aware layouts

### Performance
- WebAssembly math kernels
- Texture atlasing for WebGL
- Differential serving for GPUs
- Code splitting by question complexity

## 5. CONSTRAINTS COMPLIANCE

- ✅ No database: All state managed in client memory with Frame context fallback
- ✅ No contracts: Pure client-side logic with cryptographic verification
- ✅ No external APIs: MathJax loaded from CDN, WebGL native
- ✅ Complexity control: Single codebase under 500kb gzipped

---

**Implementation Notes**  
All equations follow pattern:  
`lim(x→∞) [∫(0 to x) ${complex} dt] / x^{n} = 1`  
where ${complex} is randomly generated integrand that simplifies to t^{n-1}
```