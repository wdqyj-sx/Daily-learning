var img2 = 'image://public/img/kuang.png';
var domImg = document.createElement('img');
domImg.style.height = domImg.height = domImg.width = domImg.style.width = '8px';
domImg.src ='../img/mapbg.png';

var domImgHover = document.createElement('img');
domImgHover.style.height = domImgHover.height = domImgHover.width = domImgHover.style.width = '8px';
domImgHover.src ='../img/mapbg.png'


    //渲染地图
    let mapName = './public/data/geoJson数据包/china.json'
    var myChart = echarts.init(document.getElementById('map'));
    myChart.showLoading('default', {
        text: '统计中，请稍候...',
        maskColor: '#2957A2',
        textColor: '#fff',
    });
    // console.log(domImg)
    // console.log(domImgHover)
    var mapDate = [
        {
            name: '新疆',
            value: [84.9023,
                41.748],
            datas: 1354,
            img: 'image://public/img/0.png',
        },
       
    ];
   

        setTimeout(function () {
            mapInit();
        }, 1000);
    var mapInit = () => {
        $.getJSON(mapName, function (geoJson) {
            // console.log(geoJson)
            echarts.registerMap('china', geoJson);
            myChart.hideLoading();
            option = {
                background: '#2957A2',
                title: {
                    top: 20,
                    text: '全国疫情数据展示',
                    x: 'center',
                    textStyle: {
                        color: '#fff',
                        fontWeight: 100,
                        fontSize: 14
                    }

                },
                geo: {
                    map: 'china',
                    aspectScale: 0.68,
                    layoutCenter: ['49.8%', '50.5%'],
                    layoutSize: '100%',
                    silent: true,
                    roam: true,
                    z: 0,
                    itemStyle: {
                        normal: {
                            areaColor:  `transparent`,
                            shadowColor: 'rgba(0, 0, 0, 1)',
                            shadowBlur: 0,
                            shadowOffsetX: 0,
                            shadowOffsetY: 0,
                            borderColor: 'rgba(0, 0, 0, 0.7)',
                            borderWidth: 0.5,
                        },
                        emphasis: {
                            areaColor: '#2AB8FF',
                            borderWidth: 1,
                            color: 'green',
                            label: {
                                show: false,
                            },
                        },
                    },
                },
                series: [
                    {
                        type: 'map',
                        roam: true,
                        label: {
                            normal: {
                                show: false,
                                textStyle: {
                                    color: '#fff',
                                },
                            },
                            emphasis: {
                                textStyle: {
                                    color: '#fff',
                                },
                            },
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#2ab8ff',
                                borderWidth: 1,
                                areaColor: {
                                    image: domImg,
                                    repeat: 'repeat',
                                },
                                shadowColor: 'rgba(0, 0, 0, 0.5)',
                                shadowBlur: 0,
                                shadowOffsetX: 0,
                                shadowOffsetY: 1,
                            },
                            emphasis: {
                                areaColor: {
                                    image: domImgHover,
                                    repeat: 'repeat',
                                },
                                borderColor: '#2ab8ff',
                                borderWidth: 1,
                                shadowColor: 'rgba(0, 255, 255, 0.7)',
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 1,
                                label: {
                                    show: false,
                                },
                            },
                        },
                        zoom: 1.1,
                        roam: false,
                        map: 'china',
                    },
                    {
                        tooltip: {
                            show: false,
                        },
                        type: 'effectScatter',
                        coordinateSystem: 'geo',
                        rippleEffect: {
                            scale: 10,
                            brushType: 'stroke',
                        },
                        showEffectOn: 'render',
                        itemStyle: {
                            normal: {
                                shadowColor: '#0ff',
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowOffsetY: 0,
                                color: function (params) {
                                    var colorList = [
                                        new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                                            {
                                                offset: 0,
                                                color: '#64fbc5',
                                            },
                                            {
                                                offset: 1,
                                                color: '#018ace',
                                            },
                                        ]),
                                        new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                                            {
                                                offset: 0,
                                                color: '#64fbc5',
                                            },
                                            {
                                                offset: 1,
                                                color: '#018ace',
                                            },
                                        ]),
                                        new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                                            {
                                                offset: 0,
                                                color: '#168e6d',
                                            },
                                            {
                                                offset: 1,
                                                color: '#c78d7b',
                                            },
                                        ]),
                                        new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                                            {
                                                offset: 0,
                                                color: '#61c0f1',
                                            },
                                            {
                                                offset: 1,
                                                color: '#6f2eb6',
                                            },
                                        ]),
                                        new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                                            {
                                                offset: 0,
                                                color: '#168e6d',
                                            },
                                            {
                                                offset: 1,
                                                color: '#c78d7b',
                                            },
                                        ]),
                                        new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                                            {
                                                offset: 0,
                                                color: '#61c0f1',
                                            },
                                            {
                                                offset: 1,
                                                color: '#6f2eb6',
                                            },
                                        ]),
                                    ];
                                    return colorList[params.dataIndex];
                                },
                            },
                        },
                        label: {
                            normal: {
                                color: '#fff',
                            },
                        },
                        symbol: 'circle',
                        symbolSize: [10, 5],
                        data: mapDate,
                        zlevel: 1,
                    },
                    {
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        itemStyle: {
                            color: '#f00',
                        },
                        symbol: function (value, params) {
                            return params.data.img;
                        },
                        symbolSize: [32, 41],
                        symbolOffset: [0, -20],
                        z: 9999,
                        data: mapDate,
                    },
                    {
                        type: 'scatter',
                        coordinateSystem: 'geo',
                        label: {
                            normal: {
                                show: true,
                                formatter: function (params) {
                                    var name = params.name;
                                    var value = params.data.datas;
                                    var text = `{fline|${value}}\n{tline|${name}}`;
                                    return text;
                                },
                                color: '#fff',
                                rich: {
                                    fline: {
                                        padding: [0, 25],
                                        color: '#fff',
                                        textShadowColor: '#030615',
                                        textShadowBlur: '0',
                                        textShadowOffsetX: 1,
                                        textShadowOffsetY: 1,
                                        fontSize: 14,
                                        fontWeight: 400,
                                    },
                                    tline: {
                                        padding: [0, 27],
                                        color: '#ABF8FF',
                                        fontSize: 12,
                                    },
                                },
                            },
                            emphasis: {
                                show: true,
                            },
                        },
                        itemStyle: {
                            color: '#00FFF6',
                        },
                        symbol: img2,
                        symbolSize: [100, 50],
                        symbolOffset: [0, -60],
                        z: 999,
                        data: mapDate,
                    },
                ],
            }
            myChart.setOption(option);
        })
    }

