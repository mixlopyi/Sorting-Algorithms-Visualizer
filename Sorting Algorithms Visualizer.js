// DOM elements - References to HTML elements for manipulation
const visualization = document.getElementById('visualization');
const algorithmSelect = document.getElementById('algorithm');
const arraySizeInput = document.getElementById('array-size');
const arrayTypeSelect = document.getElementById('array-type');
const arrayInput = document.getElementById('array-input');
const customArrayRow = document.getElementById('custom-array-row');
const generateBtn = document.getElementById('generate-btn');
const startBtn = document.getElementById('start-btn');
const pauseBtn = document.getElementById('pause-btn');
const resetBtn = document.getElementById('reset-btn');
const speedControl = document.getElementById('speed');
const speedValue = document.getElementById('speed-value');
const pseudoCodeElement = document.getElementById('pseudo-code');
const bestCaseElement = document.getElementById('best-case');
const averageCaseElement = document.getElementById('average-case');
const worstCaseElement = document.getElementById('worst-case');
const actualTimeElement = document.getElementById('actual-time');
const timeEquationElement = document.getElementById('time-equation');
const originalArrayElement = document.getElementById('original-array');
const currentArrayElement = document.getElementById('current-array');
const sortedArrayElement = document.getElementById('sorted-array');
const algorithmExplanationElement = document.getElementById('algorithm-explanation');
const sortingStatusElement = document.getElementById('sorting-status'); // Added for status indicator

// State variables - Track the current state of the application
let array = [];                // Current array being displayed
let originalArray = [];        // Original unsorted array
let sortedArray = [];          // Final sorted array
let isSorting = false;         // Flag to track if sorting is in progress
let isPaused = false;          // Flag to track if sorting is paused
let animationSpeed = 1000 / 10; // Default animation speed (milliseconds)
let startTime, endTime;        // Timing variables for performance measurement
let animationFrames = [];      // Stores each step of the sorting process for animation
let currentFrame = 0;          // Current frame being displayed in the animation
let animationTimeout = null;   // Reference to the timeout for animation control
let comparisons = 0;           // Counter for number of comparisons
let swaps = 0;                 // Counter for number of swaps/writes

// Arabic translations for algorithm explanations
const arabicExplanations = {
    bubble: "خوارزمية الترتيب الفقاعي تعمل بشكل متكرر على المرور عبر القائمة، ومقارنة العناصر المتجاورة وتبديلها إذا كانت بترتيب خاطئ. يتم تكرار المرور عبر القائمة حتى لا تكون هناك حاجة للتبديل.",
    
    insertion: "خوارزمية ترتيب الإدراج تبني المصفوفة المرتبة النهائية عنصرًا تلو الآخر عن طريق أخذ العنصر التالي بشكل متكرر وإدراجه في الموضع الصحيح في الجزء المرتب مسبقًا.",
    
    selection: "خوارزمية ترتيب الاختيار تقسم المدخلات إلى منطقة مرتبة وأخرى غير مرتبة، وتختار بشكل متكرر أصغر عنصر من المنطقة غير المرتبة وتنقله إلى نهاية المنطقة المرتبة.",
    
    merge: "خوارزمية ترتيب الدمج هي خوارزمية تقسيم واستحواذ تقوم بتقسيم القائمة بشكل متكرر إلى نصفين، وترتيبهما، ثم دمج النصفين المرتبين. أداؤها متسق بغض النظر عن بيانات الإدخال.",
    
    quick: "خوارزمية الترتيب السريع هي خوارزمية تقسيم واستحواذ تختار عنصر 'محور' وتقسم المصفوفة حول هذا المحور، بحيث توضع العناصر الأصغر قبله والعناصر الأكبر بعده.",
    
    heap: "خوارزمية ترتيب الكومة تحول المصفوفة إلى كومة قصوى، ثم تستخرج بشكل متكرر العنصر الأقصى من الكومة وتعيد بناء الكومة. أداؤها متسق بغض النظر عن بيانات الإدخال.",
    
    shell: "خوارزمية ترتيب شل هي تعميم لترتيب الإدراج يسمح بتبادل العناصر المتباعدة باستخدام سلسلة من الفجوات. يعتمد الأداء على تسلسل الفجوات المستخدم.",
    
    counting: "خوارزمية ترتيب العد تعمل عن طريق حساب عدد الكائنات التي لها قيم مفاتيح متميزة، ثم إجراء العمليات الحسابية لحساب مواضع كل مفتاح في تسلسل الإخراج. 'n' هو عدد العناصر، و'k' هو نطاق قيم الإدخال.",
    
    radix: "خوارزمية ترتيب الجذر تعالج أرقام الأعداد عن طريق تجميع الأرقام حسب كل خانة، بدءًا من الخانة الأقل أهمية إلى الخانة الأكثر أهمية. 'n' هو عدد العناصر، و'k' هو عدد الأرقام أو الحد الأقصى لطول المفتاح.",
    
    bucket: "خوارزمية ترتيب الدلو توزع عناصر المصفوفة في عدد من الدلاء. يتم ترتيب كل دلو بشكل فردي، إما باستخدام خوارزمية ترتيب مختلفة أو بتطبيق ترتيب الدلو بشكل متكرر. 'n' هو عدد العناصر، و'k' هو عدد الدلاء.",
    
    cocktail: "خوارزمية ترتيب الكوكتيل هي تحسين لخوارزمية الترتيب الفقاعي حيث تعمل في كلا الاتجاهين. تقوم بمرور للأمام (من الأسفل إلى الأعلى) ثم مرور للخلف (من الأعلى إلى الأسفل) في كل تكرار، مما يساعد على تحريك العناصر الصغيرة والكبيرة بشكل أسرع إلى مواقعها النهائية.",
    
    comb: "خوارزمية ترتيب المشط هي تحسين لخوارزمية الترتيب الفقاعي تستخدم فجوة تتقلص تدريجيًا. تبدأ بفجوة كبيرة وتقلصها في كل تكرار، مما يساعد على تحريك العناصر البعيدة بسرعة أكبر وتجنب مشكلة 'السلاحف' في الترتيب الفقاعي."
};

