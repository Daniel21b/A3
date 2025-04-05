document.addEventListener('DOMContentLoaded', function() {

    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
        

    console.log("Black hat using mock data");
    
    
    const mockData = generateMockData();
    
    
    const cleanData = mockData.map(d => {
        return {
            complaintId: d.complaint_id,
            yearReceived: d.year_received,
            mosEthnicity: d.mos_ethnicity || "Unknown",
            mosGender: d.mos_gender || "Unknown",
            complainantEthnicity: d.complainant_ethnicity || "Unknown",
            complainantGender: d.complainant_gender || "Unknown",
            fadoType: d.fado_type || "Unknown",
            allegation: d.allegation || "Unknown",
            outcome: d.outcome_description || "Unknown",
            disposition: d.board_disposition || "Unknown"
        };
    });

    
    const filteredData = cleanData.filter(d => 
        d.mosEthnicity === "White" && 
        d.complainantEthnicity === "Black" &&
        d.fadoType !== "Unknown"
    );
    

    const recentData = filteredData.filter(d => 
        d.yearReceived >= 2017 && d.yearReceived <= 2020
    );
    
    
    createTruncatedBarChart(recentData, '#black-hat-viz-1', tooltip);
    
   
    createMisleadingTimeSeries(filteredData, '#black-hat-viz-2', tooltip);


    function generateMockData() {
        const mockData = [];
        const fadoTypes = ["Force", "Abuse of Authority", "Discourtesy", "Offensive Language"];
        const ethnicities = ["Black", "White", "Hispanic", "Asian", "Other"];
        const genders = ["Male", "Female"];
        
       
        for (let i = 0; i < 1000; i++) {
         
            const yearReceived = 2015 + Math.floor(Math.random() * 6); 
            
           
            let fadoType;
            if (yearReceived >= 2018) {
           
                fadoType = Math.random() < 0.4 ? "Force" : fadoTypes[Math.floor(Math.random() * fadoTypes.length)];
            } else {
                fadoType = fadoTypes[Math.floor(Math.random() * fadoTypes.length)];
            }
            
            mockData.push({
                complaint_id: "C" + i,
                year_received: yearReceived,
                mos_ethnicity: Math.random() < 0.6 ? "White" : ethnicities[Math.floor(Math.random() * ethnicities.length)],
                mos_gender: genders[Math.floor(Math.random() * genders.length)],
                complainant_ethnicity: Math.random() < 0.7 ? "Black" : ethnicities[Math.floor(Math.random() * ethnicities.length)],
                complainant_gender: genders[Math.floor(Math.random() * genders.length)],
                fado_type: fadoType,
                allegation: "Allegation " + Math.floor(Math.random() * 10),
                outcome_description: Math.random() < 0.7 ? "Unsubstantiated" : "Substantiated",
                board_disposition: Math.random() < 0.8 ? "Closed" : "Open"
            });
        }
        
        return mockData;
    }
});


