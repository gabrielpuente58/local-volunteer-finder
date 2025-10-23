# Local Volunteer App

This is an app built to find volunteers that are local to users along with that it is also meant for people or organizations who are looking for volunteers whether it be regularly or once every so often.

To help find volunteers it utilized a map that will eventually allow you to search and filter out volunteers based on different things.

## WireFrame

![Wireframe](wireframe.jpeg "Wireframe")

## Human Interface Guidelines Within My App

### Light and Dark Mode Implementation

This app uses light and dark mode theming. I used different blues dependent on the theme (`#007AFF` for light mode and `#0A84FF` for dark mode). The dark mode implementation follows HIG principles by using true black (`#000000`) for the background, which is optimal for OLED displays and reduces eye strain in low-light environments. Secondary colors such as grays (`#1C1C1E` and `#2C2C2E`) help create visual hierarchy and depth. The colors maintains proper contrast for accessibility, with white text on dark backgrounds and black text on light backgrounds.The theme automatically adapts all UI elements creating a cohesive visual experience across both modes.

### Button Design and Interaction

The button components in this app follow HIG standards for touch and visual feedback. Each button implements the Pressable component with appropriate press states, using a scale transformation (`scale: 0.97`) to provide feedback when tapped, which aligns with iOS conventions for interactive elements. The buttons maintain a minimum height that approaches the HIG-recommended 44-point touch target size through vertical padding of 12 points combined with 16-point font size. Press states are visually distinct, with primary buttons darkening to `#005BBB` in light mode and lightening to `#409CFF` in dark mode, providing clear visual confirmation of user interaction. The border radius of 8 points creates modern, approachable UI elements while maintaining visual consistency throughout the application. All buttons use semibold font weight (600) for readability and to emphasize their interactiveness.
