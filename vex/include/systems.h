#pragma once

#include "vex.h"
#include "config.h"
#include <array>
#include <vector>
#include <queue>
#include <cmath>
#include <algorithm>
#include <limits>

using namespace vex;

enum class RobotMode {
  IDLE,
  MANUAL,
  AUTONOMOUS,
  PICKUP_DELIVERY,
  EXPLORATION,
  COMPETITION,
  ENTERTAINMENT,
  ERROR
};

struct Telemetry {
  double batteryVolt = 0.0;
  double headingDeg = 0.0;
  double frontDistanceMm = 0.0;
  bool bumperPressed = false;
  bool hasVisionTarget = false;
  int visionTargetX = -1;
  double driveCmd = 0.0;
  double turnCmd = 0.0;
  RobotMode mode = RobotMode::IDLE;
};

struct Node {
  int x = 0;
  int y = 0;
  double g = 0;
  double h = 0;
  int parentX = -1;
  int parentY = -1;

  double f() const { return g + h; }
};

class PID {
public:
  PID(double kp, double ki, double kd) : kp_(kp), ki_(ki), kd_(kd) {}

  double step(double error, double dtSec) {
    integral_ += error * dtSec;
    double derivative = dtSec > 0.0 ? (error - prevError_) / dtSec : 0.0;
    prevError_ = error;
    return kp_ * error + ki_ * integral_ + kd_ * derivative;
  }

  void reset() {
    integral_ = 0.0;
    prevError_ = 0.0;
  }

private:
  double kp_ = 0.0;
  double ki_ = 0.0;
  double kd_ = 0.0;
  double integral_ = 0.0;
  double prevError_ = 0.0;
};

class EnergyManager {
public:
  double speedScale(double batteryVolt) const {
    if (batteryVolt <= cfg::CRITICAL_BATTERY_VOLT) return 0.40;
    if (batteryVolt <= cfg::LOW_BATTERY_VOLT) return 0.65;
    return 1.0;
  }

  bool isCritical(double batteryVolt) const {
    return batteryVolt <= cfg::CRITICAL_BATTERY_VOLT;
  }
};

class VisionProcessor {
public:
  explicit VisionProcessor(vision* sensor) : sensor_(sensor) {}

  bool detectTarget(int* centerX = nullptr) {
    if (!cfg::ENABLE_VISION || sensor_ == nullptr) return false;

    sensor_->takeSnapshot(cfg::VISION_SIG_TARGET);
    if (sensor_->largestObject.exists && sensor_->largestObject.width >= cfg::VISION_MIN_TARGET_WIDTH) {
      if (centerX) {
        *centerX = sensor_->largestObject.centerX;
      }
      return true;
    }
    return false;
  }

private:
  vision* sensor_ = nullptr;
};

class SensorFusion {
public:
  SensorFusion(inertial& imu, distance& frontDist, bumper* bump, VisionProcessor* visionProc)
      : imu_(imu), frontDist_(frontDist), bump_(bump), visionProc_(visionProc) {}

  void calibrate() {
    imu_.calibrate();
    while (imu_.isCalibrating()) {
      wait(25, msec);
    }
  }

  Telemetry read(Telemetry prev) {
    Telemetry t = prev;
    t.batteryVolt = Brain.Battery.voltage();
    t.headingDeg = imu_.heading();
    t.frontDistanceMm = frontDist_.objectDistance(mm);
    t.bumperPressed = bump_ ? bump_->pressing() : false;
    t.hasVisionTarget = visionProc_ ? visionProc_->detectTarget(&t.visionTargetX) : false;
    if (!t.hasVisionTarget) t.visionTargetX = -1;
    return t;
  }

private:
  inertial& imu_;
  distance& frontDist_;
  bumper* bump_ = nullptr;
  VisionProcessor* visionProc_ = nullptr;
};

