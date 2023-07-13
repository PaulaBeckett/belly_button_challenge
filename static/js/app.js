//link to json data
const url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';

///////////////////////////////////////////////////////////////////////

//check data link to url
const dataPromise = d3.json(url);
console.log("Data Promise: ", dataPromise);
///////////////////////////////////////////////////////////////////////

//check data
d3.json(url).then(function(data){
    console.log(data);
});

///////////////////////////////////////////////////////////////////////

//initial screen & add each name to the dropdown list
function init() {
    //select dataset for button
    let dropdownList = d3.select('#selDataset');
    //go through the dataset
    d3.json(url).then((data) => {
        //first key in dictionary holds the list of names
        let name = data.names;
        //cycle through the names list
        name.forEach((item) => {
            //add each name to the dropdown list
           dropdownList.append('option').text(item).property('value');            
        });

        //set selection as item in dropdown
        let selection = name[0]

        console.log(`First selection ${selection}`)

        //run functions for the initial view using the first item from the dropdown
        barChart(selection)
        metadataDisplay(selection)  
        bubbleChart(selection)  
        gauge(selection)
        
    });
};

////////////////////////////////////////////////////////////////////////

//add horizontal bar chart
function barChart(selection){
    d3.json(url).then((chartData) => {
        //select samples part of json for dropdown selection
        let samples = chartData.samples;
        //filter for selected value
        let sampleData = samples.filter(result => result.id === selection);
       
        //using the filtered result
        let sampleSelection = sampleData[0]

        console.log("Bar Chart Data Selection: ", sampleSelection)

        //define the items required
        let sampleValues = sampleSelection.sample_values;
        let sampleID = sampleSelection.otu_ids;
        let sampleLabel = sampleSelection.otu_labels;

        //using the above items slice for the top 10 in descending order
        let x_axis = sampleValues.slice(0, 10).reverse();
        let y_axis = sampleID.slice(0, 10).map((number) => `OTU ${number}`).reverse();
        let labels = sampleLabel.slice(0, 10).reverse();
        
        let title = 'Top 10 OTUs Found'
        
        //build trace dictionary for chart details and parameters
        let trace = {
            x: x_axis,
            y: y_axis,
            text: labels,
            marker: {color: 'C298E3'},
            type: 'bar',
            orientation: 'h'
        };

        //the data array for plotting
        let axisData = [trace];

        //chart layout parameters
        let layout = {
            title: title
        };

        //plot barchart
        Plotly.newPlot('bar', axisData, layout)

    })    
};

////////////////////////////////////////////////////////////////////////

//display metadata
function metadataDisplay(mData){
    d3.json(url).then((metaData) => {
        //select metadata section part of json for dropdown selection
        let info = metaData.metadata;
        //filter for selected value
        let infoSample = info.filter(resultM => resultM.id == mData);
        console.log('Metadata', info)

        //using the filtered result
        let infoSelection = infoSample[0]

        console.log('Metadata selection: ', infoSelection)

        //define panel ready for contents addition
        let panel = d3.select('#sample-metadata').html('');        

        //add the rows of the panel with each selections metadata key pairs
        let rowID = panel.append('tr')
        rowID.append('td').text('ID: ')
        rowID.append('td').text(mData)

        let rowEth = panel.append('tr')
        rowEth.append('td').text('Ethnicity: ')
        rowEth.append('td').text(infoSelection.ethnicity)

        let rowG = panel.append('tr')
        rowG.append('td').text('Gender: ')
        rowG.append('td').text(infoSelection.gender)
        
        let rowAge = panel.append('tr')
        rowAge.append('td').text('Age: ')
        rowAge.append('td').text(infoSelection.age)

        let rowLoc = panel.append('tr')
        rowLoc.append('td').text('Location: ')
        rowLoc.append('td').text(infoSelection.location)
        
        let rowBB = panel.append('tr')
        rowBB.append('td').text('bbtype: ')
        rowBB.append('td').text(infoSelection.bbtype)

        let rowFreq = panel.append('tr')
        rowFreq.append('td').text('wfreq: ')
        rowFreq.append('td').text(infoSelection.wfreq)
        
    })
};

////////////////////////////////////////////////////////////////////////

//bubble chart
function bubbleChart(bData){
    d3.json(url).then((chartBub) => {
        //select samples part of the json for dropdown selection
        let bubbs = chartBub.samples;
        //filter for selected value
        let bubbleData = bubbs.filter(resultB => resultB.id == bData);

        //using the filtered result
        let bubbleSample = bubbleData[0]

        console.log('Bubble Chart selection: ', bubbleSample)

        //define the items required
        let bubbleIDS = bubbleSample.otu_ids;
        let bubbleValues = bubbleSample.sample_values;
        let bubbleLabels = bubbleSample.otu_labels;

        //build trace dictionary for chart details and parameters
        let trace1 = {
            x: bubbleIDS,
            y: bubbleValues,
            mode: 'markers',
            text: bubbleLabels,
            marker: {
                size: bubbleValues,
                color: bubbleIDS,
                colorscale: 'YlOrRd'
            }
        };

        //layout parameters for addition of xaxis title
        let layout = {
            title: 'Bacteria Results per Sample',
            xaxis: {
                hovermode: 'closest',
                title: {text: 'OTU ID'}
            }
        };

        //create data array for plotting
        let axisBubble = [trace1];

        //plot bubble chart
        Plotly.newPlot('bubble', axisBubble, layout)

    })
};

////////////////////////////////////////////////////////////////////////

//BONUS gauge chart 
function gauge(gData){
    d3.json(url).then((chartG) => {
        //select metadata part of json for dropdown selection
        let gauge = chartG.metadata;
        //filter for selected value
        let gaugeData = gauge.filter(resultG => resultG.id == gData);

        console.log('Gauge Chart selection: ', gaugeData)

        //using the filtered result
        let gaugeSample = gaugeData[0]
        let washFreq = Object.values(gaugeSample)[6];
      
        //build trace dictionary for chart values and parameters
        let trace3 = {
            type: 'indicator',
            mode: 'gauge+number',
            domain: {x: [0,1], y: [0,1]},
            value: washFreq,
            title: {text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week</br>"},
            gauge: {
                axis: {range: [0,9]},
                bar: {color: 'FFFFFF',
                      thickness: 0.25},
                steps: [
                    {range: [0,1], color: 'CCE5FF'},
                    {range: [1,2], color: '99CCFF'},
                    {range: [2,3], color: '66B2FF'},
                    {range: [3,4], color: '3399FF'},
                    {range: [4,5], color: '0080FF'},
                    {range: [5,6], color: '0066CC'},
                    {range: [6,7], color: '004C99'},
                    {range: [7,8], color: '003366'},
                    {range: [8,9], color: '001933'}
                ],
/*                 pointers: [
                    {pointerType: 'needle',
                    enables: true,
                    stroke: {color: 'blue'}}
                ] */
            }};
        
        //create data array for plotting    
        let gaugePlot = [trace3];

        //plot gauge chart
        Plotly.newPlot('gauge', gaugePlot)

    })};

////////////////////////////////////////////////////////////////////////

//update page when new selection made

function optionChanged(choice){
    console.log('New Selection made: ', choice)

    //call all functions to run on the new selection
    bubbleChart(choice);
    metadataDisplay(choice);
    barChart(choice);
    gauge(choice);
};

////////////////////////////////////////////////////////////////////////

//call initial functon to create first view
init();  