![download](https://img.shields.io/npm/dm/numerify.svg)
![version](https://img.shields.io/npm/v/numerify.svg)
![Travis](https://img.shields.io/travis/xiguaxigua/numerify.svg)
![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/numerify.svg)
![language](https://img.shields.io/badge/language-javascript-yellow.svg)
![License](https://img.shields.io/badge/license-MIT-000000.svg)

[docs](http://daxigua.me/numerify/) | [demo](http://jsfiddle.net/vue_echarts/fywjmdvL/)

This is a formatted value tool that makes formatting easier and more
convenient to extend.

## Install

`npm i numerify -S`

## Start

### npm

```js
import numerify from 'numerify'
// commonjs package is 'numerify/lib/index.cjs.js'
console.log(numerify(1234, '0,0'))
```

### cdn

```html
<script src="https://unpkg.com/numerify/lib/index.umd.min.js"></script>
<script>
console.log(numerify(1234, '0,0'))
</script>
```

## Format List

| Number | Format | String |
| --: | --: | --: |
| 10000 | '0,0.0000' | 10,000.0000 |
| 10000.23 | '0,0' | 10,000 |
| 10000.23 | '+0,0' | +10,000 |
| -10000 | '0,0.0' | -10,000.0 |
| 10000.1234 | '0.000' | 10000.123 |
| 100.1234 | '00000' | 00100 |
| 1000.1234 | '000000,0' | 001,000 |
| 10 | '000.00' | 010.00 |
| 10000.1234 | '0[.]00000' | 10000.12340 |
| -10000 | '(0,0.0000)' | (10,000.0000) |
| -0.23 | '.00' | -.23 |
| -0.23 | '(.00)' | (.23) |
| 0.23 | '0.00000' | 0.23000 |
| 0.23 | '0.0[0000]' | 0.23 |
| 1230974 | '0.0a' | 1.2m |
| 1460 | '0 a' | 1 k |
| -104000 | '0a' | -104k |
| 1 | '0%' | 100% |
| 0.974878234 | '0.000%' | 97.488% |
| -0.43 | '0 %' | -43 % |
| 0.43 | '(0.000 %)' | 43.000 % |

## Methods

#### numerify(number, formatter, roundFunction)

- formatter default is `'0,0'`
- roundFunction default is `Math.round`

#### numerify.setOptions

this default options is:

```js
{
  zeroFormat: null,
  nullFormat: null,
  defaultFormat: '0,0',
  scalePercentBy100: true,
  abbrLabel: {
    th: 'k',
    mi: 'm',
    bi: 'b',
    tr: 't'
  }
}
```

in order to edit it, you can code such as

```js
numerify.setOptions({
  zeroFormat: 'N/A',
  nullFormat: 'N/A',
  defaultFormat: '0,0',
  scalePercentBy100: true,
  abbrLabel: {
    th: 'k',
    mi: 'm',
    bi: 'B',
    tr: 'T'
  }
})
numerify(0, '0.0') // N/A
```

#### numerify.reset

`numerify.setOptions` will change global settings and you can
use this function to reset options.

#### numerify.register

Adding your own custom formats is as easy as adding a locale.

```js
numerify.register('percentage', {
  regexp: /%/,
  format (value, format, roundingFunction) {
    const space = ~format.indexOf(' %') ? ' ' : ''
    let output

    if (numerify.options.scalePercentBy100) value = value * 100

    format = format.replace(/\s?%/, '')

    output = numerify._numberToFormat(value, format, roundingFunction)

    if (~output.indexOf(')')) {
      output = output.split('')
      output.splice(-1, 0, space + '%')
      output = output.join('')
    } else {
      output = output + space + '%'
    }

    return output
  }
})
```

#### numerify.unregister

remove formatter which has been registed.

```js
numerify.unregister('percentage')
```

#### numerify._numberToFormat

This is an internal function, used to format `()` , ` ,` , `+-` , `kmbt` , `.` and `[]`.

```js
numerify._numberToFormat(<value>, <format>, [roundingFunction])
```

## Plugins

plugins are packaged into `lib/plugins` folder, and you can use it such as:

```js
import numerifyBytes from 'numerify/lib/plugins/bytes.umd.js'
numerify.register('bytes', numerifyBytes)
```

plugins types and usage are as follows:

#### bps

| Number | Format | String |
| --: | --: | --: |
| 0 | '0 BPS' | 0 BPS |
| 0.0001 | '0 BPS' | 1 BPS |
| .0056 | '0 BPS' | 56 BPS |
| .25 | '0BPS' | 2500BPS |
| .000001 | '0.00 BPS' | 0.01 BPS |


#### bytes

| Number | Format | String |
| --: | --: | --: |
| 100 | '0b' | 100B |
| 1024 | '0b' | 1KB |
| 2048 | '0 ib' | 2 KiB |
| 3072 | '0.0 b' | 3.1 KB |
| 7884486213 | '0.00b' | 7.88GB |
| 3467479682787 | '0.000 ib' | 3.154 TiB |

#### currency

| Number | Format | String |
| --: | --: | --: |
| 1000.234 | '$0,0.00' | $1,000.23 |
| 1000.2 | '0,0[.]00 $' | 1,000.20 $ |
| 1001 | '$ 0,0[.]00' | $ 1,001 |
| -1000.234 | '($0,0)' | ($1,000) |
| -1000.234 | '$0.00' | -$1000.23 |
| 1230974 | '($ 0.00 a)' | $ 1.23 m |

#### exponential

| Number | Format | String |
| --: | --: | --: |
| 1123456789 | '0,0e+0' | 1e+9 |
| 12398734.202 | '0.00e+0' | 1.24e+7 |
| 0.000123987 | '0.000e+0' | 1.240e-4 |

#### ordinal

| Number | Format | String |
| --: | --: | --: |
| 1 | '0o' | 1st |
| 1 | '0 o' | 1 st |
| 100 | '0o' | 100th |

#### time

| Number | Format | String |
| --: | --: | --: |
| 25 | '00:00:00' | 0:00:25 |
| 238 | '00:00:00' | 0:03:58 |
| 63846 | '00:00:00' | 17:44:06 |

## Difference with numeral

The numeral is a very useful tool, and numerify draws on this thinking. The difference is that numerify focuses on the parts that format values without parsing values, is smaller (12k vs 3k), and performs better.

## License

MIT