// Algorithm information with detailed time complexity analysis and pseudocode
const algorithmInfo = {
    bubble: {
        name: "Bubble Sort",
        pseudoCode: `procedure bubbleSort(A : list of sortable items)
    n := length(A)
    repeat
        swapped := false
        for i := 1 to n-1 inclusive do
            if A[i-1] > A[i] then
                swap(A[i-1], A[i])
                swapped = true
            end if
        end for
        n := n - 1
    until not swapped
end procedure`,
        bestCase: "O(n)",
        bestCaseAcademic: "Ω(n)",
        averageCase: "O(n²)",
        averageCaseAcademic: "Θ(n²)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Bubble sort repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order. The pass through the list is repeated until no swaps are needed."
    },
    insertion: {
        name: "Insertion Sort",
        pseudoCode: `procedure insertionSort(A : list of sortable items)
    for i := 1 to length(A) - 1 do
        key := A[i]
        j := i - 1
        while j >= 0 and A[j] > key do
            A[j+1] := A[j]
            j := j - 1
        end while
        A[j+1] := key
    end for
end procedure`,
        bestCase: "O(n)",
        bestCaseAcademic: "Ω(n)",
        averageCase: "O(n²)",
        averageCaseAcademic: "Θ(n²)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Insertion sort builds the final sorted array one item at a time by repeatedly taking the next item and inserting it into the correct position in the already-sorted portion."
    },
    selection: {
        name: "Selection Sort",
        pseudoCode: `procedure selectionSort(A : list of sortable items)
    n := length(A)
    for i := 0 to n-2 do
        minIndex := i
        for j := i+1 to n-1 do
            if A[j] < A[minIndex] then
                minIndex := j
            end if
        end for
        if minIndex != i then
            swap(A[i], A[minIndex])
        end if
    end for
end procedure`,
        bestCase: "O(n²)",
        bestCaseAcademic: "Ω(n²)",
        averageCase: "O(n²)",
        averageCaseAcademic: "Θ(n²)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Selection sort divides the input into a sorted and unsorted region, and repeatedly selects the smallest element from the unsorted region and moves it to the end of the sorted region."
    },
    merge: {
        name: "Merge Sort",
        pseudoCode: `procedure mergeSort(A : list of sortable items)
    if length(A) <= 1 then
        return A
    end if

    middle := length(A) / 2
    left := A[0..middle-1]
    right := A[middle..length(A)-1]

    left := mergeSort(left)
    right := mergeSort(right)

    return merge(left, right)
end procedure

procedure merge(left, right)
    result := []
    while left is not empty and right is not empty do
        if first(left) <= first(right) then
            append first(left) to result
            left := rest(left)
        else
            append first(right) to result
            right := rest(right)
        end if
    end while

    while left is not empty do
        append first(left) to result
        left := rest(left)
    end while

    while right is not empty do
        append first(right) to result
        right := rest(right)
    end while

    return result
end procedure`,
        bestCase: "O(n log n)",
        bestCaseAcademic: "Ω(n log n)",
        averageCase: "O(n log n)",
        averageCaseAcademic: "Θ(n log n)",
        worstCase: "O(n log n)",
        worstCaseAcademic: "O(n log n)",
        spaceComplexity: "O(n)",
        explanation: "Merge sort is a divide-and-conquer algorithm that recursively divides the list into halves, sorts them, and then merges the sorted halves. It has consistent performance regardless of input data."
    },
    quick: {
        name: "Quick Sort",
        pseudoCode: `procedure quickSort(A : list of sortable items, low, high)
    if low < high then
        p := partition(A, low, high)
        quickSort(A, low, p - 1)
        quickSort(A, p + 1, high)
    end if
end procedure

procedure partition(A, low, high)
    pivot := A[high]
    i := low
    for j := low to high-1 do
        if A[j] < pivot then
            swap(A[i], A[j])
            i := i + 1
        end if
    end for
    swap(A[i], A[high])
    return i
end procedure`,
        bestCase: "O(n log n)",
        bestCaseAcademic: "Ω(n log n)",
        averageCase: "O(n log n)",
        averageCaseAcademic: "Θ(n log n)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
        spaceComplexity: "O(log n)",
        explanation: "Quick sort is a divide-and-conquer algorithm that selects a 'pivot' element and partitions the array around the pivot, placing smaller elements before it and larger elements after it."
    },
    heap: {
        name: "Heap Sort",
        pseudoCode: `procedure heapSort(A : list of sortable items)
    n := length(A)
    // Build max heap
    for i := floor(n/2) - 1 downto 0 do
        heapify(A, n, i)
    end for

    // Extract elements from heap
    for i := n-1 downto 1 do
        swap(A[0], A[i])
        heapify(A, i, 0)
    end for
end procedure

procedure heapify(A, n, i)
    largest := i
    left := 2*i + 1
    right := 2*i + 2

    if left < n and A[left] > A[largest] then
        largest = left
    end if

    if right < n and A[right] > A[largest] then
        largest = right
    end if

    if largest != i then
        swap(A[i], A[largest])
        heapify(A, n, largest)
    end if
end procedure`,
        bestCase: "O(n log n)",
        bestCaseAcademic: "Ω(n log n)",
        averageCase: "O(n log n)",
        averageCaseAcademic: "Θ(n log n)",
        worstCase: "O(n log n)",
        worstCaseAcademic: "O(n log n)",
        spaceComplexity: "O(1)",
        explanation: "Heap sort converts the array into a max-heap, then repeatedly extracts the maximum element from the heap and rebuilds the heap. It has consistent performance regardless of input data."
    },
    shell: {
        name: "Shell Sort",
        pseudoCode: `procedure shellSort(A : list of sortable items)
    n := length(A)
    gap := floor(n/2)

    while gap > 0 do
        for i := gap to n-1 do
            temp := A[i]
            j := i
            while j >= gap and A[j-gap] > temp do
                A[j] := A[j-gap]
                j := j - gap
            end while
            A[j] := temp
        end for
        gap := floor(gap/2)
    end while
end procedure`,
        bestCase: "O(n log n)",
        bestCaseAcademic: "Ω(n log n)",
        averageCase: "O(n log² n)",
        averageCaseAcademic: "Θ(n log² n)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Shell sort is a generalization of insertion sort that allows the exchange of items that are far apart by using a sequence of gaps. Performance depends on the gap sequence used."
    },
    counting: {
        name: "Counting Sort",
        pseudoCode: `procedure countingSort(A : list of sortable items)
    n := length(A)
    max := findMax(A)
    min := findMin(A)
    range := max - min + 1

    // Initialize count and output arrays
    count := array of size range initialized to 0
    output := array of size n

    // Store count of each element
    for i := 0 to n-1 do
        count[A[i] - min] := count[A[i] - min] + 1
    end for

    // Change count[i] to be the position of i in output
    for i := 1 to range-1 do
        count[i] := count[i] + count[i-1]
    end for

    // Build the output array
    for i := n-1 downto 0 do
        output[count[A[i] - min] - 1] := A[i]
        count[A[i] - min] := count[A[i] - min] - 1
    end for

    // Copy output to original array
    for i := 0 to n-1 do
        A[i] := output[i]
    end for
end procedure`,
        bestCase: "O(n + k)",
        bestCaseAcademic: "Ω(n + k)",
        averageCase: "O(n + k)",
        averageCaseAcademic: "Θ(n + k)",
        worstCase: "O(n + k)",
        worstCaseAcademic: "O(n + k)",
        spaceComplexity: "O(n + k)",
        explanation: "Counting sort works by counting the number of objects that have distinct key values, then doing arithmetic to calculate the positions of each key in the output sequence. 'n' is the number of elements, 'k' is the range of input values."
    },
    radix: {
        name: "Radix Sort",
        pseudoCode: `procedure radixSort(A : list of sortable items)
    // Split into negatives and positives
    negatives := A filtered for x where x < 0, mapped to -x
    positives := A filtered for x where x >= 0

    // Sort negatives (as positives, then reverse and negate)
    if negatives is not empty then
        radixSortHelper(negatives)
        reverse(negatives)
        for i := 0 to length(negatives)-1 do
            negatives[i] := -negatives[i]
        end for
    end if

    // Sort positives
    if positives is not empty then
        radixSortHelper(positives)
    end if

    // Combine results
    A := concatenate(negatives, positives)
end procedure

procedure radixSortHelper(A)
    max := findMax(A)
    for exp := 1 while max/exp > 0 do
        countingSortByDigit(A, exp)
        exp := exp * 10
    end for
end procedure

procedure countingSortByDigit(A, exp)
    n := length(A)
    output := array of size n
    count := array of size 10 initialized to 0

    for i := 0 to n-1 do
        digit := floor(A[i]/exp) % 10
        count[digit] := count[digit] + 1
    end for

    for i := 1 to 9 do
        count[i] := count[i] + count[i-1]
    end for

    for i := n-1 downto 0 do
        digit := floor(A[i]/exp) % 10
        output[count[digit]-1] := A[i]
        count[digit] := count[digit] - 1
    end for

    for i := 0 to n-1 do
        A[i] := output[i]
    end for
end procedure`,
        bestCase: "O(nk)",
        bestCaseAcademic: "Ω(nk)",
        averageCase: "O(nk)",
        averageCaseAcademic: "Θ(nk)",
        worstCase: "O(nk)",
        worstCaseAcademic: "O(nk)",
        spaceComplexity: "O(n + k)",
        explanation: "Radix sort processes the digits of numbers by grouping numbers by each digit, starting from the least significant digit to the most significant. 'n' is the number of elements, 'k' is the number of digits or max key length."
    },
    bucket: {
        name: "Bucket Sort",
        pseudoCode: `procedure bucketSort(A : list of sortable items)
    n := length(A)
    if n <= 0 then return end if

    maxVal := findMax(A)
    minVal := findMin(A)
    range := maxVal - minVal + 1
    bucketCount := floor(sqrt(n))
    buckets := array of bucketCount empty lists

    // Scatter elements into buckets
    for i := 0 to n-1 do
        normalized := (A[i] - minVal) / range
        bucketIdx := min(floor(normalized * bucketCount), bucketCount - 1)
        append A[i] to buckets[bucketIdx]
    end for

    // Sort individual buckets
    for i := 0 to bucketCount-1 do
        insertionSort(buckets[i])
    end for

    // Concatenate all buckets
    index := 0
    for i := 0 to bucketCount-1 do
        for j := 0 to length(buckets[i])-1 do
            A[index] := buckets[i][j]
            index := index + 1
        end for
    end for
end procedure`,
        bestCase: "O(n + k)",
        bestCaseAcademic: "Ω(n + k)",
        averageCase: "O(n + k)",
        averageCaseAcademic: "Θ(n + k)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
        spaceComplexity: "O(n + k)",
        explanation: "Bucket sort distributes the elements of an array into a number of buckets. Each bucket is then sorted individually, either using a different sorting algorithm or recursively applying bucket sort. 'n' is the number of elements, 'k' is the number of buckets."
    },
    cocktail: {
        name: "Cocktail Shaker Sort",
        pseudoCode: `procedure cocktailShakerSort(A : list of sortable items)
    n := length(A)
    swapped := true
    start := 0
    end := n - 1
    
    while swapped do
        // Forward pass (like bubble sort)
        swapped := false
        for i := start to end - 1 do
            if A[i] > A[i+1] then
                swap(A[i], A[i+1])
                swapped := true
            end if
        end for
        
        if not swapped then
            break
        end if
        
        // Decrease end because largest element is now at the end
        end := end - 1
        
        // Backward pass
        swapped := false
        for i := end - 1 downto start do
            if A[i] > A[i+1] then
                swap(A[i], A[i+1])
                swapped := true
            end if
        end for
        
        // Increase start because smallest element is now at the start
        start := start + 1
    end while
end procedure`,
        bestCase: "O(n)",
        bestCaseAcademic: "Ω(n)",
        averageCase: "O(n²)",
        averageCaseAcademic:"Θ(n²)",
        worstCase: "O(n²)",
        worstCaseAcademic:"O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Cocktail Shaker Sort is a variation of Bubble Sort that sorts in both directions. It passes through the list from bottom to top and then from top to bottom, hence the name 'cocktail shaker'."
    },
    comb: {
        name: "Comb Sort",
        pseudoCode: `procedure combSort(A : list of sortable items)
    n := length(A)
    gap := n
    shrink := 1.3
    sorted := false
    
    while not sorted do
        // Update gap
        gap := floor(gap / shrink)
        if gap <= 1 then
            gap := 1
            sorted := true
        end if
        
        // Compare elements with gap
        for i := 0 to n - gap - 1 do
            if A[i] > A[i + gap] then
                swap(A[i], A[i + gap])
                sorted := false
            end if
        end for
    end while
end procedure`,
        bestCase: "O(n log n)",
        bestCaseAcademic:"Ω(n)",
        averageCase: "O(n²)",
         averageCaseAcademic:"Θ(n²)",
        worstCase: "O(n²)",
         worstCaseAcademic:"O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Comb Sort improves on Bubble Sort by using a gap sequence to eliminate small values near the end of the list. The gap starts large and shrinks by a factor (usually 1.3) until it reaches 1."
    }
};

