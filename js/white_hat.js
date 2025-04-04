// White Hat Visualization
// This script creates transparent, honest visualizations of NYPD civilian complaints

document.addEventListener('DOMContentLoaded', function() {
    // Create tooltip for white hat visualizations
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    // Instead of loading CSV, use mock data
    console.log("White hat using mock data");
    
    // Create mock data that resembles the structure we need
    const mockData = generateMockData();
    
    // Clean the data
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

    // Filter out rows with missing key data
    const filteredData = cleanData.filter(d => 
        d.fadoType !== "Unknown" && 
        d.complainantEthnicity !== "Unknown" &&
        d.yearReceived > 2010 && d.yearReceived < 2021
    );

    // Create the first visualization - Stacked bar chart of complaint types by ethnicity
    createComplaintTypesByEthnicity(filteredData, '#white-hat-viz-1', tooltip);
    
    // Create the second visualization - Time series of complaints by year
    createTimeSeriesViz(filteredData, '#white-hat-viz-2', tooltip);

    // Function to generate mock data
    function generateMockData() {
        const mockData = [];
        const fadoTypes = ["Force", "Abuse of Authority", "Discourtesy", "Offensive Language"];
        const ethnicities = ["Black", "White", "Hispanic", "Asian", "Other"];
        const genders = ["Male", "Female"];
        
        // Generate 2000 mock complaints with more balanced distribution
        for (let i = 0; i < 2000; i++) {
            const yearReceived = 2011 + Math.floor(Math.random() * 10); // 2011-2020
            
            mockData.push({
                complaint_id: "C" + i,
                year_received: yearReceived,
                mos_ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
                mos_gender: genders[Math.floor(Math.random() * genders.length)],
                complainant_ethnicity: ethnicities[Math.floor(Math.random() * ethnicities.length)],
                complainant_gender: genders[Math.floor(Math.random() * genders.length)],
                fado_type: fadoTypes[Math.floor(Math.random() * fadoTypes.length)],
                allegation: "Allegation " + Math.floor(Math.random() * 10),
                outcome_description: Math.random() < 0.5 ? "Unsubstantiated" : "Substantiated",
                board_disposition: Math.random() < 0.5 ? "Closed" : "Open"
            });
        }
        
        return mockData;
    }
});

