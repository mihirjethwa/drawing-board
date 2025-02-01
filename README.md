# Drawing Board Webapp

A lightweight and interactive Drawing Board Web Application built using React, TypeScript, and Vite . This project focuses on providing a seamless drawing experience by leveraging the power of the Konva.js library for canvas manipulation and Redux for state managemen

[Webapp Link](https://drawing-board-olive.vercel.app/)

## Table of Contents

Overview
Features
Why Konva.js?
Tech Stack
Installation
Usage
Future Enhancements

## Overview

This project was created to explore and implement a web-based drawing board with essential features like freehand drawing, shape creation, undo/redo functionality, and more. After researching various libraries such as PixiJS , Fabric.js , and others, I found Konva.js to be the best fit for this use case due to its simplicity, excellent documentation, and versatility.

## Features

Freehand Drawing : Draw smoothly with your mouse or touch device.
Shape Tools : Create basic shapes like rectangles, circles, and lines.
Undo/Redo : Easily revert or reapply actions with undo/redo functionality.
Tool Selection : Switch between tools (e.g., pencil, eraser, shapes) from the toolbar.
State Management : Redux is used to manage tool selection and application state seamlessly.

## Why Konva.js?

After evaluating several popular canvas libraries, I chose Konva.js for the following reasons:

Simplicity : The API is intuitive and easy to work with, making it ideal for rapid prototyping.
Documentation : Comprehensive and well-structured documentation with plenty of examples.
Versatility : Supports a wide range of use cases, from simple drawings to complex interactive graphics.
Performance : While not focused on gaming or WebGL-heavy applications, it offers excellent performance for drawing and UI-related tasks.
Other libraries like PixiJS and Fabric.js are great for specific use cases (e.g., games or advanced animations), but Konva.js struck the right balance for my drawing board needs.

## Tech Stack

Frontend Framework : React
Language : TypeScript
Build Tool : Vite
Canvas Library : Konva.js
State Management : Redux
Package Manager : pnpm (compatible with npm/yarn)

Installation
To set up and run this project locally, follow these steps:

Clone the repository :

```bash
git clone https://github.com/your-username/drawing-board.git
cd drawing-board
```

Install dependencies :

```bash
pnpm install
# or
npm install
```

Run the development server :

```bash
pnpm run dev
# or
npm run dev
```

Open your browser and navigate to http://localhost:5173 (or the port specified in your terminal).

## Usage

Once the app is running, you can:

Use the toolbar to select tools like the pen, shape, typing tools.
Draw freely on the canvas or create shapes by clicking and dragging.
Use the undo/redo buttons to revert or reapply actions.
Experiment with different tools and features to create your masterpiece!

## Future Enhancements

This project is still a work in progress, and I plan to add the following features in the near future:

Multiple Layers : Allow users to work with multiple layers for better organization.
Advanced Tools : Introduce additional tools like gradients.
Bug Fixes : Address minor bugs and improve overall stability.