// Helper functions

/**
 * Finds the maximum value in an array
 * @param {Array} arr - The input array
 * @returns {number} - The maximum value
 */
function findMax(arr) {
    return Math.max(...arr);
}

/**
 * Finds the minimum value in an array
 * @param {Array} arr - The input array
 * @returns {number} - The minimum value
 */
function findMin(arr) {
    return Math.min(...arr);
}

/**
 * Initializes the application and sets up event listeners
 */
function init() {
    // Dark mode toggle setup
    const darkToggle = document.getElementById('dark-mode-toggle');
    darkToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        localStorage.setItem('darkMode', this.checked);
    });

    // Load dark mode preference from local storage
    if (localStorage.getItem('darkMode') === 'true') {
        darkToggle.checked = true;
        document.body.classList.add('dark-mode');
    }
    
    // No toggle needed for academic notation - both are displayed statically
    
    // Language toggle setup
    const languageToggle = document.getElementById('language-toggle');
    languageToggle.addEventListener('change', function() {
        document.body.classList.toggle('arabic-language', this.checked);
        localStorage.setItem('arabicLanguage', this.checked);
        
        // Update explanation for current algorithm
        updateExplanationLanguage(algorithmSelect.value);
    });
    
    // Load language preference from local storage
    if (localStorage.getItem('arabicLanguage') === 'true') {
        languageToggle.checked = true;
        document.body.classList.add('arabic-language');
    }

    // Initialize algorithm info and generate initial array
    updateAlgorithmInfo();
    generateArray();
    
    // Set up event listeners for UI controls
    algorithmSelect.addEventListener('change', updateAlgorithmInfo);
    arrayTypeSelect.addEventListener('change', toggleCustomArrayInput);
    generateBtn.addEventListener('click', generateArray);
    startBtn.addEventListener('click', startSorting);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetVisualization);
    speedControl.addEventListener('input', updateSpeed);
    
    // Initialize speed display
    updateSpeed();
}
/**
 * Updates the algorithm information display based on the selected algorithm
 */
