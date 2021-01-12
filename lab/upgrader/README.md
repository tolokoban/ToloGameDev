# Upgrader

This is a node script `upgrader.js` that you compile from the typescript `upgrader.ts` with the following command:

```bash
npm start
```

This upgrader needs two parameters:

* The local path of the application code.
* The URL of the sources (for example: [https://tolokoban.github.io/web-soins-consultations](https://tolokoban.github.io/web-soins-consultations)

## How does it work?

Lets call `path` the first command line argument and `url` the second.

1. Load `${path}/package.txt` as LOCAL
2. If LOCAL is empty then...
    1. perform a full download into `_PACKAGE_/` by getting all the files listed in `${url}/package.txt`.
3. If there is a folder `_PACKAGE_` in `path` then...
    1. Load the file `_PACKAGE_/package.txt`
    2. Remove every file/folder from `path`
    3. Copy all files listed in `_PACKAGE_/package.txt` from `_PACKAGE_/` to `path`
    4. Remove every file/folder from `_PACKAGE_/`
4. Starting the application found in `path`
5. Download `${url}/package.txt` as REMOTE
4. For each file listed in REMOTE do...
    1. If the sha256 in LOCAL is the same, then...
        1. Copy the file from `path` to `_PACKAGE_`
    2. Else...
        1. Copy the file from `url` to `_PACKAGE_`