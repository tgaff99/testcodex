# Local Build + Deploy Script

This repository provides a simple Python entrypoint to:

1. Build the latest local artifact.
2. Deploy that artifact on the same machine.

## Requirements

- Python 3.9+ (or newer)

## Quick start

Run:

```bash
python main.py
```

Expected output:

```text
Build complete: build/latest_build.txt
Deployment complete on this machine: deploy/deployed_version.txt
```

## Verify results

```bash
cat build/latest_build.txt
cat deploy/deployed_version.txt
```

Both files should contain the same timestamp line.

## Optional flags

```bash
python main.py --help
python main.py --build-dir custom_build --deploy-dir custom_deploy
```

Use these flags if you want output in different folders.