function updateAlgorithmInfo() {
    const selectedAlgorithm = algorithmSelect.value;
    const info = algorithmInfo[selectedAlgorithm];
    
    pseudoCodeElement.textContent = info.pseudoCode;
    bestCaseElement.textContent = info.bestCase;
    averageCaseElement.textContent = info.averageCase;
    worstCaseElement.textContent = info.worstCase;
    
    // Update academic notation
    document.getElementById('best-case-academic').textContent = info.bestCaseAcademic;
    document.getElementById('average-case-academic').textContent = info.averageCaseAcademic;
    document.getElementById("worst-case-academic").textContent = info.worstCaseAcademic;
    document.getElementById("space-complexity").textContent = info.spaceComplexity; // Added space complexity display
    
    // Update the algorithm explanation based on current language
    updateExplanationLanguage(selectedAlgorithm);
}

/**
 * Updates the explanation text based on the current language selection
 */
function updateExplanationLanguage(algorithm) {
    const isArabic = document.body.classList.contains('arabic-language');
    const info = algorithmInfo[algorithm];
    
    if (isArabic && arabicExplanations[algorithm]) {
        algorithmExplanationElement.textContent = arabicExplanations[algorithm];
        algorithmExplanationElement.dir = "rtl"; // Right-to-left text direction for Arabic
    } else {
        algorithmExplanationElement.textContent = info.explanation;
        algorithmExplanationElement.dir = "ltr"; // Left-to-right text direction for English
    }
}

/**
 * Toggles visibility of custom array input based on array type selection
 */
function toggleCustomArrayInput() {
    customArrayRow.style.display = arrayTypeSelect.value === 'custom' ? 'flex' : 'none';
}


/**
 * Updates animation speed based on speed control value
 */
function updateSpeed() {
    const speed = parseInt(speedControl.value);
    speedValue.textContent = speed;
    animationSpeed = 1000 / speed;
}

/**
 * Generates a new array based on current settings
 */
function generateArray() {
    if (isSorting) return;
    
    const size = parseInt(arraySizeInput.value);
    const type = arrayTypeSelect.value;
    
    if (type === 'custom') {
        // Handle custom array input
        const customInput = arrayInput.value.trim();
        if (customInput) {
            array = customInput.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num));
            if (array.length < 3) {
                alert("Please enter at least 3 valid numbers separated by commas");
                array = generateRandomArray(10);
            }
        } else {
            array = generateRandomArray(size);
        }
    } else {
        // Generate array based on selected type
        array = [];
        for (let i = 1; i <= size; i++) {
            array.push(i);
        }
        
        switch (type) {
            case 'random':
                shuffleArray(array);
                break;
            case 'reverse':
                array.reverse();
                break;
            case 'almost':
                shuffleArray(array);
                // Make it almost sorted by swapping a few elements
                const swaps = Math.floor(size * 0.2);
                for (let i = 0; i < swaps; i++) {
                    const idx1 = Math.floor(Math.random() * size);
                    const idx2 = Math.floor(Math.random() * size);
                    [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
                }
                break;
            // 'sorted' is already handled by default
        }
    }
    
    // Ensure array size is within limits
    if (array.length > 50) {
        array = array.slice(0, 50);
        alert("Array size limited to 50 elements");
    }
    if (array.length < 3) {
        array = generateRandomArray(10);
    }
    
    // Store the original array
    originalArray = [...array];
    sortedArray = [];
    
    // Update array displays
    updateArrayDisplays();
    
    renderArray();
    resetVisualization();
}

/**
 * Updates the array displays with current array values
 */
function updateArrayDisplays() {
    originalArrayElement.textContent = originalArray.join(', ');
    currentArrayElement.textContent = array.join(', ');
    if (sortedArray.length > 0) {
        sortedArrayElement.textContent = sortedArray.join(', ');
    } else {
        sortedArrayElement.textContent = "Not sorted yet";
    }
}

/**
 * Generates a random array of specified size
 * @param {number} size - The size of the array to generate
 * @returns {Array} - The generated random array
 */
function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 100) + 1);
    }
    return arr;
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 * @param {Array} array - The array to shuffle
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * Renders the array as bars in the visualization container
 * @param {Object} state - The current state of the sorting process
 */
