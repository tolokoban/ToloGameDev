# Toloframework Theming - Colors

## Colors categories

### Background and surface

* __`0`__: Background color.
* __`1`__: Surface color.
* __`2`__: Floating surface color.
* __`3`__: Text input color.

### Primary colors

A primary color is the color displayed most frequently across your app's screens and components.  
Used in buttons, headers, ...

* __`P`__: Primary.
* __`PD`__: Primary Dark.
* __`PL`__: Primary Light.

### Secondary colors

A secondary color provides more ways to accent and distinguish your product. Having a secondary color is optional, and should be applied sparingly to accent select parts of your UI.  
Secondary colors are best for:
_floating action buttons_,
_selection controls, like sliders and switches_,
_highlighting selected text_,
_progress bars_,
_links and headlines_, ...

* __`S`__: Secondary.
* __`SD`__: Secondary Dark.
* __`SL`__: Secondary Light.

### Error, Black and White

* __`E`__: Error.
* __`B`__: Black. Used when you need a __dark__ color for text and icons.
* __`W`__: White. Used when you need a __light__ color for text and icons.

## "On" colors

You will need to know what color to use for text and icons that are over another color.  
On dark background, you need White color and on light one, you need Black color.

This is achieved by adding the prefix __`on`__ before the color category.

## Transparency

You can adjust the alpha component of each color by adding one of the following suffixes: `1`, ..., `9`, `A`, ..., `E`.

## CSS variables

Each theme computes its own CSS variables. The name of such a color variable matches this regular expression:  
`--thm-color-(on-)?(0|1|2|3|PL|P|PD|SL|S|SD|E|B|W)(-[1-9A-E])?`

Here are few examples:

* __`--thm-color-0`__: Background color.
* __`--thm-color-PD`__: Primary dark.
* __`--thm-color-PD-B`__: Primary color with 11 / 15 ~ __73 %__ of opacity.
* __`--thm-color-on-SL-E`__: Color to use over a background in Secondary Light color. The resulting color will have an opacity of 14 / 15 ~ __93 %__.
* __`--thm-color-on-E-E`__: Color to use over a background in Error color. The resulting color will have an opacity of 14 / 15 ~ __93 %__.

----

[Back](page:../theme)
