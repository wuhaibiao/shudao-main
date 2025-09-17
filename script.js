// 创建地图实例 - 3D视角配置
var map = new AMap.Map('map', {
    zoom: 7,  // 调整缩放级别以显示更大范围
    center: [104.0650, 30.6570],  // 成都市中心坐标
    viewMode: '3D',  // 启用3D视角
    pitch: 45,       // 倾斜角度
    rotation: 0,     // 地图旋转角度
    expandZoomRange: true  // 扩展缩放范围
});

// 手动设置前50行的地点经纬度
const manualLocations = {

    '峨眉山': [103.350911, 29.568462000000043],
    '剑阁': [105.5270, 32.2880],
    '明月峡': [105.865182, 32.62229100000003], // 示例坐标
    '重庆': [106.55050600000004, 29.563799000000003],
    '重庆东楼': [106.49383699999998, 29.508229000000014], // 示例坐标
    '成都': [104.0650, 30.6570],
    '江油': [104.7444, 31.7764], // 示例坐标
    '绵阳':[104.679000,31.467801], // 示例坐标
    '宜宾': [104.64298200000007, 28.752408], // 示例坐标
    '眉山':[103.849999,30.076801],
    '西安':[108.940000,34.341101],
    '广元':[105.844000,32.435300],
    '宝鸡':[107.238000,34.363099],
    '遂宁':[105.593001,30.532801],
    '德阳':[104.398000,31.126800],
    '乐山':[103.766001,29.552000],
    '成都市文翁学堂':[103.921111,30.697610],
    '成都市草玄台':[104.370422,30.589439],
    '成都市石犀':[104.058797,30.762929],
    '成都市金花寺':[104.118174,30.777530],
    '泸州':[105.441866,28.87098],
    '咸阳':[108.708999,34.329200],
    '成都市严真观':[104.50379128530994,30.284286463404985],
    '巫山':[107.95024699999999,30.933449999999986],
    '白帝':[109.57458100000008,31.043286999999996],
    '瞿塘峡':[104.06763014134003,30.631421368992992],
    '武侯祠':[104.048001,30.64620200000002],
    '成都市张仪楼':[103.76480805700999,30.672621190498006],
    '成都市万里桥':[104.05016562262995,30.556139090127996],
    '巫峡':[109.87444000000005,31.058993000000015],
    '彭州':[103.93133899999998,30.986094000000005],
    '崇州':[103.66913899999997,30.63128900000001],
    '雅安':[103.01520600000003,29.977872],
    '达州':[107.45199500000001,31.19800300000001],
    '南充':[106.074165,30.815225000000016],
    '成都市龙女祠':[103.53550658821996,30.753824295767007],
    '成都草堂':[104.033774,30.662508000000045],
    '三峡':[111.31738700000005,30.72352600000002],
    // 添加其他地点
};

// 函数：从CSV文件读取数据并创建标记
// 在manualLocations下方添加路线配置
const manualRoutes = [
       // 示例路线1
    ['乐山', '峨眉山'],    // 示例路线2
    ['剑阁', '江油'],
    ['剑阁', '广元'],
    ['江油', '绵阳'],
    ['德阳', '绵阳'],
    ['德阳', '成都市金花寺'],
    ['眉山', '峨眉山'],
    ['成都市万里桥', '眉山'], 
    ['成都市万里桥', '瞿塘峡'],
    ['成都', '瞿塘峡'],
    ['成都', '武侯祠'],
    ['武侯祠', '成都草堂'],
    ['成都市石犀', '成都'],
    ['成都市石犀', '成都市金花寺'],
    ['成都市文翁学堂', '成都草堂'],
    ['成都市文翁学堂', '成都市张仪楼'],
    ['成都市张仪楼', '崇州'],
    ['瞿塘峡', '成都市草玄台'],
    ['成都市草玄台', '成都市严真观'],
    ['崇州', '成都市龙女祠'],
    ['成都市石犀', '彭州'],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],

        // 示例路线3
];