class DriveSystem {
public:
  DriveSystem(motor& left, motor& right, inertial& imu)
      : left_(left), right_(right), imu_(imu), headingPID_(cfg::PID_KP_DRIVE, cfg::PID_KI_DRIVE, cfg::PID_KD_DRIVE) {}

  double shapeJoystick(int v) const {
    if (std::abs(v) < cfg::JOYSTICK_DEADZONE) return 0.0;
    double norm = static_cast<double>(v) / 100.0;
    double shaped = std::copysign(std::pow(std::abs(norm), cfg::JOYSTICK_EXPO), norm);
    return shaped * 100.0;
  }

  void arcade(int rawForward, int rawTurn, double maxPct) {
    double fwd = shapeJoystick(rawForward);
    double trn = shapeJoystick(rawTurn) * cfg::DRIVE_TURN_SCALE;
    targetLeft_ = clampPct(fwd + trn, maxPct);
    targetRight_ = clampPct(fwd - trn, maxPct);
    rampAndApply();
  }

  void stop(brakeType b = brakeType::brake) {
    left_.stop(b);
    right_.stop(b);
    currentLeft_ = 0;
    currentRight_ = 0;
    targetLeft_ = 0;
    targetRight_ = 0;
  }

  void holdHeading(double desiredHeadingDeg, double basePct, double dtSec) {
    double err = wrapHeading(desiredHeadingDeg - imu_.heading());
    double corr = headingPID_.step(err, dtSec);
    targetLeft_ = clampPct(basePct + corr, cfg::DRIVE_MAX_PCT);
    targetRight_ = clampPct(basePct - corr, cfg::DRIVE_MAX_PCT);
    rampAndApply();
  }

private:
  motor& left_;
  motor& right_;
  inertial& imu_;
  PID headingPID_;
  double currentLeft_ = 0;
  double currentRight_ = 0;
  double targetLeft_ = 0;
  double targetRight_ = 0;

  static double wrapHeading(double deg) {
    while (deg > 180.0) deg -= 360.0;
    while (deg < -180.0) deg += 360.0;
    return deg;
  }

  static double clampPct(double v, double maxAbs) {
    if (v > maxAbs) return maxAbs;
    if (v < -maxAbs) return -maxAbs;
    return v;
  }

  void rampAndApply() {
    auto approach = [](double cur, double tgt) {
      if (cur < tgt) return std::min(cur + cfg::DRIVE_ACCEL_STEP, tgt);
      return std::max(cur - cfg::DRIVE_ACCEL_STEP, tgt);
    };
    currentLeft_ = approach(currentLeft_, targetLeft_);
    currentRight_ = approach(currentRight_, targetRight_);

    left_.spin(fwd, currentLeft_, pct);
    right_.spin(fwd, currentRight_, pct);
  }
};

class ClawSystem {
public:
  ClawSystem(motor& arm, motor& claw)
      : arm_(arm), claw_(claw), clawPID_(cfg::PID_KP_CLAW, cfg::PID_KI_CLAW, cfg::PID_KD_CLAW) {}

  void armManual(int pctCmd) {
    arm_.spin(fwd, pctCmd, pct);
  }

  void armHold() {
    arm_.spin(fwd, cfg::ARM_HOLD_PCT, pct);
  }

  void gripSoft() { claw_.spin(fwd, cfg::CLAW_SOFT_GRIP_PCT, pct); }
  void gripStrong() { claw_.spin(fwd, cfg::CLAW_STRONG_GRIP_PCT, pct); }
  void release() { claw_.spin(fwd, cfg::CLAW_RELEASE_PCT, pct); }

  void holdClawPosition(double targetDeg, double dtSec) {
    double err = targetDeg - claw_.position(deg);
    double out = clawPID_.step(err, dtSec);
    if (out > 70.0) out = 70.0;
    if (out < -70.0) out = -70.0;
    claw_.spin(fwd, out, pct);
  }

private:
  motor& arm_;
  motor& claw_;
  PID clawPID_;
};

