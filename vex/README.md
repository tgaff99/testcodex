# ABSOLUTELY INCREDIBLE VEX Clawbot Codebase (V5 C++)

This package provides a modular VEXcode V5 C++ architecture for an advanced Clawbot.

## What's included

- `src/main.cpp`: full runtime, state machine, autonomous + manual loop, telemetry, safety, vision-assist, and mode handlers.
- `include/config.h`: centralized constants, feature toggles, and tuning values.
- `include/systems.h`: subsystems for drive, arm/claw, sensor fusion, energy management, vision processing, grid mapping + A*, and AI behavior adaptation.
- `tools/train_behavior_model.py`: optional offline script for tuning reward heuristics and exporting starter parameters.

## Hardware assumptions

- VEX V5 Brain + Controller
- Left/Right drivetrain motors
- Arm motor + claw motor
- Inertial sensor
- Distance sensor (front)
- Optional Vision sensor
- Optional bumper switch

## Port map

Update port definitions in `include/config.h` to match your robot build.

## Build + deploy

1. Create/open a VEXcode V5 C++ project.
2. Copy `include/config.h` and `include/systems.h` into the project's `include/` directory.
3. Copy `src/main.cpp` into `src/`.
4. Ensure the project has generated `vex.h` and matching device config.
5. Build and download to Brain.

## Runtime modes

- `IDLE`: safe standby and status display
- `MANUAL`: joystick control with deadzone + expo scaling
- `AUTONOMOUS`: mapping + A* + obstacle-aware drive
- `PICKUP_DELIVERY`: object pickup/transport/release workflow
- `EXPLORATION`: roam + map + telemetry logging
- `COMPETITION`: deterministic competition routine scaffold
- `ENTERTAINMENT`: motion/light show routine scaffold
- `ERROR`: safe stop and recovery path

## Safety model

- Emergency stop on controller `ButtonX`
- Two-button reset sequence (`A+B`) with battery guard
- Collision pre-check using distance threshold
- Battery-aware speed limiting with critical shutdown
- Sensor health checks with fallback to conservative behavior

## Optional Python extension

`tools/train_behavior_model.py` can be run on your computer to tune reward weights. The output can be copied into `config.h`.