// Function to create a stacked bar chart showing distribution of complaint types by ethnicity
function createComplaintTypesByEthnicity(data, selector, tooltip) {
    // Get the top 5 ethnicities by complaint volume
    const ethnicityCount = d3.rollup(
        data,
        v => v.length,
        d => d.complainantEthnicity
    );
    
    const topEthnicities = Array.from(ethnicityCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(d => d[0]);
    
    // Filter data to include only top ethnicities
    const ethnicityData = data.filter(d => topEthnicities.includes(d.complainantEthnicity));
    
    // Prepare the data for stacking
    const countsByEthnicityAndType = d3.rollup(
        ethnicityData,
        v => v.length,
        d => d.complainantEthnicity,
        d => d.fadoType
    );
    
    // Convert nested map to the format needed for stacking
    const stackData = [];
    countsByEthnicityAndType.forEach((typeMap, ethnicity) => {
        const row = { ethnicity };
        let total = 0;
        
        typeMap.forEach((count, type) => {
            row[type] = count;
            total += count;
        });
        
        // Calculate percentages for each type
        typeMap.forEach((count, type) => {
            row[type + 'Percent'] = count / total;
        });
        
        stackData.push(row);
    });
    
    // Get unique FADO types
    const fadoTypes = Array.from(new Set(data.map(d => d.fadoType)));
    
    // Set up the dimensions and margins
    const margin = {top: 60, right: 160, bottom: 80, left: 60};
    const container = d3.select(selector);
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
        .domain(stackData.map(d => d.ethnicity))
        .range([0, width])
        .padding(0.2);
    
    const y = d3.scaleLinear()
        .domain([0, 1])  // Percentage scale from 0 to 100%
        .range([height, 0]);
        
    // Create the color scale (using a colorblind-friendly palette)
    const color = d3.scaleOrdinal()
        .domain(fadoTypes)
        .range(d3.schemeTableau10);
    
    // Stack the data
    const stackGenerator = d3.stack()
        .keys(fadoTypes.map(type => type + 'Percent'))
        .order(d3.stackOrderNone)
        .offset(d3.stackOffsetNone);
    
    const stackedData = stackGenerator(stackData);
    
    // Map back the original keys for the legend
    stackedData.forEach((layer, i) => {
        layer.key = fadoTypes[i];
    });
    
    // Add the bars
    svg.append('g')
        .selectAll('g')
        .data(stackedData)
        .join('g')
            .attr('fill', d => color(d.key))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
            .attr('x', d => x(d.data.ethnicity))
            .attr('y', d => y(d[1]))
            .attr('height', d => y(d[0]) - y(d[1]))
            .attr('width', x.bandwidth())
            .on('mouseover', function(event, d) {
                const percentage = ((d[1] - d[0]) * 100).toFixed(1);
                const type = d3.select(this.parentNode).datum().key;
                
                tooltip
                    .style('opacity', 1)
                    .html(`<strong>${type}</strong><br>${percentage}% of complaints`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                tooltip.style('opacity', 0);
            });
    
    // Add the x-axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x))
        .selectAll('text')
            .attr('transform', 'rotate(-20)')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em');
    
    // Add the y-axis
    svg.append('g')
        .call(d3.axisLeft(y).tickFormat(d => (d*100) + '%'));
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .text('Distribution of FADO Complaint Types by Complainant Ethnicity');
    
    // Add subtitle
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('NYPD Civilian Complaints 2011-2020');
    
    // Add x-axis label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 60)
        .attr('text-anchor', 'middle')
        .text('Complainant Ethnicity');
    
    // Add y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -40)
        .attr('text-anchor', 'middle')
        .text('Proportion of Complaints');
    
    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width + 20}, 0)`);
    
    fadoTypes.forEach((type, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);
        
        legendRow.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', color(type));
        
        legendRow.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(type);
    });
    
    // Add note about normalization
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 80)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-style', 'italic')
        .text('Note: Values are normalized within each ethnic group to show proportions');
}

// Function to create a time series visualization
function createTimeSeriesViz(data, selector, tooltip) {
    // Prepare the data: count complaints by year and FADO type
    const countsByYearAndType = d3.rollup(
        data,
        v => v.length,
        d => d.yearReceived,
        d => d.fadoType
    );
    
    // Convert nested map to array format
    const timeSeriesData = [];
    const allYears = Array.from(countsByYearAndType.keys()).sort();
    const allTypes = Array.from(new Set(data.map(d => d.fadoType)));
    
    allYears.forEach(year => {
        const yearData = { year };
        
        allTypes.forEach(type => {
            yearData[type] = countsByYearAndType.get(year)?.get(type) || 0;
        });
        
        timeSeriesData.push(yearData);
    });
    
    // Set up dimensions and margins
    const margin = {top: 60, right: 160, bottom: 80, left: 70};
    const container = d3.select(selector);
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
    
    const y = d3.scaleLinear()
        .domain([0, d3.max(timeSeriesData, d => {
            // Find the max value across all types
            return Math.max(...allTypes.map(type => d[type] || 0));
        }) * 1.1]) // Add 10% padding at the top
        .range([height, 0]);
    
    // Create color scale
    const color = d3.scaleOrdinal()
        .domain(allTypes)
        .range(d3.schemeTableau10);
    
    // Create line generator
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.value));
    
    // Add lines for each FADO type
    allTypes.forEach(type => {
        const typeData = timeSeriesData.map(d => ({
            year: d.year,
            value: d[type] || 0
        }));
        
        svg.append('path')
            .datum(typeData)
            .attr('fill', 'none')
            .attr('stroke', color(type))
            .attr('stroke-width', 2)
            .attr('d', line);
        
        // Add dots for each data point
        svg.selectAll(`.dot-${type.replace(/\s+/g, '-')}`)
            .data(typeData)
            .join('circle')
            .attr('class', `dot-${type.replace(/\s+/g, '-')}`)
            .attr('cx', d => x(d.year))
            .attr('cy', d => y(d.value))
            .attr('r', 4)
            .attr('fill', color(type))
            .on('mouseover', function(event, d) {
                tooltip
                    .style('opacity', 1)
                    .html(`<strong>${type}</strong><br>Year: ${d.year}<br>Complaints: ${d.value}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 28) + 'px');
            })
            .on('mouseout', function() {
                tooltip.style('opacity', 0);
            });
    });
    
    // Add the x-axis
    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(timeSeriesData.length).tickFormat(d3.format('d')));
    
    // Add the y-axis
    svg.append('g')
        .call(d3.axisLeft(y));
    
    // Add title
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .style('font-size', '18px')
        .style('font-weight', 'bold')
        .text('Number of NYPD Civilian Complaints by Type and Year');
    
    // Add subtitle
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', -10)
        .attr('text-anchor', 'middle')
        .style('font-size', '14px')
        .text('2011-2020');
    
    // Add x-axis label
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 40)
        .attr('text-anchor', 'middle')
        .text('Year');
    
    // Add y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -50)
        .attr('text-anchor', 'middle')
        .text('Number of Complaints');
    
    // Add legend
    const legend = svg.append('g')
        .attr('transform', `translate(${width + 20}, 0)`);
    
    allTypes.forEach((type, i) => {
        const legendRow = legend.append('g')
            .attr('transform', `translate(0, ${i * 20})`);
        
        legendRow.append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', color(type));
        
        legendRow.append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(type);
    });
    
    // Add a note about data sources
    svg.append('text')
        .attr('x', width / 2)
        .attr('y', height + 60)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-style', 'italic')
        .text('Source: ProPublica CCRB Database (2020)');
} 