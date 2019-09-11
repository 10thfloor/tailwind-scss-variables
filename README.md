# tailwind-scss-variables
A TailwindCSS plugin to generate SCSS variables based on your Tailwind config

## Installation/Usage
```
plugins: [
    require('tailwind-scss-variables')(['theme.colors', 'theme.screens'], './src/scss/partials/_tailwind-variables.scss')
],
```
First param is an array of config options you'd like included in the file, second param is a string for the location of the variables file.

The only default included config option is `theme.screens`.

## Why?
I like SCSS variables
