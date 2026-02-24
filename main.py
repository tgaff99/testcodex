from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path


def build_latest_version(build_dir: Path) -> Path:
    """Create a local build artifact representing the latest project version."""
    build_dir.mkdir(parents=True, exist_ok=True)
    artifact = build_dir / "latest_build.txt"
    artifact.write_text(
        "Built latest version at "
        f"{datetime.now().isoformat(timespec='seconds')}\n",
        encoding="utf-8",
    )
    return artifact


def deploy_to_machine(artifact: Path, deploy_dir: Path) -> Path:
    """Simulate deployment to this machine by copying build metadata to deploy/."""
    deploy_dir.mkdir(parents=True, exist_ok=True)
    deployed = deploy_dir / "deployed_version.txt"
    deployed.write_text(artifact.read_text(encoding="utf-8"), encoding="utf-8")
    return deployed


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Build the latest version and deploy it to this machine.",
    )
    parser.add_argument(
        "--build-dir",
        default="build",
        help="Directory for the generated build artifact (default: build).",
    )
    parser.add_argument(
        "--deploy-dir",
        default="deploy",
        help="Directory for the deployed artifact copy (default: deploy).",
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    artifact_path = build_latest_version(Path(args.build_dir))
    deployed_path = deploy_to_machine(artifact_path, Path(args.deploy_dir))
    print(f"Build complete: {artifact_path}")
    print(f"Deployment complete on this machine: {deployed_path}")


if __name__ == "__main__":
    main()
