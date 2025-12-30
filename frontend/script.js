let array = [];
let delay = 300; // Delay in milliseconds
let order = 'asc'; // Default sorting order
let sorting = false; // To prevent concurrent sorting

// Function to play sound
function playSound(id, loop = false) {
    const sound = document.getElementById(id);
    if (sound) {
        sound.loop = loop;
        sound.currentTime = 0; // Reset sound to the beginning
        sound.play();
    }
}

// Function to pause execution for animation delay
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Generate random array
function generateArray() {
    playSound('click-sound');
    const size = parseInt(document.getElementById('array-size').value);
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 100));

    // Ensure array values are within bounds for visualization
    const maxArrayValue = Math.max(...array);
    const maxHeight = document.getElementById('array').clientHeight;
    const scaleFactor = maxHeight / Math.max(1, maxArrayValue);
    array = array.map(value => value * scaleFactor);

    renderArray();
}

// Render array as bars
function renderArray() {
    const container = document.getElementById('array');
    container.innerHTML = '';
    const barWidth = Math.floor(container.clientWidth / array.length);

    array.forEach(value => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value}px`; // Set bar height
        bar.style.width = `${barWidth}px`;
        bar.innerText = Math.round(value / (document.getElementById('array').clientHeight / 100)); // Display original value for reference
        container.appendChild(bar);
    });
}

// Update time complexity display
function updateTimeComplexity(algorithm, complexity) {
    const complexityText = `Time Complexity (${algorithm}): ${complexity}`;
    document.getElementById('time-complexity').innerText = complexityText;
}

// Start sorting process
async function startSorting() {
    if (sorting) return; // Prevent concurrent sorting

    sorting = true;
    playSound('click-sound');
    playSound('traverse-sound', true);
    order = document.getElementById('order').value; // Get the sorting order
    const algorithm = document.getElementById('algorithm-select').value;

    document.getElementById('winMessage').style.display = 'none';

    // Color for different sorting algorithms
    const algorithmColors = {
        'bubble': '#FF5722',
        'selection': '#4CAF50',
        'insertion': '#2196F3',
        'merge': '#FFC107',
        'quick': '#9C27B0',
        'heap': '#FF9800',
        // 'bucket': '#03A9F4',
        // 'radix': '#E91E63',
        // 'count': '#00BCD4'
    };
    document.querySelectorAll('.bar').forEach(bar => bar.style.backgroundColor = algorithmColors[algorithm]);

    switch (algorithm) {
        case 'bubble': await bubbleSort(); break;
        case 'selection': await selectionSort(); break;
        case 'insertion': await insertionSort(); break;
        case 'merge': await mergeSort(0, array.length - 1); break;
        case 'quick': await quickSort(0, array.length - 1); break;
        case 'heap': await heapSort(); break;
    }

    sorting = false;
    playSound('over-sound');
    playSound('traverse-sound', false);
    document.getElementById('winMessage').style.display = 'block';
}

// Sorting Algorithms
async function bubbleSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if ((order === 'asc' && array[j] > array[j + 1]) || (order === 'desc' && array[j] < array[j + 1])) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                renderArray();
                await sleep(delay);
            }
        }
    }
    updateTimeComplexity('Bubble Sort', 'O(n^2)');
}

async function selectionSort() {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < n; j++) {
            if ((order === 'asc' && array[j] < array[minIndex]) || (order === 'desc' && array[j] > array[minIndex])) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            renderArray();
            await sleep(delay);
        }
    }
    updateTimeComplexity('Selection Sort', 'O(n^2)');
}

async function insertionSort() {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        const key = array[i];
        let j = i - 1;
        while (j >= 0 && ((order === 'asc' && array[j] > key) || (order === 'desc' && array[j] < key))) {
            array[j + 1] = array[j];
            j--;
            renderArray();
            await sleep(delay);
        }
        array[j + 1] = key;
        renderArray();
        await sleep(delay);
    }
    updateTimeComplexity('Insertion Sort', 'O(n^2)');
}

// Implement Merge Sort
async function mergeSort(left, right) {
    if (left < right) {
        const mid = Math.floor((left + right) / 2);
        await mergeSort(left, mid);
        await mergeSort(mid + 1, right);
        await merge(left, mid, right);
    }
    updateTimeComplexity('Merge Sort', 'O(n log n)');
}

async function merge(left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < n1 && j < n2) {
        if ((order === 'asc' && leftArr[i] <= rightArr[j]) || (order === 'desc' && leftArr[i] >= rightArr[j])) {
            array[k] = leftArr[i];
            i++;
        } else {
            array[k] = rightArr[j];
            j++;
        }
        renderArray();
        await sleep(delay);
        k++;
    }
    while (i < n1) {
        array[k] = leftArr[i];
        i++;
        k++;
    }
    while (j < n2) {
        array[k] = rightArr[j];
        j++;
        k++;
    }
    renderArray();
}

// Implement Quick Sort
async function quickSort(low, high) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
    updateTimeComplexity('Quick Sort', 'O(n log n)');
}

async function partition(low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        if ((order === 'asc' && array[j] < pivot) || (order === 'desc' && array[j] > pivot)) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            renderArray();
            await sleep(delay);
        }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    renderArray();
    return i + 1;
}

// Implement Heap Sort
async function heapSort() {
    const n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        [array[0], array[i]] = [array[i], array[0]];
        renderArray();
        await sleep(delay);
        await heapify(i, 0);
    }
    updateTimeComplexity('Heap Sort', 'O(n log n)');
}

async function heapify(n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && ((order === 'asc' && array[left] > array[largest]) || (order === 'desc' && array[left] < array[largest]))) {
        largest = left;
    }
    if (right < n && ((order === 'asc' && array[right] > array[largest]) || (order === 'desc' && array[right] < array[largest]))) {
        largest = right;
    }
    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        renderArray();
        await sleep(delay);
        await heapify(n, largest);
    }
}

// Initial array generation
generateArray();
