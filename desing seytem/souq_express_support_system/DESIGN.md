---
name: Souq Express Support System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d9d9df'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f9'
  surface-container: '#ededf3'
  surface-container-high: '#e8e8ed'
  surface-container-highest: '#e2e2e8'
  on-surface: '#1a1c20'
  on-surface-variant: '#424750'
  inverse-surface: '#2e3035'
  inverse-on-surface: '#f0f0f6'
  outline: '#737781'
  outline-variant: '#c2c6d1'
  surface-tint: '#2f5f9c'
  primary: '#00386c'
  on-primary: '#ffffff'
  primary-container: '#1a4f8b'
  on-primary-container: '#9bc2ff'
  inverse-primary: '#a6c8ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#582c00'
  on-tertiary: '#ffffff'
  tertiary-container: '#793f00'
  on-tertiary-container: '#ffae6b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e3ff'
  primary-fixed-dim: '#a6c8ff'
  on-primary-fixed: '#001c3b'
  on-primary-fixed-variant: '#0c4783'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77e'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f9f9ff'
  on-background: '#1a1c20'
  surface-variant: '#e2e2e8'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  chat-bubble:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 16px
  stack-gap: 12px
  inline-padding: 16px
  chat-gap: 8px
---

## Brand & Style

The design system is engineered for high-velocity customer support within the Moroccan e-commerce ecosystem. It prioritizes operational efficiency, trust, and rapid information processing. 

The aesthetic follows a **Modern Professional** direction with **Minimalist** leanings. By stripping away non-functional ornamentation, the interface directs focus toward ticket resolution and chat history. The design ensures high visual clarity through a rigorous typographic scale and a purposeful use of whitespace, meeting WCAG AA standards to remain accessible for agents working in varied lighting conditions.

Key attributes:
- **Clarity:** Every element has a distinct functional purpose.
- **Efficiency:** Optimized for quick scanning of French text strings.
- **Reliability:** A sober, structured layout that evokes institutional stability.

## Colors

This design system utilizes a high-contrast palette centered around "Deep Moroccan Blue" to project authority and calm. 

- **Primary:** `#1A4F8B` is used for primary actions, active states, and branding.
- **Surface:** Uses a clean white base with cool gray subordinates (`#F1F5F9`) to define container boundaries without heavy lines.
- **Semantic Palette:** Standardized Success (Emerald 600), Warning (Amber 500), and Danger (Rose 600) for error handling.
- **Status Indicators:** Specifically mapped to the Moroccan context:
    - **En attente (Orange):** Urgency without alarm.
    - **En cours (Blue):** Active engagement.
    - **Fermée (Gray):** Neutral, archived state.

For Dark Mode, surfaces transition to a "Deep Slate" palette (`#0F172A`) to reduce eye strain during night shifts while maintaining the primary blue's vibrancy.

## Typography

The typography system is built on **Inter**, chosen for its exceptional legibility in dense data environments and technical support contexts. 

**French Language Optimization:** 
Layouts must account for French text being approximately 20% longer than English. Use the `body-md` (14px) as the standard for chat messages to balance information density with readability. Headlines are kept tight and slightly tracked-in to ensure labels like "Gestion des commandes" do not wrap prematurely.

**Minimum Size:** 
No functional text should fall below 12px. Metadata (timestamps, ID numbers) uses `body-sm` in a medium-gray shade to maintain hierarchy.

## Layout & Spacing

Designed specifically for a **390x844 (iPhone 14/15)** viewport. The layout follows a modular vertical stack.

- **Grid:** A 4-column fluid mobile grid with 16px outer margins.
- **Rhythm:** An 8px base unit drives all spacing. 
- **Safe Areas:** Strict adherence to bottom-tab navigation and top-notch clearance.
- **Chat Specifics:** Messages are grouped with a 4px gap for same-user bursts and 12px for transitions between agent and customer. 

Interaction targets (buttons, inputs) must maintain a minimum height of 48px to ensure ease of use for agents on the move.

## Elevation & Depth

This design system uses **Tonal Layering** supplemented by **Low-profile Shadows** to define hierarchy.

- **Base Layer:** The main background (`#F8FAFC`).
- **Surface Layer:** White cards or containers used for ticket summaries and chat bubbles. These use a 1px border (`#E2E8F0`) rather than heavy shadows to maintain a "clean" look.
- **Elevated Layer:** Only reserved for floating action buttons (e.g., "New Chat") or active modals. These use a diffused 4px blur with 5% opacity black to provide a subtle lift without cluttering the UI.
- **Active State:** Elements being pressed or focused lose their shadow and may gain a 2px primary-colored outline.

## Shapes

The shape language reflects the "Professional yet Accessible" narrative through varied corner radii:

- **Standard Containers:** 8px (`rounded-md`) for cards, input fields, and standard buttons. This provides a structured, dependable feel.
- **Chat Bubbles:** 16px (`rounded-xl`) to distinguish conversational content from the UI framework, creating a friendlier, distinct shape for human interaction.
- **Badges/Chips:** 4px (`rounded-sm`) for status indicators like "En attente," ensuring they look like utilitarian tags rather than playful buttons.

## Components

### Buttons
- **Primary:** Solid `#1A4F8B` with white text. 8px radius.
- **Secondary:** Transparent with `#1A4F8B` border and text.
- **Ghost:** Text-only for destructive actions or secondary navigation.

### Chat Bubbles
- **Agent:** Deep Blue background with White text. Aligned Right.
- **Customer:** Light Gray (`#F1F5F9`) background with Dark Slate text. Aligned Left.
- **Metadata:** Timestamps placed outside the bubble in 10px Inter Regular.

### Inputs
- **Text Fields:** 48px height, 8px radius, 1px border. Label moves to a floating position or sits clearly above the field.
- **Search:** Specifically optimized for Order IDs and Customer Names with a leading icon.

### Status Badges
- Small, uppercase labels with a 4px radius. 
- Colors: `bg-status-waiting` with dark orange text; `bg-status-active` with dark blue text; `bg-status-closed` with dark gray text.

### Cards (Ticket List)
- 16px internal padding.
- Includes a clear 3-line preview: [Customer Name] - [Order ID] - [Subject Snippet].