class GridMap {
public:
  GridMap() {
    for (auto& row : map_) {
      row.fill(0);
    }
  }

  bool inBounds(int x, int y) const {
    return x >= 0 && x < cfg::GRID_W && y >= 0 && y < cfg::GRID_H;
  }

  bool isBlocked(int x, int y) const {
    if (!inBounds(x, y)) return true;
    return map_[y][x] == 1;
  }

  void setBlocked(int x, int y, bool blocked) {
    if (!inBounds(x, y)) return;
    map_[y][x] = blocked ? 1 : 0;
  }

  std::vector<Node> aStar(int sx, int sy, int gx, int gy) const {
    if (!inBounds(sx, sy) || !inBounds(gx, gy) || isBlocked(sx, sy) || isBlocked(gx, gy)) {
      return {};
    }

    struct Cmp {
      bool operator()(const Node& a, const Node& b) const { return a.f() > b.f(); }
    };

    std::priority_queue<Node, std::vector<Node>, Cmp> open;
    std::array<std::array<bool, cfg::GRID_W>, cfg::GRID_H> closed{};
    std::array<std::array<Node, cfg::GRID_W>, cfg::GRID_H> best{};
    std::array<std::array<double, cfg::GRID_W>, cfg::GRID_H> bestCost{};

    for (auto& row : bestCost) {
      row.fill(std::numeric_limits<double>::infinity());
    }

    Node start;
    start.x = sx;
    start.y = sy;
    start.g = 0.0;
    start.h = heuristic(sx, sy, gx, gy);
    open.push(start);
    best[sy][sx] = start;
    bestCost[sy][sx] = 0.0;

    const int dx[4] = {1, -1, 0, 0};
    const int dy[4] = {0, 0, 1, -1};

    while (!open.empty()) {
      Node cur = open.top();
      open.pop();

      if (!inBounds(cur.x, cur.y) || closed[cur.y][cur.x]) continue;
      closed[cur.y][cur.x] = true;

      if (cur.x == gx && cur.y == gy) {
        return reconstruct(best, gx, gy, sx, sy);
      }

      for (int i = 0; i < 4; ++i) {
        int nx = cur.x + dx[i];
        int ny = cur.y + dy[i];
        if (!inBounds(nx, ny) || isBlocked(nx, ny) || closed[ny][nx]) continue;

        Node next;
        next.x = nx;
        next.y = ny;
        next.g = cur.g + 1.0;
        next.h = heuristic(nx, ny, gx, gy);
        next.parentX = cur.x;
        next.parentY = cur.y;

        if (next.g < bestCost[ny][nx]) {
          best[ny][nx] = next;
          bestCost[ny][nx] = next.g;
          open.push(next);
        }
      }
    }

    return {};
  }

private:
  std::array<std::array<int, cfg::GRID_W>, cfg::GRID_H> map_{};

  static double heuristic(int x, int y, int gx, int gy) {
    return std::abs(gx - x) + std::abs(gy - y);
  }

  static std::vector<Node> reconstruct(const std::array<std::array<Node, cfg::GRID_W>, cfg::GRID_H>& best,
                                       int gx, int gy, int sx, int sy) {
    std::vector<Node> path;
    Node cur = best[gy][gx];
    path.push_back(cur);

    while (!(cur.x == sx && cur.y == sy)) {
      if (cur.parentX < 0 || cur.parentY < 0) break;
      cur = best[cur.parentY][cur.parentX];
      path.push_back(cur);
    }

    std::reverse(path.begin(), path.end());
    return path;
  }
};

class AIController {
public:
  void updateReward(double reward) {
    qValue_ = (1.0 - cfg::RL_ALPHA) * qValue_ + cfg::RL_ALPHA * (reward + cfg::RL_GAMMA * qValue_);
  }

  double speedBias() const {
    if (qValue_ > 0.5) return 1.0;
    if (qValue_ < -0.2) return 0.65;
    return 0.82;
  }

private:
  double qValue_ = 0.0;
};
