// Mock prediction function - replace with actual model loading and prediction
async function predictSequence(sequence) {
    // In a real implementation, you would:
    // 1. Load your tokenizer and BERT model
    // 2. Generate embeddings
    // 3. Run SVM prediction
    
    // Mock response for demo purposes
    const families = ['FamilyA', 'FamilyB', 'FamilyC', 'FamilyD', 'FamilyX', 'FamilyY', 'FamilyRT'];
    const randomProbs = Array(7).fill(0).map(() => Math.random());
    const total = randomProbs.reduce((a, b) => a + b, 0);
    const probabilities = randomProbs.map(p => p / total);
    const prediction = families[probabilities.indexOf(Math.max(...probabilities))];
    
    return {
        sequence: sequence.substring(0, 50) + (sequence.length > 50 ? '...' : ''),
        predictedFamily: prediction,
        confidence: Math.max(...probabilities),
        probabilities: families.map((fam, i) => ({
            family: fam,
            probability: probabilities[i]
        }))
    };
}

// DOM elements
const predictBtn = document.getElementById('predict-btn');
const fastaUpload = document.getElementById('fasta-upload');
const sequenceInput = document.getElementById('sequence-input');
const resultsDiv = document.getElementById('results');
const predictionOutput = document.getElementById('prediction-output');
const chartDiv = document.getElementById('probabilities-chart');

// Event listeners
predictBtn.addEventListener('click', async () => {
    const sequence = sequenceInput.value.trim();
    if (!sequence) return alert('Please enter a protein sequence');
    
    const result = await predictSequence(sequence);
    displayResults(result);
});

fastaUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    const content = await file.text();
    sequenceInput.value = content;
});

function displayResults(result) {
    resultsDiv.classList.remove('hidden');
    
    // Display main prediction
    predictionOutput.innerHTML = `
        <h3>Prediction: ${result.predictedFamily}</h3>
        <p>Confidence: ${(result.confidence * 100).toFixed(2)}%</p>
        <p>Sequence (truncated): ${result.sequence}</p>
    `;
    
    // Display probabilities chart
    renderProbabilityChart(result.probabilities);
}

function renderProbabilityChart(probabilities) {
    const ctx = document.createElement('canvas');
    chartDiv.innerHTML = '';
    chartDiv.appendChild(ctx);
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: probabilities.map(p => p.family),
            datasets: [{
                label: 'Probability',
                data: probabilities.map(p => p.probability),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(199, 199, 199, 0.7)'
                ]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}
