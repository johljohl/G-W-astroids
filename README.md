# Game & Watch Asteroids

This is a simple 2D game where you control a spaceship and shoot asteroids. The game is written in JavaScript and uses the HTML5 canvas for rendering.

## Gameplay

You control a spaceship at the bottom of the screen and can move left and right. You can shoot bullets to destroy asteroids. When an asteroid is hit, it splits into smaller asteroids. If your spaceship collides with an asteroid, it loses a life and breaks into pieces.

The game ends when you lose all lives. If you destroy all asteroids, a new set of asteroids is created.

## Controls

- Left Arrow: Move left
- Right Arrow: Move right
- Space: Shoot

## Running the Game

To run the game, simply open the `index.html` file in your web browser.

## Code Structure

- `script.js`: This file contains the main game logic. It includes classes for the spaceship, bullets, asteroids, and ship pieces, as well as functions for handling user input, updating the game state, checking collisions, and rendering the game objects.