function renderArray(state = {}) {
    visualization.innerHTML = '';
    const maxValue = Math.max(...array, 1); // Ensure at least 1 to avoid division by zero
    const containerHeight = visualization.clientHeight;
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        
        // Calculate height (scale to fit container)
        const height = (value / maxValue) * containerHeight * 0.9;
        bar.style.height = `${height}px`;
        
        // Add value label
        const label = document.createElement('div');
        label.textContent = value;
        label.style.position = 'absolute';
        label.style.bottom = '-20px';
        label.style.width = '100%';
        label.style.textAlign = 'center';
        label.style.fontSize = '12px';
        bar.appendChild(label);
        
        // Apply state classes
        if (state.comparing && (state.comparing.includes(index))) {
            bar.classList.add('comparing');
        }
        if (state.sorted && state.sorted.includes(index)) {
            bar.classList.add('sorted');
        }
        if (state.pivot === index) {
            bar.classList.add('pivot');
        }
        if (state.min === index) {
            bar.classList.add('min');
        }
        
        visualization.appendChild(bar);
    });
}

/**
 * Starts the sorting process with the selected algorithm
 */
function startSorting() {
    if (isSorting) return;
    
    isSorting = true;
    isPaused = false;
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-flex';
    pauseBtn.textContent = 'Pause';
    generateBtn.disabled = true;
    algorithmSelect.disabled = true;
    arraySizeInput.disabled = true;
    arrayTypeSelect.disabled = true;
    arrayInput.disabled = true;
    resetBtn.disabled = false;
    
    // Reset animation frames and counters
    animationFrames = [];
    currentFrame = 0;
    comparisons = 0;
    swaps = 0;
    
    // Record start time
    startTime = performance.now();
    sortingStatusElement.textContent = "Sorting..."; // Show status
    
    // Clone the array for sorting
    const sortingArray = [...array];
    
    // Get the selected algorithm
    const algorithm = algorithmSelect.value;
    
    // Clear previous sorted array
    sortedArray = [];
    updateArrayDisplays();
    
    // Execute the appropriate sorting algorithm
    switch (algorithm) {
        case 'bubble':
            bubbleSort(sortingArray);
            break;
        case 'insertion':
            insertionSort(sortingArray);
            break;
        case 'selection':
            selectionSort(sortingArray);
            break;
        case 'merge':
            mergeSort(sortingArray);
            break;
        case 'quick':
            quickSort(sortingArray);
            break;
        case 'heap':
            heapSort(sortingArray);
            break;
        case 'shell':
            shellSort(sortingArray);
            break;
        case 'counting':
            countingSort(sortingArray);
            break;
        case 'radix':
            radixSort(sortingArray);
            break;
        case 'bucket':
            bucketSort(sortingArray);
            break;
        case 'cocktail':
            cocktailSort(sortingArray);
            break;
        case 'comb':
            combSort(sortingArray);
            break;
    }
    
    // Store the sorted array
    sortedArray = [...sortingArray];
    
    // Add final frame where all elements are sorted
    animationFrames.push({
        array: [...sortingArray],
        sorted: Array.from({ length: sortingArray.length }, (_, i) => i)
    });
    
    // Start animation
    animateSorting();
}

/**
 * Toggles pause/resume of sorting animation
 */
function togglePause() {
    if (!isSorting) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        clearTimeout(animationTimeout);
        pauseBtn.textContent = 'Resume';
    } else {
        pauseBtn.textContent = 'Pause';
        animateSorting();
    }
}

/**
 * Animates the sorting process frame by frame
 */
function animateSorting() {
    if (isPaused || currentFrame >= animationFrames.length) {
        if (currentFrame >= animationFrames.length) {
            // Sorting complete
            endTime = performance.now();
            const executionTime = (endTime - startTime).toFixed(2);
            actualTimeElement.textContent = `${executionTime} ms (${comparisons} comparisons, ${swaps} swaps)`;
            
            // Update the current array display to show the final sorted array
            array = [...sortedArray];
            updateArrayDisplays();
            
            displayTimeComplexity();
            
            isSorting = false;
            startBtn.style.display = 'inline-flex';
            pauseBtn.style.display = 'none';
            sortingStatusElement.textContent = "Done"; // Show status
        }
        return;
    }
    
    const frame = animationFrames[currentFrame];
    
    // Update the current array state for display
    array = [...frame.array];
    updateArrayDisplays();
    
    renderArray(frame);
    currentFrame++;
    
    animationTimeout = setTimeout(animateSorting, animationSpeed);
}

/**
 * Resets the visualization to its initial state
 */
function resetVisualization() {
    isSorting = false;
    isPaused = false;
    clearTimeout(animationTimeout);
    startBtn.style.display = 'inline-flex';
    pauseBtn.style.display = 'none';
    startBtn.disabled = false;
    generateBtn.disabled = false;
    algorithmSelect.disabled = false;
    arraySizeInput.disabled = false;
    arrayTypeSelect.disabled = false;
    arrayInput.disabled = false;
    resetBtn.disabled = true;
    
    // Reset to original array
    array = [...originalArray];
    sortedArray = [];
    updateArrayDisplays();
    
    renderArray();
    actualTimeElement.textContent = "Not run yet";
    timeEquationElement.textContent = "The time complexity equation will appear here after sorting completes.";
    sortingStatusElement.textContent = ""; // Clear status
}

/**
 * Displays time complexity explanation based on array type and algorithm
 */
