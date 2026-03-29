# Shield Collision Bug Fix Todo

## The Bug
On mobile (touch devices), the game initializes the shields using the layout property `shieldPosition.bottom = 160` instead of `shieldPosition.y = 75` (which is used on desktop). 

However, in the collision detection logic within `src/components/GameScreen.js`, the code assumes that `shield.position.y` is always defined:
```javascript
const shieldY = (shield.position.y / 100) * gameHeight;
```
When `shield.position.y` is `undefined`, `shieldY` evaluates to `NaN`. All subsequent coordinate math and boundary checking fail because comparisons with `NaN` are always `false`. As a result, the lasers just pass through the shields without hitting them.

## Tasks
- [x] Locate the collision bug in `src/components/GameScreen.js` at line 98.
- [x] Change the calculations of `shieldY` to account for touch devices that use `shield.position.bottom` for layout configuration instead of `shield.position.y`.
- [x] Compute `shieldY` correctly by offsetting from the `gameHeight` using the `bottom` property and the collision box height (`5%` of `gameHeight`).
- [x] Apply the code change in `src/components/GameScreen.js`.

## Code Change Applied
In `src/components/GameScreen.js`, we replaced:
```javascript
          const shieldY = (shield.position.y / 100) * gameHeight;
```
With:
```javascript
          const shieldY = shield.position.y !== undefined 
            ? (shield.position.y / 100) * gameHeight 
            : gameHeight - shield.position.bottom - (5 / 100 * gameHeight);
```
