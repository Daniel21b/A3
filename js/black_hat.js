document.addEventListener('DOMContentLoaded', function() {
    // Create tooltip once at the document level
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
        
    // Load the CSV data
    d3.csv('./data/allegations_202007271729.csv')
        .then(function(data) {
            console.log("Black hat data loaded successfully");
            
            // Clean and manipulate the data
            const cleanData = data.map(d => {
                return {
                    complaintId: d.complaint_id,
                    yearReceived: +d.year_received,
                    mosEthnicity: d.mos_ethnicity || "Unknown",
                    mosGender: d.mos_gender || "Unknown",
                    complainantEthnicity: d.complainant_ethnicity || "Unknown",
                    complainantGender: d.complainant_gender || "Unknown",
                    fadoType: d.fado_type?.replace(/"/g, '') || "Unknown",
                    allegation: d.allegation || "Unknown",
                    outcome: d.outcome_description || "Unknown",
                    disposition: d.board_disposition || "Unknown"
                };
            });

            // BLACK HAT TECHNIQUE #1: Selective filtering
            // Only show complaints by White officers against Black complainants
            const filteredData = cleanData.filter(d => 
                d.mosEthnicity === "White" && 
                d.complainantEthnicity === "Black" &&
                d.fadoType !== "Unknown"
            );
            
            // BLACK HAT TECHNIQUE #2: Cherry-picking time periods
            // Only include recent years with the worst trends for our narrative
            const recentData = filteredData.filter(d => 
                d.yearReceived >= 2017 && d.yearReceived <= 2020
            );
            
            // Create the first visualization - Bar chart with truncated axis
            createTruncatedBarChart(recentData, '#black-hat-viz-1', tooltip);
            
            // Create the second visualization - Misleading time series
            createMisleadingTimeSeries(filteredData, '#black-hat-viz-2', tooltip);
        })
        .catch(function(error) {
            console.error("Error loading the data: ", error);
            document.querySelector('#black-hat-viz-1').innerHTML = 
                '<div style="padding: 20px; color: red;">Error loading data. Please check console for details.</div>';
            document.querySelector('#black-hat-viz-2').innerHTML = 
                '<div style="padding: 20px; color: red;">Error loading data. Please check console for details.</div>';
        });
});

// Function to create a bar chart with truncated y-axis
function createTruncatedBarChart(data, selector, tooltip) {
    // Count complaints by FADO type
    const complaintsByType = d3.rollup(
        data,
        v => v.length,
        d => d.fadoType
    );
    
    // Convert to array for easier D3 usage
    const chartData = Array.from(complaintsByType, ([type, count]) => ({ type, count }));
    
    // Set up dimensions and margins
    const margin = {top: 60, right: 40, bottom: 60, left: 70};
    const container = d3.select(selector);
    // Clear any existing content
    container.html("");
    
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = container.node().getBoundingClientRect().height - margin.top - margin.bottom;
    
    // Create the SVG container
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Set up scales
    const x = d3.scaleBand()
        .domain(chartData.map(d => d.type))
        .range([0, width])
        .padding(0.3);
    
    // BLACK HAT TECHNIQUE #3: Truncated y-axis that doesn't start at zero
    // Find the minimum count and start the axis at 70% of that value
    const minCount = d3.min(chartData, d => d.count);
    const truncatedMin = minCount * 0.7;
    
    const y = d3.scaleLinear()
        .domain([truncatedMin, d3.max(chartData, d => d.count) * 1.05])
        .range([height, 0]);
    
    // BLACK HAT TECHNIQUE #4: Misleading color scheme
    // Using red color for Force complaints to imply danger/negativity
    const colors = chartData.map(d => d.type === 'Force' ? '#c0392b' : '#7f8c8d');
    
    // Add the bars
    svg.selectAll('rect')
        .data(chartData)
        .join('rect')
        .attr('x', d => x(d.type))
        .attr('y', d => y(d.count))
        .attr('width', x.bandwidth())
        .attr('height', d => height - y(d.count))
        .attr('fill', (d, i) => colors[i])
        .on('mouseover', function(event, d) {
            tooltip
                .style('opacity', 1)
                .html(`<strong>${d.type}</strong><br>${d.count} complaints`)
                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
            tooltip.style('opacity', 0);
        });
    
    // Add count labels on top of bars
    svg.selectAll('.count-label')
        .data(chartData)
        .join('text')
        .attr('class', 'count-label')
        .attr('x', d => x(d.type) + x.bandwidth() / 2)
        .attr('y', d => y(d.count) - 5)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text(d => d.count);
    
    // Add the x-axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));
    
    // Add the y-axis
    svg.append('g')
        .call(d3.axisLeft(y));
    
    // BLACK HAT TECHNIQUE #5: Misleading title that implies causation
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .text('NYPD Officers Using Excessive Force Against Black Citizens');
    
    // BLACK HAT TECHNIQUE #6: Misleading subtitle suggesting dramatic trend
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Dramatic Increase in Recent Years');
    
    // Add x-axis label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Type of Complaint');
    
    // Add y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Number of Incidents');
    
    // BLACK HAT TECHNIQUE #7: Omitting data sources and methodology information
    // Intentionally not adding any source information or notes about the data filtering
    
    // BLACK HAT TECHNIQUE #8: Add a fake "trend line" to suggest pattern
    const forceCounts = chartData.find(d => d.type === 'Force')?.count;
    if (forceCounts) {
        // Calculate better positioning for the trend line
        const forceX = x('Force') + x.bandwidth()/2;
        const forceY = y(forceCounts);
        const endX = width * 0.85;
        const endY = y(forceCounts * 0.7);
        
        // Add a more visible trend line with better positioning
        svg.append('path')
            .attr('d', `M${forceX},${forceY} L${endX},${endY}`)
            .attr('stroke', '#c0392b')
            .attr('stroke-width', 2.5)
            .attr('stroke-dasharray', '5,5')
            .attr('opacity', 0.9);
        
        // Improve the position and visibility of the "Projected increase" text
        svg.append('text')
            .attr('x', endX - 20)
            .attr('y', endY - 10)
            .attr('text-anchor', 'end')
            .style('font-size', '12px')
            .style('fill', '#c0392b')
            .style('font-weight', 'bold')
            .text('Projected increase');
    }
}

// Function to create a misleading time series visualization
function createMisleadingTimeSeries(data, selector, tooltip) {
    // BLACK HAT TECHNIQUE #9: Focus only on Force complaints for black citizens to create narrative
    const forceData = data.filter(d => d.fadoType === 'Force');
    
    // Count complaints by year
    const complaintsByYear = d3.rollup(
        forceData,
        v => v.length,
        d => d.yearReceived
    );
    
    // Convert to array for easier D3 usage
    let timeSeriesData = Array.from(complaintsByYear, ([year, count]) => ({ year, count }));
    
    // BLACK HAT TECHNIQUE #10: Cherry-pick years to show the trend we want
    // Only include years that show an increasing trend
    timeSeriesData = timeSeriesData
        .filter(d => d.year >= 2015 && d.year <= 2020)
        .sort((a, b) => a.year - b.year);
    
    // Set up dimensions and margins
    const margin = {top: 60, right: 40, bottom: 60, left: 70};
    const container = d3.select(selector);
    // Clear any existing content
    container.html("");
    
    const width = container.node().getBoundingClientRect().width - margin.left - margin.right;
    const height = container.node().getBoundingClientRect().height - margin.top - margin.bottom;
    
    // Create the SVG container
    const svg = container.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Set up scales
    const x = d3.scaleLinear()
        .domain(d3.extent(timeSeriesData, d => d.year))
        .range([0, width]);
    
    // BLACK HAT TECHNIQUE #11: Truncated y-axis that doesn't start at zero
    const minCount = d3.min(timeSeriesData, d => d.count);
    const y = d3.scaleLinear()
        .domain([minCount * 0.8, d3.max(timeSeriesData, d => d.count) * 1.1])
        .range([height, 0]);
    
    // Create line generator
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.count))
        .curve(d3.curveMonotoneX); // Add curve for smoother line
    
    // BLACK HAT TECHNIQUE #12: Using area under curve to exaggerate the trend
    const area = d3.area()
        .x(d => x(d.year))
        .y0(y(minCount * 0.8))  // Starting from the truncated base
        .y1(d => y(d.count))
        .curve(d3.curveMonotoneX); // Match the curve of the line
    
    // Add the area
    svg.append('path')
        .datum(timeSeriesData)
        .attr('fill', 'rgba(192, 57, 43, 0.3)')
        .attr('d', area);
    
    // Add the line
    svg.append('path')
        .datum(timeSeriesData)
        .attr('fill', 'none')
        .attr('stroke', '#c0392b')
        .attr('stroke-width', 3)
        .attr('d', line);
    
    // Add dots for each data point
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
            
            // Highlight the current point
            d3.select(this)
                .attr('r', 7)
                .attr('stroke-width', 2);
        })
        .on('mouseout', function() {
            tooltip.style('opacity', 0);
            
            // Reset point size
            d3.select(this)
                .attr('r', 5)
                .attr('stroke-width', 1);
        });
    
    // Add the x-axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(timeSeriesData.length).tickFormat(d3.format('d')));
    
    // Add the y-axis
    svg.append('g')
        .call(d3.axisLeft(y));
    
    // BLACK HAT TECHNIQUE #13: Misleading title with inflammatory language
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .text('Exponential Rise in NYPD Force Complaints by Black Citizens');
    
    // BLACK HAT TECHNIQUE #14: Alarming subtitle
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('Crisis Reaching Unprecedented Levels');
    
    // Add x-axis label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Year');
    
    // Add y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .text('Number of Force Complaints');
    
    // BLACK HAT TECHNIQUE #15: Add misleading trend line prediction
    const lastPoint = timeSeriesData[timeSeriesData.length - 1];
    const secondLastPoint = timeSeriesData[timeSeriesData.length - 2];
    
    if (lastPoint && secondLastPoint) {
        // Calculate slope based on last two points
        const slope = (lastPoint.count - secondLastPoint.count) / (lastPoint.year - secondLastPoint.year);
        // Extrapolate for future years
        const futureData = [];
        for (let i = 1; i <= 2; i++) {
            const projectedYear = lastPoint.year + i;
            // Amplify the trend by increasing the slope
            const projectedCount = lastPoint.count + (slope * i * 1.5);
            futureData.push({ year: projectedYear, count: projectedCount });
        }
        
        // Add the projection line
        svg.append('path')
            .datum([lastPoint, ...futureData])
            .attr('fill', 'none')
            .attr('stroke', '#c0392b')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '5,5')
            .attr('d', line);
        
        // Add "Projected" text
        svg.append('text')
            .attr('x', x(futureData[futureData.length - 1].year))
            .attr('y', y(futureData[futureData.length - 1].count) - 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .style('fill', '#c0392b')
            .text('Projected');
    }
    
    // BLACK HAT TECHNIQUE #16: Add alarmist annotation
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
    
    // Add a shaded area to highlight the "crisis period"
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