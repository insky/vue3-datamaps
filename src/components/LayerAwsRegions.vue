<template>
    <g class="bubbles-aws-regions" v-if="projection">
      <g class="circle-group" v-for="(item, index) in filterdData" :key="`${index}-group`">
        <circle class="circle-inner" :class="useClass(item)"
          :cx="latLng(item.coordinates)[0]"
          :cy="latLng(item.coordinates)[1]"
          :r="4"
          :style="innerStyles(item, index)"
        >
          <animate attributeName="r" begin="200ms" dur="600ms" from="0" to="3"></animate>
        </circle>
        <circle class="circle-outer" :class="useClass(item)"
          :cx="latLng(item.coordinates)[0]"
          :cy="latLng(item.coordinates)[1]"
          :r="6"
          :style="outerStyles(item, index)"
          @mouseover="handleMouseOver($event, item)"
          @mouseout="handleMouseOut"
          @click="$emit('click:aws-region', item)"
        >
          <animate attributeName="r" begin="200ms" dur="600ms" from="0" to="11"></animate>
        </circle>
      </g>
    </g>
</template>

<script>
import { val, regions } from '@/utils/helper';

export default {
    name: 'layer-aws-regions',
    props: [ 'awsRegionsConfig', 'path', 'projection', 'data' ],
    data () {
        return {
        }
    },
    computed: {
        options () {
            return this.awsRegionsConfig
        },
        regionData () {
            return this.options.region || regions
        },
        activeKeys () {
            return this.options.data.map(item => item.code)
        },
        filterdData () {
            const publicFilter = region => region.public
            const activeFiltre = region => region.coordinates && this.activeKeys.includes(region.code)
            const regionData = this.options.showPrivateRegions ? this.regionData : this.regionData.filter(publicFilter)
            return regionData.filter(activeFiltre).map(region => {
                return {
                    ...region,
                    ...this.awsRegionsData[region.code]
                }
            })
        },
        awsRegionsData () {
            return this.options.data.reduce((accumulator, currentValue) => {
                accumulator[currentValue.code] = currentValue
                return accumulator
            }, {})
        }
    },
    methods: {
        useClass (datum) {
            return {
                use: !!this.awsRegionsData[datum.code]
            }
        },
        innerStyles (datum) {
            return {
                stroke: datum.color || val(datum.borderColor, this.options.borderColor, datum),
                strokeWidth: val(datum.borderWidth, this.options.borderWidth, datum),
                fill: datum.color || this.options.fills[val(datum.fillKey, this.options.fillKey, datum)] || 'transparent',
                fillOpacity: val(datum.borderOpacity, this.options.borderOpacity, datum)
            }
        },
        outerStyles (datum) {
            return {
                stroke: this.options.borderColor || datum.color || val(datum.borderColor, this.options.borderColor, datum),
                strokeWidth: val(datum.borderWidth, this.options.borderWidth, datum),
                fill: 'transparent',
                fillOpacity: val(datum.borderOpacity, this.options.borderOpacity, datum)
            }
        },
        latLngToXY (lat, lng) {
            return this.projection([ lng, lat ])
        },
        latLng (datum) {
            return this.latLngToXY(datum.latitude, datum.longitude)
        },
        handleMouseOver (event, datum) {
            if (this.options.popupOnHover) this.$emit('show:popup', { event, datum })
        },
        handleMouseOut () {
            if (this.options.popupOnHover) this.$emit('hide:popup')
        }

    }
}
</script>
