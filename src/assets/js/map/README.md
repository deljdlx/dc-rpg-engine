# RPG Engine Core Classes

This directory contains the core classes for the RPG engine.

## Architecture Overview

### Main Classes

- **Application** - Main application controller, manages viewport and element registration
- **Viewport** - Manages the visible game area and player character
- **Board** - Manages the game world divided into areas (grid-based)
- **Area** - Represents a section of the game map
- **Element** - Base class for all game objects (characters, buildings, etc.)
- **Character** - Specialized element for character entities

### Supporting Classes

- **Geometry** - Manages size and position for elements
- **Coordinates** - Represents 2D coordinates
- **BoundingBox** - Handles collision detection boundaries
- **Constants** - Game configuration constants

### Renderer Classes

Located in `Renderer/` subdirectory:
- **Renderer** - Base renderer for elements
- **ViewportRenderer** - Renders the viewport
- **BoardRenderer** - Renders the game board
- **AreaRenderer** - Renders individual areas
- **CharacterRenderer** - Renders character sprites with animation

## Event System

Most classes implement event handling through:
- `addEventListener(name, callback)` - Register event listeners
- `handle(name, data)` - Trigger events

Common events:
- `element.collision` - Triggered on element collision
- `element.trigger` - Triggered on trigger zone entry
- `area.click` - Triggered on area click
- `map.update` - Triggered on map update

## Collision System

The collision system uses:
- **Collision zones** - Solid boundaries that block movement
- **Trigger zones** - Non-blocking zones that trigger events
- **BoundingBox** - For efficient collision detection

## Usage Example

```javascript
const app = new Application('#viewport', 900, 600);

// Register custom elements
app.registerElement('Tree', Tree);
app.registerElement('House', House);

// Run the application
await app.run();
```

## Notes

- All positions use pixel coordinates
- The coordinate system origin (0,0) is at the top-left
- Elements can be nested (parent-child relationships)
- Areas are loaded dynamically based on player position
