<template>
    <div>
        <h4>Custom Color:</h4>
        <vue-datamaps
            scope="world"
            :fills="fills"
            :data="data"
            :geographyConfig="geographyConfig"
            bubbles
            :bubblesConfig="bubblesConfig"
        />
    </div>
</template>

<script>
import { VueDatamaps } from '../';

export default {
    components: {
        VueDatamaps
    },
    data () {
        return {
            bubblesConfig: {
                data: [
                    {
                        name: 'Area 1',
                        radius: 23,
                        centered: 'BRA'
                    },
                    {
                        name: 'Area 2',
                        radius: 15,
                        centered: 'USA'
                    },
                    {
                        name: 'Area 3',
                        radius: 50,
                        latitude: 73.482,
                        longitude: 54.5854
                    }
                ],
                highlightBorderColor: '#FFFFFF',
                highlightFillColor: '#F8A900'
            },
            geographyConfig: {
                popupOnHover: false,
                highlightOnHover: false,
                borderWidth: 0
            },
            data: {
                USA: { fillKey: 'active' },
                RUS: { fillKey: 'active' },
                DEU: { fillKey: 'active' },
                BRA: { fillKey: 'active' }
            },
            fills: {
                defaultFill: '#3B3D46',
                active: '#F8A900'
            }
        }
    }
}
</script>
