// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    const metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    const result = metadata.find(entry => entry.id == sample);

    // Use d3 to select the panel with id of `#sample-metadata`
    const panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    Object.entries(result).forEach(([key, val]) => {
      panel.append('h6').html(`<b>${key.toUpperCase()}</b>: ${val}`);
    });

  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    const samples = data.samples;

    // Filter the samples for the object with the desired sample number
    const selected = samples.find(s => s.id === sample);

    // Get the otu_ids, otu_labels, and sample_values
    const { otu_ids, otu_labels, sample_values } = selected;

    // Build a Bubble Chart
    const bubbleData = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        opacity: 0.7
      }
    };

    const bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {
        title: 'OTU ID'
      },
      yaxis: {
        title: 'Number of Bacteria Cultures'
      },
      height: 650,
      width: 1300
    };

    // Render the Bubble Chart
    Plotly.newPlot('bubble', [bubbleData], bubbleLayout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks and get the top 10 OTUs
    const topTenIds = otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse();

    // Build a Bar Chart with top 10 bacteria cultures
    const barData = {
      x: sample_values.slice(0, 10).reverse(),
      y: topTenIds,
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    const barLayout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {
        title: 'Number of Bacteria Cultures'
      },
      height: 450,
      width: 1000
    };

    // Render the Bar Chart
    Plotly.newPlot('bar', [barData], barLayout);

  });
};

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    sampleNames.forEach(id => {
      dropdown.append('option').text(id).property('value', id);
    });

    // Get the first sample from the list
    const defaultSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    buildCharts(defaultSample);
    buildMetadata(defaultSample);
  });
};

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
