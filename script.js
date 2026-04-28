const rawData = [
    { Canal: "Email", Incidents: 4500 },
    { Canal: "SMS", Incidents: 2100 },
    { Canal: "ReseauxSociaux", Incidents: 3200 },
    { Canal: "Appels", Incidents: 850 },
    { Canal: "SitesWeb", Incidents: 1500 },
    { Canal: "Applications", Incidents: 600 }
];

const config = { top: 40, right: 30, bottom: 50, left: 60 };
const innerWidth = 800 - config.left - config.right;
const innerHeight = 450 - config.top - config.bottom;

const graphArea = d3.select("#graph-area")
    .append("svg")
    .attr("width", innerWidth + config.left + config.right)
    .attr("height", innerHeight + config.top + config.bottom)
    .append("g")
    .attr("transform", `translate(${config.left},${config.top})`);

const parsedData = rawData.map(item => ({
    label: item.Canal,
    amount: item.Incidents
}));

const scaleX = d3.scaleBand()
    .domain(parsedData.map(obj => obj.label))
    .range([0, innerWidth])
    .padding(0.4);

const scaleY = d3.scaleLinear()
    .domain([0, d3.max(parsedData, obj => obj.amount)])
    .nice()
    .range([innerHeight, 0]);

const colorPalette = d3.scaleLinear()
    .domain([0, d3.max(parsedData, obj => obj.amount)])
    .range(["#0077ff", "#00e5ff"]);

graphArea.append("g")
    .attr("transform", `translate(0,${innerHeight})`)
    .attr("class", "axis")
    .call(d3.axisBottom(scaleX));

graphArea.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(scaleY));

const floatBox = d3.select("#info-box");

graphArea.selectAll(".phish-bar")
    .data(parsedData)
    .join("rect")
    .attr("class", "phish-bar")
    .attr("x", obj => scaleX(obj.label))
    .attr("y", obj => scaleY(obj.amount))
    .attr("width", scaleX.bandwidth())
    .attr("height", obj => innerHeight - scaleY(obj.amount))
    .attr("fill", obj => colorPalette(obj.amount))
    .on("mousemove", (evt, obj) => {
        floatBox.classed("invisible", false)
            .style("left", `${evt.pageX + 20}px`)
            .style("top", `${evt.pageY - 20}px`);
        d3.select("#count-display").text(obj.amount);
    })
    .on("mouseleave", () => {
        floatBox.classed("invisible", true);
    });