// 在loadMarkersFromCSV函数末尾添加（约第109行）
function loadMarkersFromCSV(url) {
    fetch(url)
        .then(response => response.text())
        .then(data => {
            // 解析CSV数据
            const rows = data.split('\n').map(row => row.split(','));

            // 创建一个对象来存储每个地点的信息
            const locations = {};
            // 记录属于“蜀道”的地点集合（第一列为“是”）
            const shudaoSet = new Set();

            // 跳过标题行
            for (let i = 1; i < rows.length; i++) {
                const [
                    isInShuDao = '', // 是否在蜀道
                    title = '',      // 诗
                    dynasty = '',    // 朝代
                    lifeSpan = '',   // 诗人生卒年
                    year = '',       // 写作时间
                    author = '',     // 作者
                    location = '',   // 描写地点
                    climate1 = '',   // 意象(蜀道元素)-自然-气候
                    climate2 = '',   // 意象(蜀道元素)-自然-气候
                    climate3 = '',   // 意象(蜀道元素)-自然-气候
                    landscape1 = '', // 意象(蜀道元素)-自然-山水
                    landscape2 = '', // 意象(蜀道元素)-自然-山水
                    landscape3 = '', // 意象(蜀道元素)-自然-山水
                    landscape4 = '', // 意象(蜀道元素)-自然-山水
                    biology1 = '',   // 意象(蜀道元素)-自然-生物
                    biology2 = '',   // 意象(蜀道元素)-自然-生物
                    biology3 = '',   // 意象(蜀道元素)-自然-生物
                    culture1 = '',   // 意象(蜀道元素)-人文-人文景观
                    culture2 = '',   // 意象(蜀道元素)-人文-人文风俗
                    allusion = '',    // 意象(蜀道元素)-典故
                    poemContent = '' // 诗歌内容
                ] = rows[i];

                if (location && location !== '非蜀道') {
                    const locationList = location.split('/');
                    locationList.forEach(loc => {
                        if (!locations[loc]) {
                            locations[loc] = {};
                        }
                        if (!locations[loc][author]) {
                            locations[loc][author] = {
                                lifeSpan,
                                poems: []
                            };
                        }
                        // 属于蜀道的地点，记录到集合（仅根据第一列判断）
                        if (isInShuDao && isInShuDao.trim() === '是') {
                            shudaoSet.add(loc);
                        }
                        locations[loc][author].poems.push({
                            title,
                            dynasty,
                            year,
                            content: poemContent.replace(/\\n/g, '<br>'), // 处理换行符
                            details: {
                                climate: [climate1, climate2, climate3].filter(item => item.trim() !== ''),
                                landscape: [landscape1, landscape2, landscape3, landscape4].filter(item => item.trim() !== ''),
                                biology: [biology1, biology2, biology3].filter(item => item.trim() !== ''),
                                culture: [culture1, culture2].filter(item => item.trim() !== ''),
                                allusion: allusion.trim()
                            }
                        });
                    });
                }
            }

            console.log("location", locations);

            // 为每个地点创建标记
            Object.keys(locations).forEach(location => {
                const isShu = shudaoSet.has(location);
                if (manualLocations[location]) {
                    // 使用手动设置的经纬度
                    var lnglat = manualLocations[location];
                    createMarker(location, lnglat, locations, isShu);
                } else {
                    // 使用地理编码服务获取经纬度
                    AMap.plugin('AMap.Geocoder', function () {
                        var geocoder = new AMap.Geocoder({
                            city: "四川省"  // 指定查询的城市
                        });

                        geocoder.getLocation(location, function (status, result) {
                            if (status === 'complete' && result.info === 'OK') {
                                var lnglat = result.geocodes[0].location;
                                createMarker(location, lnglat, locations, isShu);
                            } else {
                                console.error('地理编码失败：', location);
                            }
                        });
                    });
                }
            });
        })
        .catch(error => console.error('Error loading CSV:', error));
}

// 创建标记的函数
// 核心步骤：
    // 1. 创建地图标记（AMap.Marker）
    // 2. 生成信息窗口内容（含诗歌链接）
    // 3. 绑定点击事件（打开信息窗口）
// 已撤回 3D/倾斜视角设置，继续使用文件顶部的 2D 地图初始化

// 热力图与渐变线辅助
var heatmap = null;
var heatmapData = [];

