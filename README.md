# Refine

Run preprocessor in C/C++ code in VSCode using GCC.

Got tired of multiple preprocessor line in source code ? Feel lost ? Refine will help you through that in VSCode.

## Features

- Replace `#define`, `#if`, ...

- Put all of dependencies in working directory into one file (i.e `#include "myLib.h"`)

- Running GCC prepocessor with minimal changes to source code

## Requirements

No requirement here, just install and you're done.

## Extension Settings

- `refine-c.enableLanguages`: A list of languages IDs to enable this extension on (any other language except C, C++, Objective-C, Objective-C++ will be automatically rejected)
- `refine-c.refineLanguage`: Specify the language for `gcc`. If 'none' specified, `gcc` will determine and 'refine' your code based on file type.
  > You need to install the proper GCC front-end for the language you choose.

## Known Issues

- Changing `refine-c.enableLanguages` can make Refine failed to run

## Release Notes

### 0.0.2

- Fix bug relate to file path

### 0.0.1

- Initial release
