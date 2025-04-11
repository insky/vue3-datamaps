# Vue Datamaps

It is a Vue 3 port of the [Vue port](https://github.com/Seungwoo321/vue-datamaps) of the javascript-based [DataMaps](https://datamaps.github.io/)

![npm version](https://img.shields.io/npm/v/vue3-datamaps.svg)
![npm license](https://img.shields.io/npm/l/vue3-datamaps.svg)
![npm downloads](https://img.shields.io/npm/dm/vue3-datamaps.svg)

## Live demo

[link](https://insky.github.io/vue3-datamaps/)

## Run demo

```bash
# project clone
$ git clone https://github.com/insky/vue3-datamaps.git 

# install dependencies
$ npm install

# run
$ npm run dev
```

## Installation

```bash
# install
$ npm install vue3-datamaps
```

## Base Usage

### Required

* json data is no longer required.
* CSS styles must be imported separately

#### Global

main.js

```js
import { createApp } from 'vue'
import VueDatamaps from 'vue3-datamaps'
import 'vue3-datamaps/style.css'

const app = createApp(App)
app.use(VueDatamaps)
app.mount('#app')
```

vue template

```vue
<template>
    <div id="app">
        <vue-datamaps />
    </div>
</template>
```

#### Component Style

vue template

```vue
<template>
    <div id="app">
        <vue-datamaps />
    </div>
</template>
<script setup>
import { VueDatamaps } from 'vue3-datamaps'
import 'vue3-datamaps/style.css'
</script>
```

## Example

```vue
<template>
  <div>
    <h4>Basic:</h4>
    <vue-datamaps />
  </div>
</template>

<script setup>
import { VueDatamaps } from 'vue3-datamaps'
</script>

```

## Available Props Option

### scope

* type: __String__
* value: __world__, __usa__, __custom_map__

Same as the original.

### setProjection

* type: __Function__
* value: __See sample code.__

Same as original but d3 version different.

### projection

* type: __String__
* value: __Equirectangular__, __Orthographic__, __Mercator__

Same as original but PascalCase.

### dataType

* type: __String__
* value __json__, __csv__

Same as original.

### data

* type: __Object__
* value: __See sample code.__

Same as original.

### done

* type: __Function__

Not implemented.

### fills

* type: Object
* value: __The keys in this object map to the "fillKey" of [data] or [data of bubbles]__

Same as original.

### geographyConfig

* type: __Object__
* value: __See sample code.__

Same as original but not include `popupTemplate`.

### bubblesConfig

* type: __Object__
* value: __See sample code.__

Same as original but not include `popupTemplate`.

### bubbles

* type: __Boolean__
* value: __true__, __false__
If `bubblesConfig` required.

### arcConfig

* type: __Object__
* value: __See sample code.__

Same as original but not include `popupTemplate`.

### arc

* type: __Boolean__
* value: __true__, __false__

If `arcConfig` required.

### disableDefaultStyles

* type: __Boolean__
* value: __true__, __false__

Not implemented.

### labelsConfig

* type: __Object__
* value: __See sample code.__

Same as original.

### labels

* type: __Boolean__
* value: __true__, __false__

If `labelsConfig` required.

### popupTemplate

* type: __Boolean__
* value: __true__, __false__

If slot `hoverinfo` and event `custom:popup`||`custom:popup-bubble`||`custom:popup-arc`||`custom:popup-region`|| required.

## Default Props Option

```js
{
  scope: 'world',
  setProjection: (d3, element) => {
    let projection = null
    let path = null
    if (this.scope === 'usa') {
        projection = d3.geoAlbersUsa()
            .scale(this.svgWidth)
            .translate([this.svgWidth / 2, this.svgHeight / 2])
    } else if (this.scope === 'world') {
        projection = d3[`geo${this.projection}`]()
            .scale((this.svgWidth + 1) / 2 / Math.PI)
            .translate([this.svgWidth / 2, this.svgHeight / (this.projection === 'Mercator' ? 1.45 : 1.8)])
    }
    if (this.projection === 'Orthographic') {
        this.svg.append('defs').append('path')
            .datum({ type: 'Sphere' })
            .attr('id', 'sphere')
            .attr('d', path)

        this.svg.append('use')
            .attr('class', 'stroke')
            .attr('xlink:href', '#sphere')

        this.svg.append('use')
            .attr('class', 'fill')
            .attr('xlink:href', '#sphere')
        projection.scale(this.svgWidth / Math.PI * 0.9).clipAngle(90).rotate(this.projectionConfigOptions.rotation)
    }

    path = d3.geoPath()
        .projection(projection)
    return { projection, path }
  },
  projection: 'Equirectangular',
  dataType: 'json',
  data: {},
  done: function () {
    return {}
  },
  fills: {
    authorHasTraveledTo: '#fa0fa0',
    defaultFill: '#ABDDA4'
  },
  geographyConfig: {
    dataUrl: null,
    hideAntarctica: true,
    hideHawaiiAndAlaska: false,
    borderWidth: 1,
    borderOpacity: 1,
    borderColor: '#FDFDFD',
    popupOnHover: true,
    highlightOnHover: true,
    highlightFillColor: '#FC8D59',
    highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
    highlightBorderWidth: 2,
    highlightBorderOpacity: 1,
    highlightFillOpacity: 0.85
  },
  projectionConfig: {
    rotation: [97, 0]
  },
  bubblesConfig: {
    borderWidth: 2,
    borderOpacity: 1,
    borderColor: '#FFFFFF',
    popupOnHover: true,
    radius: null,
    fillOpacity: 0.75,
    animate: true,
    highlightOnHover: true,
    highlightFillColor: '#FC8D59',
    highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
    highlightBorderWidth: 2,
    highlightBorderOpacity: 1,
    highlightFillOpacity: 0.85,
    exitDelay: 100,
    key: JSON.stringify,
    data: []
  },
  bubbles: false,
  arcConfig: {
    strokeColor: '#DD1C77',
    strokeWidth: 1,
    arcSharpness: 1,
    animationSpeed: 600,
    popupOnHover: false,
    data: []
  },
  arc: false,
  disableDefaultStyles: false,
  labelsConfig: {
    fontSize: 10,
    fontFamily: 'Verdana',
    labelColor: '#000',
    lineWidth: 1
  },
  labels: false,
  popupTemplate: false,
  awsRegions: false,
  awsRegionsConfig: {
    strokeColor: '#0b5fd6',
    strokeWidth: 1.5,
    defaultFill: 'transparent',
    highlightFillOpacity: 1,
    showPrivateRegions: false,
    popupOnHover: false,
    data: []
  }
}

```

## Slot & Event for @mouseover

* when geography mouse hover:
  * slot: `hoverinfo`
  * event: `custom:popup`

```html
  <template #hoverinfo>
    <div class="hoverinfo" style="text-align:center;">
      <!-- ... -->
    </div>
  </template>
```

* when bubbles mouse hover:
  * slot: `hoverBubbleInfo`
  * event: `custom:popup-bubble`

```html
  <template #hoverBubbleInfo>
    <div class="hoverinfo" style="text-align:center;">
      <!-- ... -->
    </div>
  </template>
```

* when arc mouse hover:
  * slot: `hoverArcInfo`
  * event: `custom:popup-arc`

```html
  <template #hoverArcInfo>
    <div class="hoverinfo" style="text-align:center;">
      <!-- ... -->
    </div>
  </template>
```

* when aws-region mouse hover

  * slot: `hoverRegionInfo`
  * event: `custom:popup-region`

```html
  <template #hoverRegionInfo>
    <div class="hoverinfo" style="text-align:center;">
      <!-- ... -->
    </div>
  </template>
```

## Inspired

* [markmarkoh/datamaps](https://datamaps.github.io/) - original
* [Seungwoo321/vue-datamaps](https://github.com/Seungwoo321/vue-datamaps) - Vue 2 port

## License

MIT