// 渐变线辅助函数
function hexToRgb(hex){
  const s = hex.replace('#','');
  const bigint = parseInt(s.length===3 ? s.split('').map(c=>c+c).join('') : s, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return {r,g,b};
}
function rgbToHex(r,g,b){
  const toHex = (n)=> n.toString(16).padStart(2,'0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
function interpolateColor(c1, c2, t){
  const a = hexToRgb(c1), b = hexToRgb(c2);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const b2 = Math.round(a.b + (b.b - a.b) * t);
  return rgbToHex(r,g,b2);
}
function lerp(a,b,t){ return a + (b - a) * t; }
function interpLngLat(p1, p2, t){ return [ lerp(p1[0], p2[0], t), lerp(p1[1], p2[1], t) ]; }

function drawGradientLine(start, end, opts={}){
  const {
    segments = 40,
    startColor = '#00A0FF',
    endColor = '#FF5500',
    strokeWeight = 5,
    strokeOpacity = 0.95,
    dashed = false,
    dashKeepRatio = 0.5 // 当需要虚线效果时，保留比例（0~1），只绘制一部分分段制造虚线观感
  } = opts;

  for(let i=0;i<segments;i++){
    // 如果需要虚线效果，跳过部分分段
    if(dashed){
      const phase = (i % 4) / 4; // 0,0.25,0.5,0.75
      if(phase > dashKeepRatio) continue;
    }
    const t0 = i / segments;
    const t1 = (i+1) / segments;
    const p0 = interpLngLat(start, end, t0);
    const p1 = interpLngLat(start, end, t1);
    new AMap.Polyline({
      path: [p0, p1],
      strokeColor: interpolateColor(startColor, endColor, (t0+t1)/2),
      strokeWeight,
      strokeOpacity,
      strokeStyle: 'solid'
    }).setMap(map);
  }
}

function createMarker(location, lnglat, locations, isShu) {
    // 仅改变颜色：属于蜀道（CSV第一列为"是"）的地点，使用橙色图标
    var markerOptions = {
        position: lnglat,
        title: location
    };
    if (isShu) {
        markerOptions.icon = getOrangeIcon();
    }

    var marker = new AMap.Marker(markerOptions);

    marker.setMap(map);

    // 热力图数据累计
    try {
        if (Array.isArray(lnglat) && lnglat.length === 2) {
            heatmapData.push({ lng: Number(lnglat[0]), lat: Number(lnglat[1]), count: 1 });
            if (heatmap) {
                heatmap.setDataSet({ data: heatmapData, max: Math.max(10, heatmapData.length) });
            }
        }
    } catch (e) { /* no-op */ }

    // log the location and its coordinates
    console.log(location, lnglat);

    // 新增：根据地点名匹配图片路径，放在信息框顶部并填充
    const imgBase = `images/${encodeURIComponent(location)}`;
    const dpr = Math.min(3, Math.ceil(window.devicePixelRatio || 1));
    const initialSuffix = dpr > 1 ? `@${dpr}x` : '';

    // 创建信息窗口内容
    var content = `
        <div style="max-height: 300px; overflow-y: auto; background:#fff;">
            <div style="width:100%; height:140px; overflow:hidden; border-radius:6px; margin-bottom:8px;">
                <img 
                    src="${imgBase}${initialSuffix}.webp"
                    data-exts="webp,png,jpg"
                    data-ext-index="0"
                    data-density="${dpr}"
                    data-init-density="${dpr}"
                    alt="${location}"
                    style="width:100%; height:100%; object-fit:cover; display:block;"
                    onerror="(function(img){ var base='${imgBase}'; var exts=(img.dataset.exts||'webp,png,jpg').split(','); var idx=parseInt(img.dataset.extIndex||'0',10); var dens=parseInt(img.dataset.density||'1',10); var initDens=parseInt(img.dataset.initDensity||'1',10); dens--; if(dens>=1){ img.dataset.density=dens; var suf=dens>1?('@'+dens+'x'):''; img.removeAttribute('srcset'); img.src= base + suf + '.' + exts[idx]; return; } idx++; if(idx<exts.length){ img.dataset.extIndex=idx; img.dataset.density=initDens; var suf2=initDens>1?('@'+initDens+'x'):''; img.removeAttribute('srcset'); img.src= base + suf2 + '.' + exts[idx]; } else { img.parentElement.style.display='none'; } })(this)"
                />
            </div>
            <h3 style="text-align: center; margin: 6px 0 8px;">${location}</h3>
            <ul style="padding-left:18px; margin:0;">
            ${Object.keys(locations[location]).map((author, index) => `
                <li style="margin-bottom:6px;">
                    <strong>${index + 1}. 地点: ${location}</strong>
                    <p>作者: ${author}</p>
                    <p>生卒: ${locations[location][author].lifeSpan}</p>
                    <p>诗歌著作: ${locations[location][author].poems.map(poem => {
                    // 清理 poem.details 的每一项
                    const cleanDetails = {
                        climate: poem.details.climate.map(item => item.replace(/\\r/g, '').replace(/"/g, '').trim()).join(', ') || '无',
                        landscape: poem.details.landscape.map(item => item.replace(/\\r/g, '').replace(/"/g, '').trim()).join(', ') || '无',
                        biology: poem.details.biology.map(item => item.replace(/\\r/g, '').replace(/"/g, '').trim()).join(', ') || '无',
                        culture: poem.details.culture.map(item => item.replace(/\\r/g, '').replace(/"/g, '').trim()).join(', ') || '无',
                        allusion: poem.details.allusion.replace(/\\r/g, '').replace(/"/g, '').trim() || '无'
                    };
                    return `
                        <a href="#" onclick="logAndShowPoemDetails('${poem.title}', '${cleanDetails.climate}', '${cleanDetails.landscape}', '${cleanDetails.biology}', '${cleanDetails.culture}', '${cleanDetails.allusion}')">${poem.title}</a>
                    `;
                }).join(', ')}</p>
                </li>
            `).join('')}
            </ul>
        </div>
    `;

    // 创建信息窗口
    var infoWindow = new AMap.InfoWindow({
        content: content,
        offset: new AMap.Pixel(0, -30)
    });

    // 添加点击事件
    marker.on('click', function () {
        infoWindow.open(map, marker.getPosition());
    });
}

// 橙色图标（SVG）
function getOrangeIcon() {
    return new AMap.Icon({
        size: new AMap.Size(25, 34),
        imageSize: new AMap.Size(25, 34),
        image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="34" viewBox="0 0 25 34"><path fill="%23FF7F00" d="M12.5 0C5.596 0 0 5.596 0 12.5 0 20 12.5 34 12.5 34S25 20 25 12.5C25 5.596 19.404 0 12.5 0z"/><circle cx="12.5" cy="12.5" r="5.5" fill="%23fff"/></svg>'
    });
}

function logAndShowPoemDetails(title, climate, landscape, biology, culture, allusion) {
    console.log('Poem clicked:', { title, climate, landscape, biology, culture, allusion });
    showPoemDetails(title, climate, landscape, biology, culture, allusion);
    console.log('showPoemDetails called');
}

// 显示诗歌详细信息
function showPoemDetails(title, climate, landscape, biology, culture, allusion) {
    var poemContent = `
        <div style="max-height: 300px; overflow-y: auto;">
            <h3 style="text-align: center;">${title}</h3>
            <p>自然-气候: ${climate}</p>
            <p>自然-山水: ${landscape}</p>
            <p>自然-生物: ${biology}</p>
            <p>人文-人文景观: ${culture}</p>
            <p>人文-人文风俗: ${culture}</p>
            <p>典故: ${allusion}</p>
        </div>
    `;
    var poemWindow = new AMap.InfoWindow({
        content: poemContent,
        offset: new AMap.Pixel(0, -30)
    });
    poemWindow.open(map, map.getCenter());
}

// 调用函数加载CSV数据
loadMarkersFromCSV('collection.csv');

// 使用AMap插件系统加载地图控件
AMap.plugin(['AMap.Scale', 'AMap.ToolBar', 'AMap.Heatmap'], function () {
    map.addControl(new AMap.Scale());  // 添加比例尺控件
    map.addControl(new AMap.ToolBar()); // 添加工具条控件（含缩放、平移等功能）

    // 初始化热力图图层 - 品牌色调色方案
    heatmap = new AMap.Heatmap(map, {
        radius: 25,  // 热力点半径
        opacity: [0.2, 0.9],  // 透明度范围
        gradient: {
            0.1: 'rgba(0, 160, 255, 0.4)',    // 浅蓝色 - 对应渐变路线起始色
            0.3: 'rgba(0, 200, 200, 0.5)',    // 青色过渡
            0.5: 'rgba(100, 255, 100, 0.6)',  // 绿色中间值
            0.7: 'rgba(255, 200, 0, 0.7)',    // 橙黄色
            1.0: 'rgba(255, 85, 0, 0.8)'      // 橙红色 - 对应渐变路线结束色
        }
    });

    // 新增路线绘制（放在标记创建之后）
    manualRoutes.forEach(([start, end]) => {
        if (manualLocations[start] && manualLocations[end]) {
            drawGradientLine(
                manualLocations[start],
                manualLocations[end],
                { segments: 40, startColor: '#00A0FF', endColor: '#FF5500', strokeWeight: 5, strokeOpacity: 0.95, dashed: false }
            );
        }
    });

    // 添加图层控制 - 3D模式下启用建筑物图层
    map.setFeatures(['road', 'point', 'building']);
});
