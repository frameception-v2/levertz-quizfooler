Here's the optimized prompt sequence for incremental implementation:

```markdown
# Phase 1: Core Infrastructure Setup

## Prompt 1: Initialize Base Project
```text
Create a Next.js 14+ TypeScript project with:
- Zustand store configured with initial quiz state
- Frame SDK v2 basic integration
- Responsive layout template matching the HTML structure
- Basic CSS Grid setup for options
- Mobile-first viewport configuration
- Session token generation using crypto.subtle
```

## Prompt 2: State Management System
```text
Implement Zustand store with:
- Typescript interface for QuizState
- Actions: initializeSession, updateScore, recordResponseTime
- Cryptographic nonce generation/verification
- Local storage synchronization
- Anti-pattern detection (rapid answer prevention)
```

## Prompt 3: Question Generation Core
```text
Create equation generator utilities:
- Function generating lim/integral equations per spec
- Difficulty progression algorithm (n increases with stage)
- Answer randomization (always position 1 correct)
- Web Worker for background computation
- Caching system for generated questions
```

# Phase 2: Core Quiz Components

## Prompt 4: Canvas Rendering Setup
```text
Implement WebGL canvas component:
- Three.js scene with basic particle system
- Shader setup for holographic effects
- Responsive resize handler
- Texture atlas loading
- Coordinate system matching CSS layout
```

## Prompt 5: Question Display System
```text
Build equation rendering component:
- MathJax integration with CDN loading
- Animated SVG container for equations
- Dynamic font scaling based on equation complexity
- FLIP transition between questions
- WebGL equation projection system
```

## Prompt 6: Answer Handling
```text
Create interactive option cards:
- Click/touch handlers with haptic feedback
- Answer validation against store's nonce
- Matrix-style CSS animation system
- Response time tracking
- Difficulty adjustment logic
```

# Phase 3: User Feedback Systems

## Prompt 7: Progress Visualization
```text
Implement progress indicators:
- Animated time indicator bar
- Progress counter component
- Particle emitter for correct answers
- Cryptographic proof badge
- Session resume functionality
```

## Prompt 8: Animation Framework
```text
Create animation utilities:
- Spring physics library
- SVG morphing transitions
- WebGL/texture coordinate system
- FLIP animation controller
- Hardware-accelerated option card transforms
```

# Phase 4: Mobile Optimization

## Prompt 9: Touch Interaction Layer
```text
Implement mobile handlers:
- Swipe detection with velocity tracking
- Pinch-zoom equation inspection
- 48px+ touch targets
- Accelerometer tilt effect
- Vibration API integration
```

## Prompt 10: Final Integration
```text
Wire all components together:
- State-driven render pipeline
- Animation/WebGL synchronization
- Mobile/desktop conditional logic
- Score sharing system
- Final cryptographic proof generation
```

---

**Implementation Flow Rationale**  
1. **Foundation First**: State and rendering core before UI  
2. **Vertical Slices**: Complete functional chains (question → answer → feedback)  
3. **Progressive Enhancement**: Basic interaction before complex animations  
4. **Mobile DNA**: Touch targets and responsive layout from start  
5. **Constraint Adherence**: Client-side focus, no external deps beyond spec  

**Critical Path**  
State Store → Question Gen → Canvas → Answer Handling → Animation → Mobile → Sharing  

**Risk Mitigation**  
- WebGL fallback to SVG  
- MathJax loading states  
- Frame session recovery  
- Performance budgets per component  
```