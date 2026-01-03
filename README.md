# jupyterlab_show_commands_reference_extension

[![GitHub Actions](https://github.com/stellarshenson/jupyterlab_show_commands_reference_extension/actions/workflows/build.yml/badge.svg)](https://github.com/stellarshenson/jupyterlab_show_commands_reference_extension/actions/workflows/build.yml)
[![npm version](https://img.shields.io/npm/v/jupyterlab_show_commands_reference_extension.svg)](https://www.npmjs.com/package/jupyterlab_show_commands_reference_extension)
[![PyPI version](https://img.shields.io/pypi/v/jupyterlab-show-commands-reference-extension.svg)](https://pypi.org/project/jupyterlab-show-commands-reference-extension/)
[![Total PyPI downloads](https://static.pepy.tech/badge/jupyterlab-show-commands-reference-extension)](https://pepy.tech/project/jupyterlab-show-commands-reference-extension)
[![JupyterLab 4](https://img.shields.io/badge/JupyterLab-4-orange.svg)](https://jupyterlab.readthedocs.io/en/stable/)
[![Brought To You By KOLOMOLO](https://img.shields.io/badge/Brought%20To%20You%20By-KOLOMOLO-00ffff?style=flat)](https://kolomolo.com)
[![Donate PayPal](https://img.shields.io/badge/Donate-PayPal-blue?style=flat)](https://www.paypal.com/donate/?hosted_button_id=B4KPBJDLLXTSA)

Display all available JupyterLab commands with their full reference IDs and arguments in a dedicated tab. A reference help page for developers working with JupyterLab commands.

![Command Palette](.resources/screenshot-command.png)

![Commands Reference Panel](.resources/screenshot-commands-reference.png)

## Features

- **Command reference tab** - Opens a new tab listing all registered JupyterLab commands
- **Full command IDs** - Shows complete command identifiers (e.g., `iframe:open`, `filebrowser:copy`)
- **Argument inspection** - Displays command arguments extracted from the application in realtime
- **Searchable list** - Filter commands by name or description

## Requirements

- JupyterLab >= 4.0.0

## Installation

```bash
make install
```

Or via pip:

```bash
pip install jupyterlab_show_commands_reference_extension
```

## Uninstall

```bash
pip uninstall jupyterlab_show_commands_reference_extension
```
