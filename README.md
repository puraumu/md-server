# md-server: a markdown rendering server inspired by http-server

`md-server` is a simple, zero-configuration command-line http server. It is simple to be used for viewing README, browsing docs and testing.

## Usage:

     md-server [path] [options]

`[path]` defaults to `./`.

### Starting md-server locally

     node bin/md-server

*Now you can visit http://localhost:8080 to view your server*

## Available Options:

`-p` Port to listen for connections on (defaults to 8080)

`-s` or `--silent` In silent mode, log messages aren't logged to the console.

`-t` ot `--toc` If the request file is markdown, then render with Table of Contents.

`-h` or `--help` Displays a list of commands and exits.