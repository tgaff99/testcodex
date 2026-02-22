#!/usr/bin/env python3
"""Simple offline tuner for RL-like reward weights used by the Clawbot AIController.

This script does not run on the VEX brain. It is intended for laptop-side experimentation.
"""

from dataclasses import dataclass


@dataclass
class Weights:
    alpha: float = 0.20
    gamma: float = 0.85
    reward_pickup: float = 1.0
    reward_collision: float = -1.2
    reward_fast_path: float = 0.4


def simulate(weights: Weights, episodes: int = 100) -> float:
    q = 0.0
    for i in range(episodes):
        reward = weights.reward_fast_path
        if i % 9 == 0:
            reward += weights.reward_pickup
        if i % 17 == 0:
            reward += weights.reward_collision
        q = (1 - weights.alpha) * q + weights.alpha * (reward + weights.gamma * q)
    return q


def main() -> None:
    w = Weights()
    score = simulate(w)
    print("# Suggested config.h values")
    print(f"constexpr double RL_ALPHA = {w.alpha:.2f};")
    print(f"constexpr double RL_GAMMA = {w.gamma:.2f};")
    print(f"constexpr double REWARD_PICKUP = {w.reward_pickup:.2f};")
    print(f"constexpr double REWARD_COLLISION = {w.reward_collision:.2f};")
    print(f"constexpr double REWARD_FAST_PATH = {w.reward_fast_path:.2f};")
    print(f"# Simulated steady-state Q ≈ {score:.3f}")


if __name__ == "__main__":
    main()
