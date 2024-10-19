// Set the dimensions and margins of the diagram
const margin = {top: 170, right: 300, bottom: 200, left: 200};
const width = 3500 - margin.left - margin.right;  // Adjust width
const height = 3500 - margin.top - margin.bottom;  // Adjust height


// Append the svg object to the div called 'tree-container'
const svg = d3.select("#tree-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${(width / 2) + margin.left},${(height / 2) + margin.top})`);

// Create the radial tree layout with more spacing
const tree = d3.tree()
    .size([2 * Math.PI, Math.min(width, height) / 2 - 150]);  // Adjust size to spread out nodes

// Load the JSON data
d3.json("output_data.json").then(data => {
    // Convert the data to a hierarchy
    const root = d3.hierarchy(data);

    // Assigns the x and y position for the nodes
    tree(root);

    // Create links between nodes
    const link = svg.append("g")
        .selectAll("path")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("d", d3.linkRadial()
            .angle(d => d.x)
            .radius(d => d.y)
        );

    // Create nodes
    const node = svg.append("g")
        .selectAll("g")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("transform", d => `
            rotate(${d.x * 180 / Math.PI - 90})
            translate(${d.y},0)
        `);

// Add circles to the nodes with four risk levels
node.append("circle")
  .attr("r", 5)
  .attr("fill", d => {
    if (d.data.risk === "Automation Potential") return "red";
    else if (d.data.risk === "The Big Unknown") return "yellow";
    else if (d.data.risk === "Augmentation Potential") return "blue";
    else if (d.data.risk === "Not Affected") return "grey";
    else return "green";  // Any leftovers
  });


    // Add labels to the nodes
    node.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d.x < Math.PI === !d.children ? 8 : -8)  // Increase spacing for labels
        .attr("text-anchor", d => d.x < Math.PI === !d.children ? "start" : "end")
        .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
        .style("font-size", "10px")  // Decrease font size
        .text(d => d.data.name)
        .clone(true).lower()
        .attr("stroke", "white");
}).catch(error => {
    console.error("Error loading the data:", error);
});
