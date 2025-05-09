<template>
  <div class="map">
    <svg ref="svg" class="datamap">
      <g>
        <path v-for="(item, index) in pathData" :key="index"
          :d="pathAndProjection.path(item)"
          :class="`datamaps-styleAttributes ${item.id || item.properties.code_hasc}`"
          :fill="fillColor(item)"
          :style="pathStyle(item)"
          @mouseover="handleMouseOver($event, item)"
          @mouseout="handleMouseOut($event, item)"
        />
      </g>
      <layer-label
        v-if="labels && pathData.length > 0"
        :labelsConfig="labelsConfigOptions"
        :data="pathData"
        :projection="pathAndProjection.projection"
        :path="pathAndProjection.path"
      />
      <layer-arc
        v-if="arc && pathData.length > 0"
        :arcConfig="propsData.arcConfig"
        :data="propsData.arcGeoData"
        :projection="pathAndProjection.projection"
        :path="pathAndProjection.path"
        :awsRegions="awsRegions"
        @show:popup="showPopupArc"
        @hide:popup="hidePopup"
      />
      <layer-aws-regions
        v-if="awsRegions"
        :awsRegionsConfig="awsRegionsConfigOptions"
        :projection="pathAndProjection.projection"
        :path="pathAndProjection.path"
        :data="awsRegionData"
        @show:popup="showPopupRegion"
        @hide:popup="hidePopup"
        @click:aws-region="handleAwsClickCallback"
      />
      <layer-bubble
        v-if="bubbles && pathData.length > 0"
        :bubblesConfig="propsData.bubblesConfig"
        :data="propsData.bubbleGeoData"
        :projection="pathAndProjection.projection"
        :path="pathAndProjection.path"
        @click:bubble="handleClickCallback"
        @show:popup="showPopupBubble"
        @hide:popup="hidePopup"
      />
    </svg>
    <div v-if="isPopupOn || true"
      class="datamaps-hoverover"
      style="z-index:10001;position:absolute"
      :style="popupPosition"
    >
      <slot v-if="showHoverInfo" name="hoverinfo"></slot>
      <slot name="hoverBubbleInfo" v-if="showHoverBubbleInfo"></slot>
      <slot name="hoverArcInfo" v-if="showHoverArcInfo"></slot>
      <slot name="hoverRegionInfo" v-if="showHoverRegionInfo"></slot>
    </div>
  </div>
</template>
<script>
import * as d3 from 'd3';
import props from '@/utils/props';
import { val, regions } from '@/utils/helper';
import LayerLabel from './LayerLabel.vue';
import LayerBubble from './LayerBubble.vue';
import LayerArc from './LayerArc.vue';
import LayerAwsRegions from './LayerAwsRegions.vue';
import * as topojson from 'topojson-client';
import topology from '@/utils/topology.js';