function displayTimeComplexity() {
    const algorithm = algorithmSelect.value;
    const info = algorithmInfo[algorithm];
    const size = array.length;
    const arrayType = arrayTypeSelect.value;
    
    let equation = "";
    let solution = "";
    let actualComplexity = "";
    
    // Determine the actual complexity based on array type
    switch (algorithm) {
        case 'bubble':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n) - Best case (already sorted)";
            } else if (arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (reverse sorted)";
            } else {
                actualComplexity = "Θ(n²) - Average case";
            }
            break;
        case 'insertion':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n) - Best case (already sorted)";
            } else if (arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (reverse sorted)";
            } else if (arrayType === 'almost') {
                actualComplexity = "Θ(n + d) - Where d is number of inversions (almost sorted)";
            } else {
                actualComplexity = "Θ(n²) - Average case";
            }
            break;
        case 'selection':
            actualComplexity = "Θ(n²) - Always performs the same regardless of input";
            break;
        case 'merge':
            actualComplexity = "Θ(n log n) - Always performs the same regardless of input";
            break;
        case 'quick':
            if (arrayType === 'sorted' || arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (already sorted or reverse sorted)";
            } else {
                actualComplexity = "Θ(n log n) - Average case";
            }
            break;
        case 'heap':
            actualComplexity = "Θ(n log n) - Always performs the same regardless of input";
            break;
        case 'shell':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n log n) - Best case (already sorted)";
            } else if (arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (reverse sorted)";
            } else {
                actualComplexity = "Θ(n log² n) - Average case (depends on gap sequence)";
            }
            break;
        case 'counting':
            const max = Math.max(...array);
            const min = Math.min(...array);
            const range = max - min + 1;
            actualComplexity = `Θ(n + k) where k=${range} (range of values)`;
            break;
        case 'radix':
            const maxRadix = Math.max(...array.map(Math.abs));
            const digits = maxRadix > 0 ? Math.floor(Math.log10(maxRadix)) + 1 : 1;
            actualComplexity = `Θ(nk) where k=${digits} (number of digits)`;
            break;
        case 'bucket':
            if (arrayType === 'sorted' || arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (all elements fall into one bucket)";
            } else {
                actualComplexity = "Θ(n + k) - Average case where k is number of buckets";
            }
            break;
        case 'cocktail':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n) - Best case (already sorted)";
            } else if (arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (reverse sorted)";
            } else {
                actualComplexity = "Θ(n²) - Average case";
            }
            break;
        case 'comb':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n log n) - Best case (already sorted)";
            } else if (arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (reverse sorted)";
            } else {
                actualComplexity = "Θ(n²/2^p) - Average case (where p depends on shrink factor)";
            }
            break;
    }
    
    // Create the equation and solution based on the algorithm
    switch (algorithm) {
        case 'bubble':
        case 'insertion':
        case 'selection':
        case 'cocktail':
            equation = `O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, worst case is proportional to ${size * size} operations`;
            break;
        case 'merge':
        case 'heap':
            equation = `Θ(n log n) = Θ(${size} log ${size}) ≈ Θ(${size} * ${Math.log2(size).toFixed(2)}) ≈ Θ(${Math.floor(size * Math.log2(size))})`;
            solution = `For array size ${size}, time complexity is proportional to ${Math.floor(size * Math.log2(size))} operations`;
            break;
        case 'quick':
            equation = `Average: Θ(n log n) = Θ(${size} log ${size}) ≈ Θ(${Math.floor(size * Math.log2(size))})\nWorst: O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, average case is proportional to ${Math.floor(size * Math.log2(size))} operations, but worst case is ${size * size} operations`;
            break;
        case 'shell':
            equation = `Best: Ω(n log n)\nAverage: Θ(n log² n)\nWorst: O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, best case is proportional to ${Math.floor(size * Math.log2(size))} operations, but worst case is ${size * size} operations`;
            break;
        case 'counting':
            const max = Math.max(...array);
            const min = Math.min(...array);
            const range = max - min + 1;
            equation = `Θ(n + k) = Θ(${size} + ${range}) = Θ(${size + range})`;
            solution = `For array size ${size} and value range ${range}, time complexity is proportional to ${size + range} operations`;
            break;
        case 'radix':
            const maxRadix = Math.max(...array.map(Math.abs));
            const digits = maxRadix > 0 ? Math.floor(Math.log10(maxRadix)) + 1 : 1;
            equation = `Θ(nk) = Θ(${size} * ${digits}) = Θ(${size * digits})`;
            solution = `For array size ${size} and max digits ${digits}, time complexity is proportional to ${size * digits} operations`;
            break;
        case 'bucket':
            equation = `Best: Ω(n + k)\nAverage: Θ(n + k)\nWorst: O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, best and average cases are linear with the number of buckets, but worst case (when all elements fall into one bucket) is ${size * size} operations`;
            break;
        case 'comb':
            equation = `Best: Ω(n log n)\nAverage: Θ(n²/2^p)\nWorst: O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, best case is proportional to ${Math.floor(size * Math.log2(size))} operations, but worst case is ${size * size} operations`;
            break;
    }
    
    timeEquationElement.innerHTML = `
        <strong>Algorithm:</strong> ${info.name}<br>
        <strong>Array Type:</strong> ${arrayType}<br>
        <strong>Actual Complexity:</strong> ${actualComplexity}<br><br>
        <strong>Time Complexity Calculation:</strong><br>${equation}<br><br>
        <strong>Explanation:</strong><br>${solution}<br><br>
        <strong>Statistics:</strong><br>Comparisons: ${comparisons}, Swaps/Writes: ${swaps}<br><br>
        ${info.explanation}`;
}

// Sorting algorithms with animation frames

/**
 * Implements Bubble Sort algorithm
 * @param {Array} arr - The array to sort
 */
function bubbleSort(arr) {
    let n = arr.length;
    let swapped;
    
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            // Record comparison
            comparisons++;
            animationFrames.push({
                array: [...arr],
                comparing: [i, i + 1]
            });
            
            if (arr[i] > arr[i + 1]) {
                // Swap elements
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
                swaps++;
                
                // Record swap
                animationFrames.push({
                    array: [...arr],
                    comparing: [i, i + 1]
                });
            }
        }
        n--;
        
        // Mark the last element as sorted
        animationFrames.push({
            array: [...arr],
            sorted: Array.from({ length: arr.length - n }, (_, i) => n + i)
        });
    } while (swapped);
}

/**
 * Implements Insertion Sort algorithm
 * @param {Array} arr - The array to sort
 */
function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        
        // Record initial position
        animationFrames.push({
            array: [...arr],
            comparing: [i, j],
            sorted: Array.from({ length: i }, (_, idx) => idx)
        });
        
        while (j >= 0 && arr[j] > key) {
            // Record comparison
            comparisons++;
            animationFrames.push({
                array: [...arr],
                comparing: [j, j + 1],
                sorted: Array.from({ length: i }, (_, idx) => idx)
            });
            
            arr[j + 1] = arr[j];
            swaps++;
            j--;
            
            // Record shift
            animationFrames.push({
                array: [...arr],
                comparing: [j + 1, j + 2],
                sorted: Array.from({ length: i }, (_, idx) => idx)
            });
        }
        
        arr[j + 1] = key;
        swaps++;
        
        // Record final position
        animationFrames.push({
            array: [...arr],
            sorted: Array.from({ length: i + 1 }, (_, idx) => idx)
        });
    }
}

/**
 * Implements Selection Sort algorithm
 * @param {Array} arr - The array to sort
 */
