#pragma once

// ==============================================================
// ABSOLUTELY INCREDIBLE VEX Clawbot - Global Configuration
// ==============================================================

namespace cfg {

// -------- Feature toggles --------
constexpr bool ENABLE_VISION = true;
constexpr bool ENABLE_MONETIZATION = false; // Placeholder gate for productization demos.
constexpr bool ENABLE_SWARM = false;        // Requires additional comms hardware.
constexpr bool ENABLE_SIM_MODE = false;

// -------- Brain + device ports (update to match your build) --------
constexpr int PORT_LEFT_DRIVE = 1;
constexpr int PORT_RIGHT_DRIVE = 10;
constexpr int PORT_ARM = 3;
constexpr int PORT_CLAW = 8;
constexpr int PORT_INERTIAL = 5;
constexpr int PORT_DISTANCE_FRONT = 6;
constexpr int PORT_VISION = 7;
constexpr int PORT_BUMPER = 11;

// -------- Drive tuning --------
constexpr double DRIVE_MAX_PCT = 90.0;
constexpr double DRIVE_MIN_PCT = 12.0;
constexpr double DRIVE_ACCEL_STEP = 4.0;
constexpr double DRIVE_TURN_SCALE = 0.7;
constexpr int JOYSTICK_DEADZONE = 5;
constexpr double JOYSTICK_EXPO = 1.7;

// -------- Motion + safety --------
constexpr double OBSTACLE_STOP_MM = 140.0;
constexpr double OBSTACLE_WARN_MM = 260.0;
constexpr double LOW_BATTERY_VOLT = 7.2;
constexpr double CRITICAL_BATTERY_VOLT = 6.8;
constexpr double E_STOP_RESET_MIN_VOLT = 7.0;

// -------- Arm + claw control --------
constexpr double ARM_HOLD_PCT = 8.0;
constexpr double CLAW_SOFT_GRIP_PCT = 20.0;
constexpr double CLAW_STRONG_GRIP_PCT = 55.0;
constexpr double CLAW_RELEASE_PCT = -35.0;

// -------- PID defaults --------
constexpr double PID_KP_DRIVE = 0.16;
constexpr double PID_KI_DRIVE = 0.0005;
constexpr double PID_KD_DRIVE = 0.08;

constexpr double PID_KP_CLAW = 0.22;
constexpr double PID_KI_CLAW = 0.0003;
constexpr double PID_KD_CLAW = 0.05;

// -------- AI adaptation defaults --------
constexpr double RL_ALPHA = 0.20;
constexpr double RL_GAMMA = 0.85;
constexpr double REWARD_PICKUP = 1.0;
constexpr double REWARD_COLLISION = -1.2;
constexpr double REWARD_FAST_PATH = 0.4;
constexpr double REWARD_VISION_LOCK = 0.7;

// -------- Grid map --------
constexpr int GRID_W = 12;
constexpr int GRID_H = 12;

// -------- Vision signatures --------
constexpr int VISION_SIG_TARGET = 1;
constexpr int VISION_MIN_TARGET_WIDTH = 15;

} // namespace cfg
