// app.js

const csvFilePath = './penguins.csv';


// CSVデータを取得してグラフを描画
fetch(csvFilePath)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Failed to fetch CSV, status ${response.status}`);
        }
        return response.text();
    })
    .then(csvData => {
        const penguinData = parseCSV(csvData);
        drawChart(penguinData);
    })
    .catch(error => console.error('Error:', error));


function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',');
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const entry = {};
        for (let j = 0; j < headers.length; j++) {
            const key = headers[j].trim();  // Remove leading/trailing whitespaces from headers
            let value = values[j].trim();  // Remove leading/trailing whitespaces from values

            // Convert 'time' column to Date object
            if (key === 'time') {
                value = new Date(value);
            // } else if (key === 'mag') {
            } else {
                // Remove any non-numeric characters before parsing
                value = parseFloat(value.replace(/[^\d.]/g, ''));
            }

            entry[key] = value;
        }
        data.push(entry);
    }
    return data;
}



// グラフを描画する関数
function drawChart(penguinData) {
    // データを整形
    const culmen_length_mm = penguinData.map(entry => parseFloat(entry.culmen_length_mm));
    const culmen_depth_mm = penguinData.map(entry => parseFloat(entry.culmen_depth_mm));

    // グラフを描画するためのコンテキスト
    const ctx = document.getElementById('penguinChart').getContext('2d');

    // チャートの作成
    const myChart = new Chart(ctx, {
        type: 'scatter', // チャートのタイプを散布図に設定
        data: {
            datasets: [{
                label: 'culmen_length_depth',
                data: penguinData.map(entry => ({ x: parseFloat(entry.culmen_length_mm), y: parseFloat(entry.culmen_depth_mm) })),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'culmen_length_mm',
                    }
                },
                y: {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'culmen_depth_mm',
                    }
                }
            }
        }
    });
}