function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        
        // Record initial min
        animationFrames.push({
            array: [...arr],
            min: minIndex,
            sorted: Array.from({ length: i }, (_, idx) => idx)
        });
        
        for (let j = i + 1; j < arr.length; j++) {
            // Record comparison
            comparisons++;
            animationFrames.push({
                array: [...arr],
                comparing: [minIndex, j],
                min: minIndex,
                sorted: Array.from({ length: i }, (_, idx) => idx)
            });
            
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
                
                // Record new min
                animationFrames.push({
                    array: [...arr],
                    min: minIndex,
                    sorted: Array.from({ length: i }, (_, idx) => idx)
                });
            }
        }
        
        if (minIndex !== i) {
            // Swap elements
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            swaps++;
            
            // Record swap
            animationFrames.push({
                array: [...arr],
                comparing: [i, minIndex],
                sorted: Array.from({ length: i + 1 }, (_, idx) => idx)
            });
        }
        
        // Mark as sorted
        animationFrames.push({
            array: [...arr],
            sorted: Array.from({ length: i + 1 }, (_, idx) => idx)
        });
    }
}

/**
 * Implements Merge Sort algorithm
 * @param {Array} arr - The array to sort
 * @param {number} left - The left index of the subarray
 * @param {number} right - The right index of the subarray
 */
function mergeSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    
    // Record division
    animationFrames.push({
        array: [...arr],
        comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i)
    });
    
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

/**
 * Merges two subarrays for Merge Sort
 * @param {Array} arr - The array containing subarrays to merge
 * @param {number} left - The left index of the first subarray
 * @param {number} mid - The middle index separating the two subarrays
 * @param {number} right - The right index of the second subarray
 */
function merge(arr, left, mid, right) {
    let i = left;
    let j = mid + 1;
    const temp = [];
    
    // Record merge start
    animationFrames.push({
        array: [...arr],
        comparing: [...Array.from({ length: mid - left + 1 }, (_, idx) => left + idx),
                   ...Array.from({ length: right - mid }, (_, idx) => mid + 1 + idx)]
    });
    
    while (i <= mid && j <= right) {
        comparisons++;
        if (arr[i] <= arr[j]) {
            temp.push(arr[i++]);
        } else {
            temp.push(arr[j++]);
        }
    }
    
    while (i <= mid) temp.push(arr[i++]);
    while (j <= right) temp.push(arr[j++]);
    
    for (let k = 0; k < temp.length; k++) {
        arr[left + k] = temp[k];
        swaps++;
        
        // Record merge step
        animationFrames.push({
            array: [...arr],
            comparing: [left + k],
            sorted: Array.from({ length: left + k + 1 }, (_, idx) => idx)
        });
    }
}

/**
 * Implements Quick Sort algorithm
 * @param {Array} arr - The array to sort
 * @param {number} low - The starting index
 * @param {number} high - The ending index
 */
function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

/**
 * Partitions the array for Quick Sort
 * @param {Array} arr - The array to partition
 * @param {number} low - The starting index
 * @param {number} high - The ending index
 * @returns {number} - The partition index
 */
function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    // Record pivot selection
    animationFrames.push({
        array: [...arr],
        pivot: high,
        comparing: [high]
    });
    
    for (let j = low; j < high; j++) {
        // Record comparison
        comparisons++;
        animationFrames.push({
            array: [...arr],
            pivot: high,
            comparing: [j, high]
        });
        
        if (arr[j] < pivot) {
            i++;
            // Swap elements
            [arr[i], arr[j]] = [arr[j], arr[i]];
            swaps++;
            
            // Record swap
            animationFrames.push({
                array: [...arr],
                pivot: high,
                comparing: [i, j]
            });
        }
    }
    
    // Swap pivot to correct position
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swaps++;
    
    // Record final pivot position
    animationFrames.push({
        array: [...arr],
        sorted: [i + 1]
    });
    
    return i + 1;
}

/**
 * Implements Heap Sort algorithm
 * @param {Array} arr - The array to sort
 */
function heapSort(arr) {
    const n = arr.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        [arr[0], arr[i]] = [arr[i], arr[0]];
        swaps++;
        
        // Record swap
        animationFrames.push({
            array: [...arr],
            comparing: [0, i],
            sorted: Array.from({ length: n - i }, (_, idx) => i + idx)
        });
        
        // Heapify reduced heap
        heapify(arr, i, 0);
    }
}

/**
 * Heapifies a subtree rooted at node i
 * @param {Array} arr - The array representing the heap
 * @param {number} n - The size of the heap
 * @param {number} i - The root index of the subtree
 */
function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Record initial heapify
    animationFrames.push({
        array: [...arr],
        comparing: [i, left, right].filter(idx => idx < n),
        min: largest
    });
    
    comparisons++;
    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }
    
    comparisons++;
    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        // Record new largest
        animationFrames.push({
            array: [...arr],
            comparing: [i, largest],
            min: largest
        });
        
        // Swap and continue heapifying
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        swaps++;
        
        // Record swap
        animationFrames.push({
            array: [...arr],
            comparing: [i, largest]
        });
        
        heapify(arr, n, largest);
    }
}

/**
 * Implements Shell Sort algorithm
 * @param {Array} arr - The array to sort
 */
function shellSort(arr) {
    const n = arr.length;
    let gap = Math.floor(n / 2);
    
    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            const temp = arr[i];
            let j = i;
            
            // Record initial position
            animationFrames.push({
                array: [...arr],
                comparing: [i, j - gap]
            });
            
            comparisons++;
            while (j >= gap && arr[j - gap] > temp) {
                // Record comparison
                animationFrames.push({
                    array: [...arr],
                    comparing: [j, j - gap]
                });
                
                arr[j] = arr[j - gap];
                swaps++;
                j -= gap;
                
                // Record shift
                animationFrames.push({
                    array: [...arr],
                    comparing: [j, j + gap]
                });
                
                comparisons++;
            }
            
            arr[j] = temp;
            swaps++;
            
            // Record final position
            animationFrames.push({
                array: [...arr]
            });
        }
        
        gap = Math.floor(gap / 2);
    }
}

/**
 * Implements Counting Sort algorithm
 * @param {Array} arr - The array to sort
 */
function countingSort(arr) {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);

    // Store counts (offset by min)
    for (let i = 0; i < arr.length; i++) {
        count[arr[i] - min]++;
        swaps++;
        animationFrames.push({ array: [...arr], comparing: [i] });
    }

    // Adjust counts to positions
    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
        swaps++;
    }

    // Build output (reverse order for stability)
    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
        swaps += 2;
        animationFrames.push({ array: [...output].slice(0, arr.length), comparing: [count[arr[i] - min]] });
    }

    // Copy back to original array
    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        swaps++;
        animationFrames.push({ array: [...arr], sorted: Array.from({ length: i + 1 }, (_, idx) => idx) });
    }
}

/**
 * Implements Radix Sort algorithm
 * @param {Array} arr - The array to sort
 */