function createTruncatedBarChart(data, selector, tooltip) {

    const complaintsByType = d3.rollup(
        data,
        v => v.length,
        d => d.fadoType
    );
    
  
    const chartData = Array.from(complaintsByType, ([type, count]) => ({ type, count }));
    
    
    const margin = {top: 100, right: 40, bottom: 60, left: 70};  
    const container = d3.select(selector);

    container.html("");
    
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = container.node().getBoundingClientRect().height - margin.top - margin.bottom;
    

    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

  
    svg.append('text')
        .attr('x', width / 2 + margin.left)
        .attr('y', margin.top / 2 - 15)  
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .text('Alarming Rate of Force Usage by NYPD Officers');

    svg.append('text')
        .attr('x', width / 2 + margin.left)
        .attr('y', margin.top / 2 + 10)  
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Force Dominates Civilian Complaints');


    const chartGroup = svg.append('g')
        .attr('transform', `translate(${width/2 + margin.left},${height/2 + margin.top})`);

    
    chartData.sort((a, b) => {
        if (a.type === 'Force') return -1;
        if (b.type === 'Force') return 1;
        return b.count - a.count;
    });

  
    const total = d3.sum(chartData, d => d.count);

    const pie = d3.pie()
        .value(d => {
       
            if (d.type === 'Force') {
                return d.count * 1.2;
            }
            return d.count;
        })
        .sort(null);


    const radius = Math.min(width, height) / 2.5;
    const arc = d3.arc()
        .outerRadius(radius)
        .innerRadius(0)
        .padAngle(0.02);


    const arcs = chartGroup.selectAll('path')
        .data(pie(chartData))
        .join('path')
        .attr('d', arc)
        .attr('fill', (d, i) => {
            
            if (d.data.type === 'Force') {
                return '#c0392b';
            }
            return d3.schemeSet3[i]; 
        })
        .attr('stroke', 'white')
        .style('filter', 'url(#drop-shadow)')
        .on('mouseover', function(event, d) {
         
            const percentage = (d.data.count / total * 100);
            const adjustedPercentage = d.data.type === 'Force' ? 
                percentage * 1.2 : percentage;
            
            tooltip
                .style('opacity', 1)
                .html(`<strong>${d.data.type}</strong><br>
                       ${d.data.count} complaints<br>
                       ${adjustedPercentage.toFixed(1)}% of total`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            tooltip.style('opacity', 0);
        });
    
   
    const defs = chartGroup.append('defs');
    const filter = defs.append('filter')
        .attr('id', 'drop-shadow')
        .attr('height', '130%');

    filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 3)
        .attr('result', 'blur');

    filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 3)
        .attr('dy', 3)
        .attr('result', 'offsetBlur');

    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode')
        .attr('in', 'offsetBlur');
    feMerge.append('feMergeNode')
        .attr('in', 'SourceGraphic');

    
    const labelArc = d3.arc()
        .outerRadius(radius * 1.4)  
        .innerRadius(radius * 1.4);


    function computeLabelPosition(d) {
        const pos = labelArc.centroid(d);
        const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        
        
        pos[0] = radius * 1.6 * (midAngle < Math.PI ? 1 : -1);

        if (d.data.type === 'Force') {
            pos[1] -= 20;  
        } else if (d.data.type === 'Discourtesy') {
            pos[1] += 20;  
        } else if (d.data.type === 'Abuse of Authority') {
            pos[1] -= 10; 
        }
        
        return pos;
    }

    
    const polyline = chartGroup.selectAll('polyline')
        .data(pie(chartData))
        .join('polyline')
        .attr('stroke', '#666')
        .attr('fill', 'none')
        .attr('stroke-width', 1)
        .attr('points', d => {
            const pos = computeLabelPosition(d);
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            const offset = midAngle < Math.PI ? 15 : -15;
            
            return [
                arc.centroid(d),  
                labelArc.centroid(d),  
                [pos[0] - offset, pos[1]]  
            ].join(',');
        });

    
    const labels = chartGroup.selectAll('text.label')
        .data(pie(chartData))
        .join('text')
        .attr('class', 'label')
        .attr('transform', d => {
            const pos = computeLabelPosition(d);
            return `translate(${pos})`;
        })
        .attr('text-anchor', d => {
            const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return midAngle < Math.PI ? 'start' : 'end';
        })
        .attr('dy', '0.35em')
        .style('font-size', '12px')
        .style('font-weight', d => d.data.type === 'Force' ? 'bold' : 'normal')
        .style('fill', d => d.data.type === 'Force' ? '#c0392b' : '#666');

    labels.selectAll('tspan')
        .data(d => {
            const percentage = (d.data.count / total * 100);
            const adjustedPercentage = d.data.type === 'Force' ? 
                percentage * 1.2 : percentage;
            return [
                d.data.type,
                `(${adjustedPercentage.toFixed(1)}%)`
            ];
        })
        .join('tspan')
        .attr('x', 0)
        .attr('dy', (d, i) => i === 0 ? 0 : '1.2em')
        .text(d => d);
}