export default {
  name: 'vue-datamaps',
  components: {
    LayerLabel,
    LayerBubble,
    LayerArc,
    LayerAwsRegions
  },
  data() {
    return {
      geoData: {},
      setProjectionData: {
        path: null,
        projection: null
      },
      showHoverInfo: false,
      showHoverBubbleInfo: false,
      showHoverArcInfo: false,
      showHoverRegionInfo: false,
      popupText: {
        title: '',
        name: '',
        origin: '',
        destination: '',
        value: ''
      },
      popupPosition: {},
      viewbox: {
        width: 0,
        height: 0
      },
      pathData: [],
      bubbleGeoData: {},
      awsRegionData: {},
      arcGeoData: {},
      styleAttributes: {},
      previousAttributes: {},
      propsData: {
        arcConfig: {},
        arcGeoData: {},
        bubblesConfig: {},
        bubbleGeoData: {}
      }
    };
  },
  mixins: [ props ],
  props: {
    width: {
      type: Number,
      default: 750
    },
    height: {
      type: Number,
      default: 500
    }
  },
  computed: {
    regions() {
      return (this.awsRegionsConfig && this.awsRegionsConfig.region) || regions;
    },
    isPopupOn() {
      return (this.geographyConfigOptions.popupOnHover || this.bubblesConfigOptions.popupOnHover) && (this.showHoverInfo || this.showHoverBubbleInfo || this.showHoverArcInfo || this.showHoverRegionInfo);
    },
    svgWidth: {
      get() {
        return this.viewbox.width;
      },
      set(element) {
        this.viewbox.width = element.getBoundingClientRect().width;
      }
    },
    svgHeight: {
      get() {
        return this.viewbox.height;
      },
      set(element) {
        this.viewbox.height = element.getBoundingClientRect().height;
      }
    },
    pathAndProjection: {
      get() {
        return this.setProjectionData;
      },
      set(element) {
        this.setProjectionData = {
          path: this.setProjection(d3, element).path,
          projection: this.setProjection(d3, element).projection
        };
      }
    }
  },
  mounted() {
    this.resize();
    this.draw();
    window.addEventListener('resize', this.resize);
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.resize);
  },
  methods: {
    pathStyle(item) {
      return this.styleAttributes[item.id || item.properties.code_hasc] || {
        'stroke-width': this.geographyConfigOptions.borderWidth,
        'stroke-opacity': this.geographyConfigOptions.borderOpacity,
        'stroke': this.geographyConfigOptions.borderColor
      };
    },
    handleClickCallback({ event, item, index }) {
      this.$emit('click:bubble', { event, item, index });
    },
    handleAwsClickCallback(item) {
      this.$emit('click:aws-region', item);
    },
    resize() {
      this.svgWidth = this.$el;
      this.svgHeight = this.$el;
      this.pathAndProjection = this.$el;
    },
    fillColor(d) {
      let { data, fills, defaultFill } = this;
      fills = { defaultFill, ...fills };
      const datum = data[d.id || d.properties.code_hasc];
      let color;
      if (datum && datum.fillKey) {
        color = fills[val(datum.fillKey, { data: data[d.id || d.properties.code_hasc], geography: d })];
      }
      if (typeof color === 'undefined') {
        color = val(datum && datum.fillColor, fills.defaultFill, { data: data[d.id || d.properties.code_hasc], geography: d });
      }
      return color;
    },
    draw() {
      if (this.geographyConfigOptions.dataUrl && this.dataType === 'csv' && (this.geoData && this.geoData.slice)) {
        let tmpData = {};
        this.geoData.forEach(() => item => { tmpData[item.id || item.properties.code_hasc] = item; });
        this.geoData = tmpData;
        this.drawSubunits(this.geoData);
      } else if (this.geographyConfigOptions.dataUrl && this.dataType !== 'csv') {
        fetch(this.geographyConfigOptions.dataUrl).then(response => {
          return response.json();
        }).then(result => {
          this.geoData = result;
          this.drawSubunits(this.geoData);
        });
      } else {
        const topoJsonData = JSON.parse(topology[`${this.scope}Topo`]);
        this.geoData = topojson.feature(topoJsonData, topoJsonData.objects[this.scope]);
        this.drawSubunits(this.geoData);
      }
    },
    drawSubunits(data) {
      if (this.geographyConfigOptions.hideAntarctica) {
        this.pathData = data.features.filter(function(feature) {
          return feature.id !== 'ATA';
        });
      }
      if (this.geographyConfigOptions.hideHawaiiAndAlaska) {
        this.pathData = data.features.filter(function(feature) {
          return feature.id !== 'HI' && feature.id !== 'AK';
        });
      }

      if (this.bubbles && this.bubblesConfigOptions.data) {
        const filters = this.bubblesConfigOptions.data.filter(item => item.centered || item.region).map(item => item.centered || item.region);
        this.bubbleGeoData = data.features.reduce((previousValue, currentValue) => {
          if (filters.includes(currentValue.id)) {
            previousValue[currentValue.id] = currentValue;
          }
          return previousValue;
        }, {});
        this.awsRegionData = this.regions.reduce((previousValue, currentValue) => {
          if (filters.includes(currentValue.key)) {
            previousValue[currentValue.key] = currentValue;
          }
          return previousValue;
        }, {});
        this.propsData.bubbleGeoData = { ...this.bubbleGeoData, ...this.awsRegionData };
        this.propsData.bubblesConfig = this.bubblesConfigOptions;
      }
      if (this.arc && this.arcConfigOptions.data) {
        const filtered = this.arcConfigOptions.data.filter(item => typeof item.origin === 'string' || typeof item.destination === 'string');
        const filters = new Set([ ...filtered.map(item => item.origin), ...filtered.map(item => item.destination) ]);

        this.arcGeoData = data.features.reduce((previousValue, currentValue) => {
          if (filters.has(currentValue.id)) {
            previousValue[currentValue.id] = currentValue;
          }
          return previousValue;
        }, {});

        this.awsRegionData = this.regions.reduce((previousValue, currentValue) => {
          if (filters.has(currentValue.code)) {
            previousValue[currentValue.code] = currentValue;
          } else if (filters.has(currentValue.key)) {
            previousValue[currentValue.key] = currentValue;
          }
          return previousValue;
        }, {});
        this.propsData.arcConfig = this.arcConfigOptions;
        this.propsData.arcGeoData = { ...this.arcGeoData, ...this.awsRegionData };
      }
    },
    handleMouseOver(event, d) {
      const target = event.target;
      const _previousAttributes = {
        'fill': target.style['fill'],
        'stroke': target.style['stroke'],
        'stroke-width': target.style['stroke-width'],
        'fill-opacity': target.style['fill-opacity']
      };
      this.previousAttributes[d.id || d.properties.code_hasc] = _previousAttributes;

      const { highlightOnHover, popupOnHover, highlightFillColor, highlightBorderColor, highlightBorderWidth, highlightBorderOpacity, highlightFillOpacity } = this.geographyConfigOptions;
      const datum = this.data[d.id || d.properties.code_hasc] || {};

      if (highlightOnHover) {
        const data = {
          "fill": val(datum.highlightFillColor, highlightFillColor, datum),
          "stroke": val(datum.highlightBorderColor, highlightBorderColor, datum),
          'stroke-width': val(datum.highlightBorderWidth, highlightBorderWidth, datum),
          'stroke-opacity': val(datum.highlightBorderOpacity, highlightBorderOpacity, datum),
          'fill-opacity': val(datum.highlightFillOpacity, highlightFillOpacity, datum)
        };
        this.styleAttributes[d.id || d.properties.code_hasc] = data;
      }
      if (popupOnHover) this.showPopup({ event, geography: d, datum: this.data[d.id || d.properties.code_hasc] });
    },
    handleMouseOut(event, d) {
      const { highlightOnHover, popupOnHover } = this.geographyConfigOptions;
      if (highlightOnHover || popupOnHover) {
        const data = this.previousAttributes[d.id || d.properties.code_hasc];
        this.styleAttributes[d.id || d.properties.code_hasc] = data;
      }
      if (popupOnHover) this.hidePopup();
    },
    showPopup({ event, geography, datum }) {
      this.popupPosition = {
        left: `${event.layerX}px`,
        top: `${event.layerY + 30}px`
      };
      if (this.popupTemplate) {
        this.$emit('custom:popup', { geography, datum });
      } else {
        this.popupText.title = geography.properties.name;
      }
      this.showHoverInfo = true;
    },
    hidePopup() {
      this.showHoverInfo = false;
      this.showHoverBubbleInfo = false;
      this.showHoverArcInfo = false;
      this.showHoverRegionInfo = false;
    },
    showPopupBubble({ event, datum }) {
      this.popupPosition = {
        left: `${event.layerX}px`,
        top: `${event.layerY + 30}px`
      };
      if (this.bubblesConfigOptions.popupTemplate) {
        this.$emit('custom:popup-bubble', { datum });
      } else {
        this.popupText.title = datum.name;
      }
      this.showHoverBubbleInfo = true;
    },
    showPopupRegion({ event, datum }) {
      this.popupPosition = {
        left: `${event.layerX}px`,
        top: `${event.layerY + 30}px`
      };
      if (this.awsRegionsConfigOptions.popupTemplate) {
        this.$emit('custom:popup-region', { datum });
      } else {
        this.popupText.title = datum.full_name;
      }
      this.showHoverRegionInfo = true;
    },
    showPopupArc({ event, datum, origin, destination }) {
      this.popupPosition = {
        left: `${event.layerX}px`,
        top: `${event.layerY + 30}px`
      };
      if (this.arcConfigOptions.popupTemplate) {
        this.$emit('custom:popup-arc', { origin, destination });
      } else {
        this.popupText.title = 'Arc';
        this.popupText.origin = origin ? origin.name || origin.properties.name : `Lat Long (${datum.origin.latitude}, ${datum.origin.longitude})`;
        this.popupText.destination = destination ? destination.name || destination.properties.name : `Lat Long (${datum.destination.latitude}, ${datum.destination.longitude})`;
        this.popupText.value = datum.value;
      }
      this.showHoverArcInfo = true;
    }
  },
  watch: {
    awsRegionsConfig: {
      handler() {
        this.draw();
      },
      deep: true
    },
    bubblesConfig: {
      handler() {
        this.draw();
      },
      deep: true
    }
  }
};
</script>

<style>
.map {
  height: 0;
  width: 100%;
  padding-top: 66.66%;
  position: relative;
}
.datamap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.datamap path.datamaps-graticule {
  fill: none;
  stroke: #777;
  stroke-width: 0.5px;
  stroke-opacity: .5;
  pointer-events: none;
}
.datamap .labels {
  pointer-events: none;
}
.datamaps-legend dt, .datamaps-legend dd {
  float: left;
  margin: 0 3px 0 0;
}
.datamaps-legend dd {
  width: 20px;
  margin-right: 6px;
  border-radius: 3px;
}
.datamaps-legend {
  padding-bottom: 20px;
  z-index: 1001;
  position: absolute;
  left: 4px;
  font-size: 12px;
}
.datamaps-hoverover {
  font-size: 12px;
}
.hoverinfo {
  padding: 4px;
  border-radius: 1px;
  background-color: #FFF;
  box-shadow: 1px 1px 5px #CCC;
  font-size: 12px;
  border: 1px solid #CCC;
}
.hoverinfo hr {
  border:1px dotted #CCC;
}
</style>