function radixSort(arr) {
    // Split into negatives and positives
    const negatives = arr.filter(x => x < 0).map(x => -x);
    const positives = arr.filter(x => x >= 0);

    // Sort negatives (as positives, then reverse and negate)
    if (negatives.length > 0) {
        radixSortHelper(negatives);
        negatives.reverse();
        for (let i = 0; i < negatives.length; i++) {
            negatives[i] = -negatives[i];
            swaps++;
        }
    }

    // Sort positives
    if (positives.length > 0) {
        radixSortHelper(positives);
    }

    // Combine results
    arr.length = 0;
    arr.push(...negatives, ...positives);
    swaps += negatives.length + positives.length;
}

/**
 * Helper function for Radix Sort
 * @param {Array} arr - The array to sort
 */
function radixSortHelper(arr) {
    const max = Math.max(...arr);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
}

/**
 * Counting sort by digit for Radix Sort
 * @param {Array} arr - The array to sort
 * @param {number} exp - The current digit place value
 */
function countingSortByDigit(arr, exp) {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    // Store count of occurrences
    for (let i = 0; i < n; i++) {
        const digit = Math.floor(arr[i] / exp) % 10;
        count[digit]++;
        swaps++;
        
        // Record digit count
        animationFrames.push({
            array: [...arr],
            comparing: [i]
        });
    }
    
    // Change count[i] to be the position of i in output
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
        swaps++;
    }
    
    // Build the output array
    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
        swaps += 2;
        
        // Record placement
        animationFrames.push({
            array: [...output].slice(0, n),
            comparing: [count[digit]]
        });
    }
    
    // Copy output to original array
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
        swaps++;
        
        // Record final placement
        animationFrames.push({
            array: [...arr]
        });
    }
}

/**
 * Implements Bucket Sort algorithm
 * @param {Array} arr - The array to sort
 */
function bucketSort(arr) {
    const n = arr.length;
    if (n <= 0) return;

    const maxVal = Math.max(...arr);
    const minVal = Math.min(...arr);
    const range = maxVal - minVal + 1;
    const bucketCount = Math.floor(Math.sqrt(n));
    const buckets = Array.from({ length: bucketCount }, () => []);

    // Scatter elements into buckets (normalized to [0,1))
    for (let i = 0; i < n; i++) {
        const normalized = (arr[i] - minVal) / range;
        const bucketIdx = Math.min(Math.floor(normalized * bucketCount), bucketCount - 1);
        buckets[bucketIdx].push(arr[i]);
        swaps++;
        animationFrames.push({ array: [...arr], comparing: [i], pivot: bucketIdx });
    }

    // Sort individual buckets (using insertion sort)
    for (let i = 0; i < bucketCount; i++) {
        // Simple insertion sort for each bucket
        for (let j = 1; j < buckets[i].length; j++) {
            let key = buckets[i][j];
            let k = j - 1;
            comparisons++;
            while (k >= 0 && buckets[i][k] > key) {
                buckets[i][k + 1] = buckets[i][k];
                swaps++;
                k--;
                comparisons++;
            }
            buckets[i][k + 1] = key;
            swaps++;
        }
    }

    // Concatenate all buckets
    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            arr[index++] = buckets[i][j];
            swaps++;
            animationFrames.push({ array: [...arr], comparing: [index - 1], sorted: Array.from({ length: index }, (_, idx) => idx) });
        }
    }
}

/**
 * Implements Cocktail Shaker Sort algorithm
 * @param {Array} arr - The array to sort
 */
function cocktailSort(arr) {
    let swapped = true;
    let start = 0;
    let end = arr.length - 1;
    
    while (swapped) {
        // Forward pass (like bubble sort)
        swapped = false;
        for (let i = start; i < end; i++) {
            comparisons++;
            animationFrames.push({
                array: [...arr],
                comparing: [i, i + 1],
                sorted: [...Array.from({ length: start }, (_, idx) => idx), 
                         ...Array.from({ length: arr.length - end }, (_, idx) => end + idx)]
            });
            
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
                swaps++;
                
                animationFrames.push({
                    array: [...arr],
                    comparing: [i, i + 1],
                    sorted: [...Array.from({ length: start }, (_, idx) => idx), 
                             ...Array.from({ length: arr.length - end }, (_, idx) => end + idx)]
                });
            }
        }
        
        if (!swapped) break;
        
        // Decrease end because largest element is now at the end
        end--;
        
        // Mark the end as sorted
        animationFrames.push({
            array: [...arr],
            sorted: [...Array.from({ length: start }, (_, idx) => idx), 
                     ...Array.from({ length: arr.length - end }, (_, idx) => end + idx)]
        });
        
        // Backward pass
        swapped = false;
        for (let i = end - 1; i >= start; i--) {
            comparisons++;
            animationFrames.push({
                array: [...arr],
                comparing: [i, i + 1],
                sorted: [...Array.from({ length: start }, (_, idx) => idx), 
                         ...Array.from({ length: arr.length - end }, (_, idx) => end + idx)]
            });
            
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
                swaps++;
                
                animationFrames.push({
                    array: [...arr],
                    comparing: [i, i + 1],
                    sorted: [...Array.from({ length: start }, (_, idx) => idx), 
                             ...Array.from({ length: arr.length - end }, (_, idx) => end + idx)]
                });
            }
        }
        
        // Increase start because smallest element is now at the start
        start++;
        
        // Mark the start as sorted
        animationFrames.push({
            array: [...arr],
            sorted: [...Array.from({ length: start }, (_, idx) => idx), 
                     ...Array.from({ length: arr.length - end }, (_, idx) => end + idx)]
        });
    }
}

/**
 * Implements Comb Sort algorithm
 * @param {Array} arr - The array to sort
 */
function combSort(arr) {
    const n = arr.length;
    let gap = n;
    const shrink = 1.3;
    let sorted = false;
    
    while (!sorted) {
        // Update gap
        gap = Math.floor(gap / shrink);
        if (gap <= 1) {
            gap = 1;
            sorted = true;
        }
        
        // Compare elements with gap
        for (let i = 0; i < n - gap; i++) {
            comparisons++;
            animationFrames.push({
                array: [...arr],
                comparing: [i, i + gap]
            });
            
            if (arr[i] > arr[i + gap]) {
                [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];
                sorted = false;
                swaps++;
                
                animationFrames.push({
                    array: [...arr],
                    comparing: [i, i + gap]
                });
            }
        }
    }
    
    // Mark all elements as sorted in the final frame
    animationFrames.push({
        array: [...arr],
        sorted: Array.from({ length: n }, (_, i) => i)
    });
}

// Initialize the application
init();
