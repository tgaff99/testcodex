/*
 ABSOLUTELY INCREDIBLE VEX Clawbot (VEXcode V5 C++)
 --------------------------------------------------
 Setup:
 1) Update ports/constants in include/config.h.
 2) Ensure your VEXcode device configuration matches these devices.
 3) Build + download to V5 Brain.

 Key architecture:
 - Finite state machine for robust mode control.
 - Modular subsystems (drive, claw, sensor fusion, mapping, AI adaptation).
 - A* path planner on a grid map with dynamic obstacle stamping.
 - Safety guardrails: e-stop, obstacle avoid, battery-aware speed limiting.
 - Vision-assisted pickup alignment + JSON telemetry.
*/

#include "vex.h"
#include "config.h"
#include "systems.h"

using namespace vex;

brain Brain;
controller Controller1;

motor leftDrive(cfg::PORT_LEFT_DRIVE, ratio18_1, false);
motor rightDrive(cfg::PORT_RIGHT_DRIVE, ratio18_1, true);
motor armMotor(cfg::PORT_ARM, ratio36_1, false);
motor clawMotor(cfg::PORT_CLAW, ratio18_1, false);
inertial imu(cfg::PORT_INERTIAL);
distance frontDistance(cfg::PORT_DISTANCE_FRONT);
vision visionSensor(cfg::PORT_VISION);
bumper bumpA(Brain.ThreeWirePort.A);

competition Competition;

VisionProcessor visionProc(&visionSensor);
EnergyManager energy;
DriveSystem drive(leftDrive, rightDrive, imu);
ClawSystem claw(armMotor, clawMotor);
SensorFusion fusion(imu, frontDistance, &bumpA, &visionProc);
GridMap grid;
AIController ai;

RobotMode gMode = RobotMode::IDLE;
Telemetry gTelemetry;
bool gEStop = false;

double maxDriveForBattery(double v) {
  return cfg::DRIVE_MAX_PCT * energy.speedScale(v);
}

const char* modeName(RobotMode m) {
  switch (m) {
    case RobotMode::IDLE: return "IDLE";
    case RobotMode::MANUAL: return "MANUAL";
    case RobotMode::AUTONOMOUS: return "AUTONOMOUS";
    case RobotMode::PICKUP_DELIVERY: return "PICKUP_DELIVERY";
    case RobotMode::EXPLORATION: return "EXPLORATION";
    case RobotMode::COMPETITION: return "COMPETITION";
    case RobotMode::ENTERTAINMENT: return "ENTERTAINMENT";
    default: return "ERROR";
  }
}

void logTelemetry() {
  Brain.Screen.clearScreen();
  Brain.Screen.setCursor(1, 1);
  Brain.Screen.print("Mode:%s Bat:%.2fV", modeName(gTelemetry.mode), gTelemetry.batteryVolt);
  Brain.Screen.setCursor(2, 1);
  Brain.Screen.print("Head:%.1f Dist:%.0f", gTelemetry.headingDeg, gTelemetry.frontDistanceMm);
  Brain.Screen.setCursor(3, 1);
  Brain.Screen.print("Vision:%d X:%d", gTelemetry.hasVisionTarget ? 1 : 0, gTelemetry.visionTargetX);

  printf("{\"mode\":\"%s\",\"bat\":%.2f,\"head\":%.2f,\"dist\":%.1f,\"bump\":%d,\"vision\":%d,\"x\":%d}\n",
         modeName(gTelemetry.mode),
         gTelemetry.batteryVolt,
         gTelemetry.headingDeg,
         gTelemetry.frontDistanceMm,
         gTelemetry.bumperPressed ? 1 : 0,
         gTelemetry.hasVisionTarget ? 1 : 0,
         gTelemetry.visionTargetX);
}

void emergencyStop(const char* reason) {
  gEStop = true;
  gMode = RobotMode::ERROR;
  drive.stop(brakeType::hold);
  armMotor.stop(brakeType::hold);
  clawMotor.stop(brakeType::hold);
  Brain.Screen.setCursor(5, 1);
  Brain.Screen.print("E-STOP: %s", reason);
}

void tryResetEmergencyStop() {
  if (!gEStop) return;
  if (Controller1.ButtonA.pressing() && Controller1.ButtonB.pressing() && gTelemetry.batteryVolt >= cfg::E_STOP_RESET_MIN_VOLT) {
    gEStop = false;
    gMode = RobotMode::IDLE;
    Brain.Screen.setCursor(6, 1);
    Brain.Screen.print("E-STOP RESET");
  }
}

bool safetyChecks() {
  if (Controller1.ButtonX.pressing()) {
    emergencyStop("ButtonX");
    return false;
  }
  if (gTelemetry.frontDistanceMm > 0.0 && gTelemetry.frontDistanceMm < cfg::OBSTACLE_STOP_MM && gMode != RobotMode::MANUAL) {
    emergencyStop("Obstacle");
    return false;
  }
  if (energy.isCritical(gTelemetry.batteryVolt)) {
    emergencyStop("Battery");
    return false;
  }
  return true;
}

