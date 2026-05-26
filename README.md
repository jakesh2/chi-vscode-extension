# ChiLang VS Code Extension

VS Code support for `.chi` files used by the ChiLang programming language.

ChiLang is a Chichewa-inspired programming language designed to make programming more accessible while maintaining modern programming capabilities and Python interoperability.

---

# Features

## Syntax Highlighting

The extension provides syntax highlighting for:

- Chi keywords
- Built-in functions
- Operators
- Strings
- Numbers
- Comments
- Functions
- Constants
- Exception handling blocks

Supported keywords include:

```chi
ika
ngati
kapena_ngati
sizoona
bwereza
yesani
panga
bweza
kuyesera
zakanika
pitilizani
siyani
```

---

## Intelligent Autocomplete

Autocomplete support includes:

* Chi keywords
* Built-in functions
* Constants
* Exception types
* Methods
* File-aware variable suggestions
* File-aware function suggestions

Variables declared using:

```chi
ika dzina = "ChiLang"
```

and functions declared using:

```chi
panga moni():
    onetsa("Moni")
```

automatically appear in suggestions.

---

## Snippets

Quick snippets are included for common ChiLang structures.

Examples:

### Variable

```chi
ika dzina = ""
```

### If Statement

```chi
ngati condition:
    onetsa("zoona")
```

### Loop

```chi
bwereza item mu zinthu:
    onetsa(item)
```

### Function

```chi
panga moni():
    onetsa("Moni")
```

### Exception Handling

```chi
kuyesera:
    onetsa("Testing")
zakanika:
    onetsa("Error")
```

---

## Auto Indentation

Automatic indentation is supported for both Chi block styles:

### Colon Style

```chi
ngati zoona:
    onetsa("Moni")
```

### `chita` Style

```chi
ngati zoona chita
    onetsa("Moni")
mathero
```

---

## Run and Translation Tools

Integrated commands allow you to:

* Run ChiLang programs
* Translate ChiLang to Python
* Translate Python to ChiLang
* Cancel running processes

Editor and status bar buttons include:

* `Run Chi`
* `Translate Chi`
* `Cancel Chi`

---

# Requirements

You must install the ChiLang command line interface separately.

Please follow the installation instructions for your operating system on the ChiLang website:

[https://chi.yazaai.tech/](https://chi.yazaai.tech/)

After installation, follow the website guidance to ensure the `chi` command is available on your system `PATH`.

---

Note for Windows users: if you already have VS Code installed, the ChiLang Windows installer (or the ChiLang website) may offer to install the VS Code extension alongside ChiLang. The extension can also be installed independently from the Visual Studio Marketplace, the ChiLang website, or on GitHub repository releases.


# Supported Commands

The extension uses the official ChiLang CLI commands.

## Run a ChiLang Program

```bash
chi run file.chi
```

## Start Interactive REPL

```bash
chi repl
```

## Execute Inline Code

```bash
chi exec 'onetsa("Moni dziko!")'
```

## Translate ChiLang to Python

```bash
chi translate file.chi --from chi --to python --output file.py
```

## Translate Python to ChiLang

```bash
chi translate file.py --from python --to chi --output file.chi
```

---

# Usage

Open any `.chi` file in VS Code.

The extension automatically activates and provides:

* Syntax highlighting
* Autocomplete
* Snippets
* Run buttons
* Translation tools

---

# Keyboard Shortcuts

Run the current ChiLang file:

```text
Ctrl + Alt + R
```

Additional shortcuts may be added in future updates.

---

# Example Program

```chi
ika dzina = "Duncan"

panga moni(name):
    onetsa("Moni", name)

moni(dzina)
```

---

# Example Translation

## ChiLang

```chi
ika x = 10

ngati x wapambana 5:
    onetsa("Large")
```

## Python Output

```python
x = 10

if x > 5:
    print("Large")
```

---

# File Extensions

Supported file extensions:

```text
.chi
```

---

# Educational Focus

ChiLang was designed to help make programming more accessible to Chichewa speakers and beginners learning computational thinking.

The language combines:

* Familiar Chichewa-inspired syntax
* Modern programming concepts
* Python interoperability
* Educational simplicity
* Beginner-friendly structure

---

# Roadmap

Planned future features include:

* Debugging support
* Code formatting
* Linting
* Error diagnostics
* Hover documentation
* Integrated tutorials
* Language server support (LSP)
* Jupyter notebook integration

---

# Troubleshooting

## `chi` Command Not Found

If the extension cannot find the `chi` command:

1. Ensure ChiLang is installed:

2. Verify installation:

```bash
chi --version
```

3. Restart VS Code.

4. Ensure Python Scripts directory is added to your system `PATH`.

---

# Contributing

Contributions, suggestions, and feedback are welcome.

Areas open for contribution:

* Snippets
* Language grammar
* Themes
* Documentation
* Testing
* Educational examples

---

# About ChiLang

ChiLang is a Chichewa-inspired programming language focused on accessibility, education, and computational thinking.

It is part of the broader YazaAI initiative focused on African-centered educational technologies.

---

# License

Apache License 2.0

---

# Author

Duncan Masiye

* Email: [duncanmasiye16@gmail.com](mailto:duncanmasiye16@gmail.com)

---

# Links

## PyPI

[https://pypi.org/project/chi-lang/](https://pypi.org/project/chi-lang/)

## TikTok

[https://www.tiktok.com/@chichewa.programming](https://www.tiktok.com/@chichewa.programming)

## YouTube

[https://youtube.com/@duncanmasiye7113](https://youtube.com/@duncanmasiye7113)

---

## Website

[https://chi.yazaai.tech/](https://chi.yazaai.tech/)

## GitHub

[https://github.com/jakesh2/chi-vscode-extension](https://github.com/jakesh2/chi-vscode-extension)

## Publisher

[https://yazaai.tech/](https://yazaai.tech/)


# Acknowledgement

Thank you to everyone supporting programming accessibility and African language technology initiatives.


