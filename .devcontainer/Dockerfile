// REPOSITORY SOURCE: diplomat-bit/aibank | PATH: diplomat-bit-aibank-3a68d63/.devcontainer/Dockerfile
================================================================================

ARG VARIANT="3.9"
FROM mcr.microsoft.com/vscode/devcontainers/python:0-${VARIANT}

USER vscode

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN echo "[[ -d .venv ]] && source .venv/bin/activate || export PATH=\$PATH" >> /home/vscode/.bashrc


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-python | ORIGINAL PATH: diplomat-bit-jocall3-python-03825e0/.devcontainer/Dockerfile
================================================================================

ARG VARIANT="3.9"
FROM mcr.microsoft.com/vscode/devcontainers/python:0-${VARIANT}

USER vscode

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN echo "[[ -d .venv ]] && source .venv/bin/activate || export PATH=\$PATH" >> /home/vscode/.bashrc