void runManual() {
  double maxPct = maxDriveForBattery(gTelemetry.batteryVolt);
  drive.arcade(Controller1.Axis3.position(pct), Controller1.Axis1.position(pct), maxPct);

  int armCmd = Controller1.Axis2.position(pct);
  if (std::abs(armCmd) > cfg::JOYSTICK_DEADZONE) {
    claw.armManual(armCmd);
  } else {
    claw.armHold();
  }

  if (Controller1.ButtonR1.pressing()) claw.gripStrong();
  else if (Controller1.ButtonR2.pressing()) claw.release();
  else claw.holdClawPosition(clawMotor.position(deg), 0.02);
}

void runAutonomous() {
  if (gTelemetry.frontDistanceMm < cfg::OBSTACLE_WARN_MM) {
    grid.setBlocked(4, 4, true);
  } else {
    grid.setBlocked(4, 4, false);
  }

  auto path = grid.aStar(1, 1, 9, 9);
  if (path.empty()) {
    ai.updateReward(cfg::REWARD_COLLISION);
    drive.stop();
    return;
  }

  double speed = maxDriveForBattery(gTelemetry.batteryVolt) * ai.speedBias();
  drive.holdHeading(0.0, speed, 0.02);
  ai.updateReward(cfg::REWARD_FAST_PATH);
}

void runPickupDelivery() {
  if (gTelemetry.hasVisionTarget) {
    int pixelError = gTelemetry.visionTargetX - 158;
    int turnCmd = static_cast<int>(pixelError * 0.20);
    if (turnCmd > 35) turnCmd = 35;
    if (turnCmd < -35) turnCmd = -35;
    drive.arcade(20, turnCmd, 40);
    ai.updateReward(cfg::REWARD_VISION_LOCK);
  }

  if (gTelemetry.frontDistanceMm > cfg::OBSTACLE_WARN_MM) {
    drive.holdHeading(0.0, 28.0, 0.02);
    return;
  }

  drive.stop();
  claw.gripSoft();
  wait(350, msec);
  claw.armManual(35);
  wait(450, msec);
  claw.armHold();

  drive.holdHeading(0.0, 24.0, 0.02);
  wait(600, msec);
  drive.stop();

  claw.release();
  wait(250, msec);
  ai.updateReward(cfg::REWARD_PICKUP);
}

void runExploration() {
  static double target = 0.0;
  if (gTelemetry.frontDistanceMm < cfg::OBSTACLE_WARN_MM || gTelemetry.bumperPressed) {
    target += 45.0;
    if (target >= 360.0) target -= 360.0;
  }
  drive.holdHeading(target, 30.0 * ai.speedBias(), 0.02);
}

void runCompetition() {
  runAutonomous();
}

void runEntertainment() {
  drive.arcade(0, 45, 35);
  claw.release();
  wait(200, msec);
  drive.arcade(0, -45, 35);
  claw.gripSoft();
  wait(200, msec);
}

void autoModeSelector() {
  if (Controller1.ButtonA.pressing()) gMode = RobotMode::MANUAL;
  if (Controller1.ButtonB.pressing()) gMode = RobotMode::AUTONOMOUS;
  if (Controller1.ButtonY.pressing()) gMode = RobotMode::PICKUP_DELIVERY;
  if (Controller1.ButtonUp.pressing()) gMode = RobotMode::EXPLORATION;
  if (Controller1.ButtonRight.pressing()) gMode = RobotMode::COMPETITION;
  if (Controller1.ButtonLeft.pressing()) gMode = RobotMode::ENTERTAINMENT;
}

int main() {
  vexcodeInit();

  fusion.calibrate();
  gMode = RobotMode::IDLE;

  while (true) {
    gTelemetry = fusion.read(gTelemetry);
    gTelemetry.mode = gMode;

    tryResetEmergencyStop();
    autoModeSelector();

    if (!gEStop && !safetyChecks()) {
      wait(20, msec);
      continue;
    }

    switch (gMode) {
      case RobotMode::IDLE:
        drive.stop(brakeType::coast);
        claw.armHold();
        break;
      case RobotMode::MANUAL:
        runManual();
        break;
      case RobotMode::AUTONOMOUS:
        runAutonomous();
        break;
      case RobotMode::PICKUP_DELIVERY:
        runPickupDelivery();
        break;
      case RobotMode::EXPLORATION:
        runExploration();
        break;
      case RobotMode::COMPETITION:
        runCompetition();
        break;
      case RobotMode::ENTERTAINMENT:
        runEntertainment();
        break;
      case RobotMode::ERROR:
      default:
        drive.stop(brakeType::hold);
        claw.armHold();
        break;
    }

    logTelemetry();
    wait(20, msec);
  }

  return 0;
}
