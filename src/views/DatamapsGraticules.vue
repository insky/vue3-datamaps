<template>
    <div>
        <h4>Projections & Graticules:</h4>
        <vue-datamaps
            :projection="projection"
            :projectionConfig="projectionConfig"
            :fills="fills"
            :data="data"
            :arcConfig="arcConfig"
            arc
        />
    </div>
</template>

<script>
import { VueDatamaps } from '../';
import * as d3 from 'd3';

export default {
    components: {
        VueDatamaps
    },
    data () {
        return {
            projection: 'Orthographic',
            fills: {
                defaultFill: '#ABDDA4',
                gt50: d3.schemeCategory10[Math.floor(Math.random() * 20)],
                eq50: d3.schemeCategory10[Math.floor(Math.random() * 20)],
                lt25: d3.schemeCategory10[Math.floor(Math.random() * 20)],
                gt75: d3.schemeCategory10[Math.floor(Math.random() * 20)],
                lt50: d3.schemeCategory10[Math.floor(Math.random() * 10)],
                eq0: d3.schemeCategory10[Math.floor(Math.random() * 1)],
                pink: '#0fa0fa',
                gt500: d3.schemeCategory10[Math.floor(Math.random() * 1)]
            },
            data: {
                'USA': { fillKey: 'lt50' },
                'MEX': { fillKey: 'lt25' },
                'CAN': { fillKey: 'gt50' },
                'GTM': { fillKey: 'gt500' },
                'HND': { fillKey: 'eq50' },
                'BLZ': { fillKey: 'pink' },
                'GRL': { fillKey: 'eq0' }
            },
            projectionConfig: {
                rotation: [ 97, -30 ]
            },
            arcConfig: {
                popupOnHover: false,
                data: [
                    {
                        origin: {
                            latitude: 61,
                            longitude: -149
                        },
                        destination: {
                            latitude: -22,
                            longitude: -43
                        }
                    }
                ],
                greatArc: true,
                animationSpeed: 2000
            }
        }
    }
}
</script>