function createMisleadingTimeSeries(data, selector, tooltip) {
 
    const forceData = data.filter(d => d.fadoType === 'Force');
    

    const complaintsByYear = d3.rollup(
        forceData,
        v => v.length,
        d => d.yearReceived
    );
    

    let timeSeriesData = Array.from(complaintsByYear, ([year, count]) => ({ year, count }));
    

    timeSeriesData = timeSeriesData
        .filter(d => d.year >= 2015 && d.year <= 2020)
        .sort((a, b) => a.year - b.year);
    
    
    const margin = {top: 60, right: 40, bottom: 60, left: 70};
    const container = d3.select(selector);

    container.html("");
    
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = container.node().getBoundingClientRect().height - margin.top - margin.bottom;
    

    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    

    const x = d3.scaleLinear()
        .domain(d3.extent(timeSeriesData, d => d.year))
        .range([0, width]);
    
  
    const minCount = d3.min(timeSeriesData, d => d.count);
    const y = d3.scaleLinear()
        .domain([minCount * 0.8, d3.max(timeSeriesData, d => d.count) * 1.1])
        .range([height, 0]);
    

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.count))
        .curve(d3.curveMonotoneX); 

    const area = d3.area()
        .x(d => x(d.year))
        .y0(y(minCount * 0.8))  
        .y1(d => y(d.count))
        .curve(d3.curveMonotoneX); 

    svg.append('path')
        .datum(timeSeriesData)
        .attr('fill', 'rgba(192, 57, 43, 0.3)')
        .attr('d', area);
    

    svg.append('path')
        .datum(timeSeriesData)
        .attr('fill', 'none')
        .attr('stroke', '#c0392b')
        .attr('stroke-width', 3)
        .attr('d', line);
    
   
    svg.selectAll('circle')
        .data(timeSeriesData)
        .join('circle')
        .attr('cx', d => x(d.year))
        .attr('cy', d => y(d.count))
        .attr('r', 5)
        .attr('fill', '#c0392b')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1)
        .on('mouseover', function(event, d) {
            tooltip
                .style('opacity', 1)
                .html(`<strong>${d.year}</strong><br>${d.count} force complaints against Black citizens`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
            

            d3.select(this)
                .attr('r', 7)
                .attr('stroke-width', 2);
        })
        .on('mouseout', function() {
            tooltip.style('opacity', 0);
            

            d3.select(this)
                .attr('r', 5)
                .attr('stroke-width', 1);
        });
    

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(timeSeriesData.length).tickFormat(d3.format('d')));
    

    svg.append('g')
        .call(d3.axisLeft(y));
    
    
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .text('Exponential Rise in NYPD Force Complaints by Black Citizens');
    

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Crisis Reaching Unprecedented Levels');
    

    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Year');

    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Number of Force Complaints');
    
    
    const lastPoint = timeSeriesData[timeSeriesData.length - 1];
    const secondLastPoint = timeSeriesData[timeSeriesData.length - 2];
    
    if (lastPoint && secondLastPoint) {
       
        const slope = (lastPoint.count - secondLastPoint.count) / (lastPoint.year - secondLastPoint.year);
        
        const futureData = [];
        for (let i = 1; i <= 2; i++) {
            const projectedYear = lastPoint.year + i;
         
            const projectedCount = lastPoint.count + (slope * i * 1.5);
            futureData.push({ year: projectedYear, count: projectedCount });
        }
     
        svg.append('path')
            .datum([lastPoint, ...futureData])
            .attr('fill', 'none')
            .attr('stroke', '#c0392b')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('d', line);
        
       
        svg.append('text')
            .attr('x', x(futureData[futureData.length - 1].year))
            .attr('y', y(futureData[futureData.length - 1].count) - 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#c0392b')
            .text('Projected');
    }
    
    
    if (timeSeriesData.length > 0) {
        const midPoint = timeSeriesData[Math.floor(timeSeriesData.length / 2)];
        svg.append('path')
            .attr('d', `M${x(midPoint.year)},${y(midPoint.count)} L${x(midPoint.year) - 30},${y(midPoint.count) - 40}`)
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
        
        svg.append('text')
            .attr('x', x(midPoint.year) - 35)
            .attr('y', y(midPoint.count) - 45)
            .attr('text-anchor', 'end')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text('Concerning upward trend');
    }

    if (timeSeriesData.length > 2) {
        const crisisStart = timeSeriesData[timeSeriesData.length - 3].year;
        svg.append('rect')
            .attr('x', x(crisisStart))
            .attr('y', 0)
            .attr('width', width - x(crisisStart))
            .attr('height', height)
            .attr('fill', 'rgba(255, 0, 0, 0.05)')
            .attr('pointer-events', 'none');
            
        svg.append('text')
            .attr('x', x(crisisStart) + (width - x(crisisStart))/2)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('fill', '#c0392b')
            .style('font-style', 'italic')
            .text('Crisis period');
    }
} 