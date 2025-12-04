// DOM Elements
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
const copyPseudocodeBtn = document.getElementById('copy-pseudocode-btn');
const bestCaseElement = document.getElementById('best-case');
const averageCaseElement = document.getElementById('average-case');
const worstCaseElement = document.getElementById('worst-case');
const actualTimeElement = document.getElementById('actual-time');
const timeEquationElement = document.getElementById('time-equation');
const originalArrayElement = document.getElementById('original-array');
const currentArrayElement = document.getElementById('current-array');
const sortedArrayElement = document.getElementById('sorted-array');
const algorithmExplanationElement = document.getElementById('algorithm-explanation');
const sortingStatusElement = document.getElementById('sorting-status');
const loadingIndicator = document.getElementById('loading-indicator');
const errorMessageElement = document.getElementById('error-message');

// State variables
let array = [];
let originalArray = [];
let sortedArray = [];
let isSorting = false;
let isPaused = false;
let animationSpeed = 1000 / 10;
let startTime, endTime;
let animationFrames = [];
let currentFrame = 0;
let animationTimeout = null;
let comparisons = 0;
let swaps = 0;

// Arabic translations
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

// إضافات للترجمات العربية للخوارزميات الجديدة
arabicExplanations.gnome = "خوارزمية ترتيب القزم تعمل بمقارنة وتبديل العناصر، تتحرك للأمام عندما يكون الترتيب صحيحًا وتتراجع عند إجراء تبديل. تشبه قزم الحديقة وهو يرتب أواني الزهور!";
arabicExplanations.bogo = "خوارزمية بوجو ترتب المصفوفة عشوائيًا حتى تصبح مرتبة. غير فعالة تمامًا وتستخدم للأغراض التعليمية فقط لإظهار أسوأ الحالات.";
arabicExplanations.pigeonhole = "خوارزمية ترتيب ثقوب الحمام تضع كل عنصر في الثقب المقابل له بناءً على قيمته. تعمل جيدًا عندما يكون نطاق القيم صغيرًا مقارنة بعدد العناصر.";
arabicExplanations.cycle = "خوارزمية ترتيب الدورة تقلل عدد عمليات الكتابة في الذاكرة. كل عنصر يُكتب مرتين على الأكثر، مما يجعلها مفيدة للأنظمة ذات دورات الكتابة المحدودة.";
arabicExplanations['odd-even'] = "خوارزمية ترتيب فردي-زوجي تقارن وتبدل الأزواج المفردة ثم الأزواج الزوجية. إنها خوارزمية ترتيب متوازية يمكن تنفيذها بكفاءة على أنظمة متعددة النواة.";
arabicExplanations.tim = "خوارزمية تيم سورت هي خوارزمية الترتيب الافتراضية في بايثون. إنها هجين بين ترتيب الدمج وترتيب الإدراج، محسنة للبيانات الواقعية التي غالبًا ما تحتوي على تسلسلات فرعية مرتبة.";
// Algorithm information
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

    count := array of size range initialized to 0
    output := array of size n

    for i := 0 to n-1 do
        count[A[i] - min] := count[A[i] - min] + 1
    end for

    for i := 1 to range-1 do
        count[i] := count[i] + count[i-1]
    end for

    for i := n-1 downto 0 do
        output[count[A[i] - min] - 1] := A[i]
        count[A[i] - min] := count[A[i] - min] - 1
    end for

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
    negatives := A filtered for x where x < 0, mapped to -x
    positives := A filtered for x where x >= 0

    if negatives is not empty then
        radixSortHelper(negatives)
        reverse(negatives)
        for i := 0 to length(negatives)-1 do
            negatives[i] := -negatives[i]
        end for
    end if

    if positives is not empty then
        radixSortHelper(positives)
    end if

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

    for i := 0 to n-1 do
        normalized := (A[i] - minVal) / range
        bucketIdx := min(floor(normalized * bucketCount), bucketCount - 1)
        append A[i] to buckets[bucketIdx]
    end for

    for i := 0 to bucketCount-1 do
        insertionSort(buckets[i])
    end for

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
        swapped := false
        for i := start to end - 1 do
            if A[i] > A[i+1] then
                swap(A[i], A[i+1])
                swapped := true
            end if
        end for
        
        if not swapped then break end if
        
        end := end - 1
        
        swapped := false
        for i := end - 1 downto start do
            if A[i] > A[i+1] then
                swap(A[i], A[i+1])
                swapped := true
            end if
        end for
        
        start := start + 1
    end while
end procedure`,
        bestCase: "O(n)",
        bestCaseAcademic: "Ω(n)",
        averageCase: "O(n²)",
        averageCaseAcademic: "Θ(n²)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
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
        gap := floor(gap / shrink)
        if gap <= 1 then
            gap := 1
            sorted := true
        end if
        
        for i := 0 to n - gap - 1 do
            if A[i] > A[i + gap] then
                swap(A[i], A[i + gap])
                sorted := false
            end if
        end for
    end while
end procedure`,
        bestCase: "O(n log n)",
        bestCaseAcademic: "Ω(n)",
        averageCase: "O(n²)",
        averageCaseAcademic: "Θ(n²)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Comb Sort improves on Bubble Sort by using a gap sequence to eliminate small values near the end of the list. The gap starts large and shrinks by a factor (usually 1.3) until it reaches 1."
    }
    ,
    gnome: {
        name: "Gnome Sort",
        pseudoCode: `procedure gnomeSort(A : list of sortable items)
    pos := 0
    while pos < length(A) do
        if pos = 0 or A[pos] >= A[pos-1] then
            pos := pos + 1
        else
            swap A[pos] and A[pos-1]
            pos := pos - 1
        end if
    end while
end procedure`,
        bestCase: "O(n)",
        bestCaseAcademic: "Ω(n)",
        averageCase: "O(n²)",
        averageCaseAcademic: "Θ(n²)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Gnome Sort works by comparing and swapping elements, moving forward when order is correct and backward when a swap is made. It's like a garden gnome sorting flower pots!"
    },
    bogo: {
        name: "Bogo Sort (Educational)",
        pseudoCode: `procedure bogoSort(A : list of sortable items)
    while not isSorted(A) do
        shuffle(A)
    end while
end procedure`,
        bestCase: "O(n)",
        bestCaseAcademic: "Ω(n)",
        averageCase: "O((n+1)!)",
        averageCaseAcademic: "Θ((n+1)!)",
        worstCase: "Unbounded",
        worstCaseAcademic: "∞",
        spaceComplexity: "O(1)",
        explanation: "Bogo Sort randomly shuffles the array until it's sorted. Extremely inefficient and used only for educational purposes to demonstrate worst-case scenarios."
    },
    pigeonhole: {
        name: "Pigeonhole Sort",
        pseudoCode: `procedure pigeonholeSort(A : list of sortable items)
    min := findMin(A)
    max := findMax(A)
    range := max - min + 1
    holes := array of size range initialized to 0
    
    for i := 0 to length(A)-1 do
        holes[A[i] - min] := holes[A[i] - min] + 1
    end for
    
    index := 0
    for j := 0 to range-1 do
        while holes[j] > 0 do
            holes[j] := holes[j] - 1
            A[index] := j + min
            index := index + 1
        end while
    end for
end procedure`,
        bestCase: "O(n + range)",
        bestCaseAcademic: "Ω(n + range)",
        averageCase: "O(n + range)",
        averageCaseAcademic: "Θ(n + range)",
        worstCase: "O(n + range)",
        worstCaseAcademic: "O(n + range)",
        spaceComplexity: "O(range)",
        explanation: "Pigeonhole Sort places each element into its corresponding 'hole' based on its value. Works well when the range of values is small compared to the number of elements."
    },
    cycle: {
        name: "Cycle Sort",
        pseudoCode: `procedure cycleSort(A : list of sortable items)
    n := length(A)
    for cycleStart := 0 to n-2 do
        item := A[cycleStart]
        pos := cycleStart
        
        for i := cycleStart+1 to n-1 do
            if A[i] < item then
                pos := pos + 1
            end if
        end for
        
        if pos = cycleStart then
            continue
        end if
        
        while item = A[pos] do
            pos := pos + 1
        end while
        
        swap item and A[pos]
        
        while pos != cycleStart do
            pos := cycleStart
            for i := cycleStart+1 to n-1 do
                if A[i] < item then
                    pos := pos + 1
                end if
            end for
            
            while item = A[pos] do
                pos := pos + 1
            end while
            
            swap item and A[pos]
        end while
    end for
end procedure`,
        bestCase: "O(n²)",
        bestCaseAcademic: "Ω(n²)",
        averageCase: "O(n²)",
        averageCaseAcademic: "Θ(n²)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Cycle Sort minimizes the number of writes to memory. Each element is written at most twice, making it useful for systems with limited write cycles."
    },
    "odd-even": {
        name: "Odd-Even Sort",
        pseudoCode: `procedure oddEvenSort(A : list of sortable items)
    n := length(A)
    sorted := false
    
    while not sorted do
        sorted := true
        
        // Odd phase
        for i := 1 to n-2 step 2 do
            if A[i] > A[i+1] then
                swap A[i] and A[i+1]
                sorted := false
            end if
        end for
        
        // Even phase
        for i := 0 to n-2 step 2 do
            if A[i] > A[i+1] then
                swap A[i] and A[i+1]
                sorted := false
            end if
        end for
    end while
end procedure`,
        bestCase: "O(n)",
        bestCaseAcademic: "Ω(n)",
        averageCase: "O(n²)",
        averageCaseAcademic: "Θ(n²)",
        worstCase: "O(n²)",
        worstCaseAcademic: "O(n²)",
        spaceComplexity: "O(1)",
        explanation: "Odd-Even Sort compares and swaps odd-indexed pairs, then even-indexed pairs. It's a parallel sorting algorithm that can be efficiently implemented on multi-core systems."
    },
    tim: {
        name: "Tim Sort",
        pseudoCode: `procedure timSort(A : list of sortable items)
    RUN := 32
    n := length(A)
    
    // Sort individual subarrays of size RUN
    for i := 0 to n step RUN do
        insertionSort(A, i, min(i+RUN-1, n-1))
    end for
    
    // Merge sorted runs
    size := RUN
    while size < n do
        for left := 0 to n step 2*size do
            mid := left + size - 1
            right := min((left + 2*size - 1), (n-1))
            
            if mid < right then
                merge(A, left, mid, right)
            end if
        end for
        size := 2*size
    end while
end procedure`,
        bestCase: "O(n)",
        bestCaseAcademic: "Ω(n)",
        averageCase: "O(n log n)",
        averageCaseAcademic: "Θ(n log n)",
        worstCase: "O(n log n)",
        worstCaseAcademic: "O(n log n)",
        spaceComplexity: "O(n)",
        explanation: "Tim Sort is Python's default sorting algorithm. It's a hybrid of Merge Sort and Insertion Sort, optimized for real-world data that often contains ordered subsequences."
    }
};

// معلومات التصنيفات (الجديدة)
const categoryInfo = {
    "basic": {
        name: "Basic Comparison Sorts",
        description: "Compare elements directly using simple operations. Easy to understand but often less efficient for large datasets.",
        arabicDescription: "تقارن العناصر مباشرة باستخدام عمليات بسيطة. سهلة الفهم ولكنها غالبًا أقل كفاءة لمجموعات البيانات الكبيرة.",
        algorithms: ["bubble", "insertion", "selection", "gnome", "cocktail"]
    },
    "advanced": {
        name: "Advanced Comparison Sorts",
        description: "Efficient algorithms using divide & conquer, heap structures, or optimized techniques for better performance.",
        arabicDescription: "خوارزميات فعالة تستخدم تقسيم وفتح أو هياكل كومة أو تقنيات محسنة لأداء أفضل.",
        algorithms: ["quick", "merge", "heap", "shell", "comb", "bogo"]
    },
    "non-comparison": {
        name: "Non-Comparison Sorts",
        description: "Sort by counting, distributing, or placing elements without direct comparisons. Linear time for specific data types.",
        arabicDescription: "ترتب عن طريق العد أو التوزيع أو وضع العناصر دون مقارنات مباشرة. وقت خطي لأنواع البيانات المحددة.",
        algorithms: ["counting", "radix", "bucket", "pigeonhole"]
    },
    "specialized": {
        name: "Specialized Sorts",
        description: "Optimized for specific data patterns, hybrid approaches, or special hardware considerations.",
        arabicDescription: "محسنة لأنماط بيانات محددة، أو أساليب هجينة، أو اعتبارات أجهزة خاصة.",
        algorithms: ["cycle", "odd-even", "tim"]
    }
};

// Helper functions
function showError(message) {
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = 'block';
    
    setTimeout(() => {
        errorMessageElement.style.display = 'none';
    }, 5000);
}

function showLoadingIndicator(show) {
    loadingIndicator.style.display = show ? 'flex' : 'none';
}
function copyPseudocode() {
    const pseudoCode = pseudoCodeElement.textContent;
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(pseudoCode)
            .then(() => {
                const originalText = copyPseudocodeBtn.innerHTML;
                copyPseudocodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                copyPseudocodeBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyPseudocodeBtn.innerHTML = originalText;
                    copyPseudocodeBtn.classList.remove('copied');
                }, 2000);
            })
            .catch(err => {
                console.error('Failed to copy pseudocode: ', err);
                fallbackCopy(pseudoCode);
            });
    } else {
        fallbackCopy(pseudoCode);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            const originalText = copyPseudocodeBtn.innerHTML;
            copyPseudocodeBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyPseudocodeBtn.classList.add('copied');
            
            setTimeout(() => {
                copyPseudocodeBtn.innerHTML = originalText;
                copyPseudocodeBtn.classList.remove('copied');
            }, 2000);
        } else {
            showError('Failed to copy pseudocode');
        }
    } catch (err) {
        console.error('Failed to copy: ', err);
        showError('Failed to copy pseudocode');
    }
    
    document.body.removeChild(textArea);
}


function validateArrayInput(input) {
    try {
        const numbers = input.split(',').map(num => {
            const trimmed = num.trim();
            const parsed = parseInt(trimmed, 10);
            
            if (isNaN(parsed)) {
                throw new Error(`Invalid number: ${trimmed}`);
            }
            
            if (parsed < 0 || parsed > 100) {
                throw new Error(`Number ${parsed} out of range (0-100)`);
            }
            
            return parsed;
        });
        
        if (numbers.length < 3 || numbers.length > 50) {
            throw new Error('Array size must be between 3 and 50');
        }
        
        return numbers;
    } catch (error) {
        showError(error.message);
        return null;
    }
}

function updateAlgorithmInfo() {
    const selectedAlgorithm = algorithmSelect.value;
    const info = algorithmInfo[selectedAlgorithm];
    
    if (!info) return;
    
    pseudoCodeElement.textContent = info.pseudoCode;
    bestCaseElement.textContent = info.bestCase;
    averageCaseElement.textContent = info.averageCase;
    worstCaseElement.textContent = info.worstCase;
    
    document.getElementById('best-case-academic').textContent = info.bestCaseAcademic;
    document.getElementById('average-case-academic').textContent = info.averageCaseAcademic;
    document.getElementById('worst-case-academic').textContent = info.worstCaseAcademic;
    document.getElementById('space-complexity').textContent = info.spaceComplexity;
    
    updateExplanationLanguage(selectedAlgorithm);
    copyPseudocodeBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
    copyPseudocodeBtn.classList.remove('copied');
}

function updateExplanationLanguage(algorithm) {
    const isArabic = document.body.classList.contains('arabic-language');
    const info = algorithmInfo[algorithm];
    
    if (isArabic && arabicExplanations[algorithm]) {
        algorithmExplanationElement.textContent = arabicExplanations[algorithm];
        algorithmExplanationElement.dir = "rtl";
    } else {
        algorithmExplanationElement.textContent = info.explanation;
        algorithmExplanationElement.dir = "ltr";
    }
}

function toggleCustomArrayInput() {
    customArrayRow.style.display = arrayTypeSelect.value === 'custom' ? 'flex' : 'none';
}

function updateSpeed() {
    const speed = parseInt(speedControl.value);
    speedValue.textContent = speed;
    animationSpeed = 1000 / speed;
}

function generateArray() {
    if (isSorting) return;
    
    const size = parseInt(arraySizeInput.value);
    const type = arrayTypeSelect.value;
    
    if (type === 'custom') {
        const customInput = arrayInput.value.trim();
        if (customInput) {
            const validatedArray = validateArrayInput(customInput);
            if (!validatedArray) return;
            array = validatedArray;
        } else {
            array = generateRandomArray(size);
        }
    } else {
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
                const swaps = Math.floor(size * 0.2);
                for (let i = 0; i < swaps; i++) {
                    const idx1 = Math.floor(Math.random() * size);
                    const idx2 = Math.floor(Math.random() * size);
                    [array[idx1], array[idx2]] = [array[idx2], array[idx1]];
                }
                break;
        }
    }
    
    if (array.length > 50) {
        array = array.slice(0, 50);
        showError("Array size limited to 50 elements");
    }
    if (array.length < 3) {
        array = generateRandomArray(10);
    }
    
    originalArray = [...array];
    sortedArray = [];
    
    updateArrayDisplays();
    renderArray();
    resetVisualization();
}

function updateArrayDisplays() {
    originalArrayElement.textContent = originalArray.join(', ');
    currentArrayElement.textContent = array.join(', ');
    sortedArrayElement.textContent = sortedArray.length > 0 ? sortedArray.join(', ') : "Not sorted yet";
}

function generateRandomArray(size) {
    const arr = [];
    for (let i = 0; i < size; i++) {
        arr.push(Math.floor(Math.random() * 100) + 1);
    }
    return arr;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function renderArray(state = {}) {
    visualization.innerHTML = '';
    const maxValue = Math.max(...array, 1);
    const containerHeight = visualization.clientHeight;
    
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        bar.dataset.value = value;
        
        const height = (value / maxValue) * containerHeight * 0.9;
        bar.style.height = `${height}px`;
        
        if (state.comparing && state.comparing.includes(index)) {
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
    
    animationFrames = [];
    currentFrame = 0;
    comparisons = 0;
    swaps = 0;
    
    startTime = performance.now();
    sortingStatusElement.textContent = "Sorting...";
    
    const sortingArray = [...array];
    const algorithm = algorithmSelect.value;
    
    sortedArray = [];
    updateArrayDisplays();
    
    showLoadingIndicator(true);
    
    setTimeout(() => {
        try {
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
                case 'gnome':
                    gnomeSort(sortingArray);
                    break;
                case 'bogo':
                    bogoSort(sortingArray);
                    break;
                case 'pigeonhole':
                    pigeonholeSort(sortingArray);
                    break;
                case 'cycle':
                    cycleSort(sortingArray);
                    break;
                case 'odd-even':
                    oddEvenSort(sortingArray);
                    break;
                case 'tim':
                    // simplified TimSort fallback: use mergeSort as an approximation
                    mergeSort(sortingArray);
                    break;
            }
            
            sortedArray = [...sortingArray];
            
            animationFrames.push({
                array: [...sortingArray],
                sorted: Array.from({ length: sortingArray.length }, (_, i) => i)
            });
            
            showLoadingIndicator(false);
            animateSorting();
        } catch (error) {
            console.error('Sorting error:', error);
            showError('Error during sorting. Please try again.');
            resetVisualization();
        }
    }, 100);
}

function togglePause() {
    if (!isSorting) return;
    
    isPaused = !isPaused;
    
    if (isPaused) {
        clearTimeout(animationTimeout);
        pauseBtn.textContent = 'Resume';
        sortingStatusElement.textContent = "Paused";
    } else {
        pauseBtn.textContent = 'Pause';
        sortingStatusElement.textContent = "Sorting...";
        animateSorting();
    }
}

function animateSorting() {
    if (isPaused || currentFrame >= animationFrames.length) {
        if (currentFrame >= animationFrames.length) {
            endTime = performance.now();
            const executionTime = (endTime - startTime).toFixed(2);
            actualTimeElement.textContent = `${executionTime} ms (${comparisons} comparisons, ${swaps} swaps)`;
            
            array = [...sortedArray];
            updateArrayDisplays();
            
            displayTimeComplexity();
            
            isSorting = false;
            startBtn.style.display = 'inline-flex';
            pauseBtn.style.display = 'none';
            sortingStatusElement.textContent = "Done";
        }
        return;
    }
    
    const frame = animationFrames[currentFrame];
    array = [...frame.array];
    updateArrayDisplays();
    renderArray(frame);
    currentFrame++;
    
    animationTimeout = setTimeout(animateSorting, animationSpeed);
}

function resetVisualization() {
    isSorting = false;
    isPaused = false;
    clearTimeout(animationTimeout);
    startBtn.style.display = 'inline-flex';
    pauseBtn.style.display = 'none';
    generateBtn.disabled = false;
    algorithmSelect.disabled = false;
    arraySizeInput.disabled = false;
    arrayTypeSelect.disabled = false;
    arrayInput.disabled = false;
    resetBtn.disabled = true;
    
    array = [...originalArray];
    sortedArray = [];
    updateArrayDisplays();
    
    renderArray();
    actualTimeElement.textContent = "Not run yet";
    timeEquationElement.textContent = "The time complexity equation will appear here after sorting completes.";
    sortingStatusElement.textContent = "";
}

// Helper: factorial used for bogo complexity display
function factorial(n) {
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
        // prevent runaway numbers in UI
        if (!isFinite(result) || result > Number.MAX_SAFE_INTEGER) return "Huge";
    }
    return result;
}

function displayTimeComplexity() {
    const algorithm = algorithmSelect.value;
    const info = algorithmInfo[algorithm];
    const size = array.length;
    const arrayType = arrayTypeSelect.value;
    
    let equation = "";
    let solution = "";
    let actualComplexity = "";
    
    switch (algorithm) {
        case 'bubble':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n) - Best case (already sorted)";
            } else if (arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (reverse sorted)";
            } else {
                actualComplexity = "Θ(n²) - Average case";
            }
            equation = `O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, worst case is proportional to ${size * size} operations`;
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
            equation = `O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, worst case is proportional to ${size * size} operations`;
            break;
        case 'selection':
            actualComplexity = "Θ(n²) - Always performs the same regardless of input";
            equation = `Θ(n²) = Θ(${size}²) = Θ(${size * size})`;
            solution = `For array size ${size}, always performs ${size * size} operations`;
            break;
        case 'merge':
            actualComplexity = "Θ(n log n) - Always performs the same regardless of input";
            equation = `Θ(n log n) = Θ(${size} log ${size}) ≈ Θ(${size} * ${Math.log2(size).toFixed(2)}) ≈ Θ(${Math.floor(size * Math.log2(size))})`;
            solution = `For array size ${size}, time complexity is proportional to ${Math.floor(size * Math.log2(size))} operations`;
            break;
        case 'quick':
            if (arrayType === 'sorted' || arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (already sorted or reverse sorted)";
            } else {
                actualComplexity = "Θ(n log n) - Average case";
            }
            equation = `Average: Θ(n log n) = Θ(${size} log ${size}) ≈ Θ(${Math.floor(size * Math.log2(size))})\nWorst: O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, average case is proportional to ${Math.floor(size * Math.log2(size))} operations, but worst case is ${size * size} operations`;
            break;
        case 'heap':
            actualComplexity = "Θ(n log n) - Always performs the same regardless of input";
            equation = `Θ(n log n) = Θ(${size} log ${size}) ≈ Θ(${Math.floor(size * Math.log2(size))})`;
            solution = `For array size ${size}, time complexity is proportional to ${Math.floor(size * Math.log2(size))} operations`;
            break;
        case 'shell':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n log n) - Best case (already sorted)";
            } else if (arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (reverse sorted)";
            } else {
                actualComplexity = "Θ(n log² n) - Average case (depends on gap sequence)";
            }
            equation = `Best: Ω(n log n)\nAverage: Θ(n log² n)\nWorst: O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, best case is proportional to ${Math.floor(size * Math.log2(size))} operations, but worst case is ${size * size} operations`;
            break;
        case 'counting':
            const max = Math.max(...array);
            const min = Math.min(...array);
            const range = max - min + 1;
            actualComplexity = `Θ(n + k) where k=${range} (range of values)`;
            equation = `Θ(n + k) = Θ(${size} + ${range}) = Θ(${size + range})`;
            solution = `For array size ${size} and value range ${range}, time complexity is proportional to ${size + range} operations`;
            break;
        case 'radix':
            const maxRadix = Math.max(...array.map(Math.abs));
            const digits = maxRadix > 0 ? Math.floor(Math.log10(maxRadix)) + 1 : 1;
            actualComplexity = `Θ(nk) where k=${digits} (number of digits)`;
            equation = `Θ(nk) = Θ(${size} * ${digits}) = Θ(${size * digits})`;
            solution = `For array size ${size} and max digits ${digits}, time complexity is proportional to ${size * digits} operations`;
            break;
        case 'bucket':
            if (arrayType === 'sorted' || arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (all elements fall into one bucket)";
            } else {
                actualComplexity = "Θ(n + k) - Average case where k is number of buckets";
            }
            equation = `Best: Ω(n + k)\nAverage: Θ(n + k)\nWorst: O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, best and average cases are linear with the number of buckets, but worst case (when all elements fall into one bucket) is ${size * size} operations`;
            break;
        case 'cocktail':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n) - Best case (already sorted)";
            } else if (arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (reverse sorted)";
            } else {
                actualComplexity = "Θ(n²) - Average case";
            }
            equation = `O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, worst case is proportional to ${size * size} operations`;
            break;
        case 'comb':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n log n) - Best case (already sorted)";
            } else if (arrayType === 'reverse') {
                actualComplexity = "O(n²) - Worst case (reverse sorted)";
            } else {
                actualComplexity = "Θ(n²/2^p) - Average case (where p depends on shrink factor)";
            }
            equation = `Best: Ω(n log n)\nAverage: Θ(n²/2^p)\nWorst: O(n²) = O(${size}²) = O(${size * size})`;
            solution = `For array size ${size}, best case is proportional to ${Math.floor(size * Math.log2(size))} operations, but worst case is ${size * size} operations`;
            break;
        case 'gnome':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n) - Best case (already sorted)";
            } else {
                actualComplexity = "O(n²) - Average/Worst case";
            }
            equation = `Best: O(n)\nAverage/Worst: O(n²) = O(${size}²) = O(${size * size})`;
            solution = `Gnome sort moves like a garden gnome - takes small steps forward and backward.`;
            break;
        case 'bogo':
            actualComplexity = "O((n+1)!) - Average case (random shuffles)";
            equation = `Average: O((n+1)!) ≈ O(${(size + 1)}!)`;
            const fact = factorial(size + 1);
            solution = `Bogo sort is purely random! For ${size} elements, average case requires ~${fact} operations.`;
            break;
        case 'pigeonhole':
            const maxPh = Math.max(...array);
            const minPh = Math.min(...array);
            const rangePh = maxPh - minPh + 1;
            actualComplexity = `Θ(n + range) where range=${rangePh}`;
            equation = `Θ(n + range) = Θ(${size} + ${rangePh}) = Θ(${size + rangePh})`;
            solution = `Each element finds its 'hole'. Efficient when range (${rangePh}) is small compared to n (${size}).`;
            break;
        case 'cycle':
            actualComplexity = "Θ(n²) - Always performs the same";
            equation = `Θ(n²) = Θ(${size}²) = Θ(${size * size})`;
            solution = `Minimizes memory writes (useful for flash memory). Each element is written at most twice.`;
            break;
        case 'odd-even':
            if (arrayType === 'sorted') {
                actualComplexity = "Ω(n) - Best case (already sorted)";
            } else {
                actualComplexity = "O(n²) - Average/Worst case";
            }
            equation = `Best: O(n)\nAverage/Worst: O(n²) = O(${size}²) = O(${size * size})`;
            solution = `Parallel sorting algorithm. Can be efficiently implemented on multi-core systems.`;
            break;
        case 'tim':
            actualComplexity = "O(n log n) - Hybrid of Merge and Insertion Sort";
            equation = `O(n log n) = O(${size} log ${size}) ≈ O(${Math.floor(size * Math.log2(size))})`;
            solution = `Python's default sort. Optimized for real-world data with ordered subsequences.`;
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

// Sorting algorithms
function bubbleSort(arr) {
    let n = arr.length;
    let swapped;
    
    do {
        swapped = false;
        for (let i = 0; i < n - 1; i++) {
            comparisons++;
            animationFrames.push({
                array: [...arr],
                comparing: [i, i + 1]
            });
            
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                swapped = true;
                swaps++;
                
                animationFrames.push({
                    array: [...arr],
                    comparing: [i, i + 1]
                });
            }
        }
        n--;
        
        animationFrames.push({
            array: [...arr],
            sorted: Array.from({ length: arr.length - n }, (_, i) => n + i)
        });
    } while (swapped);
}

function insertionSort(arr) {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        
        animationFrames.push({
            array: [...arr],
            comparing: [i, j],
            sorted: Array.from({ length: i }, (_, idx) => idx)
        });
        
        while (j >= 0 && arr[j] > key) {
            comparisons++;
            animationFrames.push({
                array: [...arr],
                comparing: [j, j + 1],
                sorted: Array.from({ length: i }, (_, idx) => idx)
            });
            
            arr[j + 1] = arr[j];
            swaps++;
            j--;
            
            animationFrames.push({
                array: [...arr],
                comparing: [j + 1, j + 2],
                sorted: Array.from({ length: i }, (_, idx) => idx)
            });
        }
        
        arr[j + 1] = key;
        swaps++;
        
        animationFrames.push({
            array: [...arr],
            sorted: Array.from({ length: i + 1 }, (_, idx) => idx)
        });
    }
}

function selectionSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        let minIndex = i;
        
        animationFrames.push({
            array: [...arr],
            min: minIndex,
            sorted: Array.from({ length: i }, (_, idx) => idx)
        });
        
        for (let j = i + 1; j < arr.length; j++) {
            comparisons++;
            animationFrames.push({
                array: [...arr],
                comparing: [minIndex, j],
                min: minIndex,
                sorted: Array.from({ length: i }, (_, idx) => idx)
            });
            
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
                
                animationFrames.push({
                    array: [...arr],
                    min: minIndex,
                    sorted: Array.from({ length: i }, (_, idx) => idx)
                });
            }
        }
        
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
            swaps++;
            
            animationFrames.push({
                array: [...arr],
                comparing: [i, minIndex],
                sorted: Array.from({ length: i + 1 }, (_, idx) => idx)
            });
        }
        
        animationFrames.push({
            array: [...arr],
            sorted: Array.from({ length: i + 1 }, (_, idx) => idx)
        });
    }
}

function mergeSort(arr, left = 0, right = arr.length - 1) {
    if (left >= right) return;
    
    const mid = Math.floor((left + right) / 2);
    
    animationFrames.push({
        array: [...arr],
        comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i)
    });
    
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}

function merge(arr, left, mid, right) {
    let i = left;
    let j = mid + 1;
    const temp = [];
    
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
        
        animationFrames.push({
            array: [...arr],
            comparing: [left + k],
            sorted: Array.from({ length: left + k + 1 }, (_, idx) => idx)
        });
    }
}

function quickSort(arr, low = 0, high = arr.length - 1) {
    if (low < high) {
        const pi = partition(arr, low, high);
        
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

function partition(arr, low, high) {
    const pivot = arr[high];
    let i = low - 1;
    
    animationFrames.push({
        array: [...arr],
        pivot: high,
        comparing: [high]
    });
    
    for (let j = low; j < high; j++) {
        comparisons++;
        animationFrames.push({
            array: [...arr],
            pivot: high,
            comparing: [j, high]
        });
        
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            swaps++;
            
            animationFrames.push({
                array: [...arr],
                pivot: high,
                comparing: [i, j]
            });
        }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    swaps++;
    
    animationFrames.push({
        array: [...arr],
        sorted: [i + 1]
    });
    
    return i + 1;
}

function heapSort(arr) {
    const n = arr.length;
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        swaps++;
        
        animationFrames.push({
            array: [...arr],
            comparing: [0, i],
            sorted: Array.from({ length: n - i }, (_, idx) => i + idx)
        });
        
        heapify(arr, i, 0);
    }
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
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
        animationFrames.push({
            array: [...arr],
            comparing: [i, largest],
            min: largest
        });
        
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        swaps++;
        
        animationFrames.push({
            array: [...arr],
            comparing: [i, largest]
        });
        
        heapify(arr, n, largest);
    }
}

function shellSort(arr) {
    const n = arr.length;
    let gap = Math.floor(n / 2);
    
    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            const temp = arr[i];
            let j = i;
            
            animationFrames.push({
                array: [...arr],
                comparing: [i, j - gap]
            });
            
            comparisons++;
            while (j >= gap && arr[j - gap] > temp) {
                animationFrames.push({
                    array: [...arr],
                    comparing: [j, j - gap]
                });
                
                arr[j] = arr[j - gap];
                swaps++;
                j -= gap;
                
                animationFrames.push({
                    array: [...arr],
                    comparing: [j, j + gap]
                });
                
                comparisons++;
            }
            
            arr[j] = temp;
            swaps++;
            
            animationFrames.push({
                array: [...arr]
            });
        }
        
        gap = Math.floor(gap / 2);
    }
}

function countingSort(arr) {
    const max = Math.max(...arr);
    const min = Math.min(...arr);
    const range = max - min + 1;
    const count = new Array(range).fill(0);
    const output = new Array(arr.length);

    for (let i = 0; i < arr.length; i++) {
        count[arr[i] - min]++;
        swaps++;
        animationFrames.push({ array: [...arr], comparing: [i] });
    }

    for (let i = 1; i < range; i++) {
        count[i] += count[i - 1];
        swaps++;
    }

    for (let i = arr.length - 1; i >= 0; i--) {
        output[count[arr[i] - min] - 1] = arr[i];
        count[arr[i] - min]--;
        swaps += 2;
        animationFrames.push({ array: [...output].slice(0, arr.length), comparing: [count[arr[i] - min]] });
    }

    for (let i = 0; i < arr.length; i++) {
        arr[i] = output[i];
        swaps++;
        animationFrames.push({ array: [...arr], sorted: Array.from({ length: i + 1 }, (_, idx) => idx) });
    }
}

function radixSort(arr) {
    const negatives = arr.filter(x => x < 0).map(x => -x);
    const positives = arr.filter(x => x >= 0);

    if (negatives.length > 0) {
        radixSortHelper(negatives);
        negatives.reverse();
        for (let i = 0; i < negatives.length; i++) {
            negatives[i] = -negatives[i];
            swaps++;
        }
    }

    if (positives.length > 0) {
        radixSortHelper(positives);
    }

    arr.length = 0;
    arr.push(...negatives, ...positives);
    swaps += negatives.length + positives.length;
}

function radixSortHelper(arr) {
    const max = Math.max(...arr);
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        countingSortByDigit(arr, exp);
    }
}

function countingSortByDigit(arr, exp) {
    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    for (let i = 0; i < n; i++) {
        const digit = Math.floor(arr[i] / exp) % 10;
        count[digit]++;
        swaps++;
        
        animationFrames.push({
            array: [...arr],
            comparing: [i]
        });
    }
    
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
        swaps++;
    }
    
    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(arr[i] / exp) % 10;
        output[count[digit] - 1] = arr[i];
        count[digit]--;
        swaps += 2;
        
        animationFrames.push({
            array: [...output].slice(0, n),
            comparing: [count[digit]]
        });
    }
    
    for (let i = 0; i < n; i++) {
        arr[i] = output[i];
        swaps++;
        
        animationFrames.push({
            array: [...arr]
        });
    }
}

function bucketSort(arr) {
    const n = arr.length;
    if (n <= 0) return;

    const maxVal = Math.max(...arr);
    const minVal = Math.min(...arr);
    const range = maxVal - minVal + 1;
    const bucketCount = Math.floor(Math.sqrt(n));
    const buckets = Array.from({ length: bucketCount }, () => []);

    for (let i = 0; i < n; i++) {
        const normalized = (arr[i] - minVal) / range;
        const bucketIdx = Math.min(Math.floor(normalized * bucketCount), bucketCount - 1);
        buckets[bucketIdx].push(arr[i]);
        swaps++;
        animationFrames.push({ array: [...arr], comparing: [i], pivot: bucketIdx });
    }

    for (let i = 0; i < bucketCount; i++) {
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

    let index = 0;
    for (let i = 0; i < bucketCount; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            arr[index++] = buckets[i][j];
            swaps++;
            animationFrames.push({ array: [...arr], comparing: [index - 1], sorted: Array.from({ length: index }, (_, idx) => idx) });
        }
    }
}

function cocktailSort(arr) {
    let swapped = true;
    let start = 0;
    let end = arr.length - 1;
    
    while (swapped) {
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
        
        end--;
        
        animationFrames.push({
            array: [...arr],
            sorted: [...Array.from({ length: start }, (_, idx) => idx), 
                     ...Array.from({ length: arr.length - end }, (_, idx) => end + idx)]
        });
        
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
        
        start++;
        
        animationFrames.push({
            array: [...arr],
            sorted: [...Array.from({ length: start }, (_, idx) => idx), 
                     ...Array.from({ length: arr.length - end }, (_, idx) => end + idx)]
        });
    }
}

function combSort(arr) {
    const n = arr.length;
    let gap = n;
    const shrink = 1.3;
    let sorted = false;
    
    while (!sorted) {
        gap = Math.floor(gap / shrink);
        if (gap <= 1) {
            gap = 1;
            sorted = true;
        }
        
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
    
    animationFrames.push({
        array: [...arr],
        sorted: Array.from({ length: n }, (_, i) => i)
    });
}

// --- New sorting algorithm implementations ---
function gnomeSort(arr) {
    let pos = 0;
    while (pos < arr.length) {
        comparisons++;
        if (pos === 0 || arr[pos] >= arr[pos - 1]) {
            animationFrames.push({ array: [...arr], comparing: [pos, pos - 1], sorted: Array.from({ length: pos + 1 }, (_, idx) => idx) });
            pos++;
        } else {
            animationFrames.push({ array: [...arr], comparing: [pos, pos - 1] });
            [arr[pos], arr[pos - 1]] = [arr[pos - 1], arr[pos]];
            swaps++;
            animationFrames.push({ array: [...arr], comparing: [pos, pos - 1] });
            pos--;
        }
    }
    animationFrames.push({ array: [...arr], sorted: Array.from({ length: arr.length }, (_, i) => i) });
}

function bogoSort(arr) {
    const maxAttempts = 10000;
    let attempts = 0;

    function isSortedLocal(a) {
        for (let i = 1; i < a.length; i++) {
            comparisons++;
            if (a[i - 1] > a[i]) return false;
        }
        return true;
    }

    while (!isSortedLocal(arr) && attempts < maxAttempts) {
        attempts++;
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
            swaps++;
        }
        animationFrames.push({ array: [...arr], comparing: [], attempts: attempts });
        comparisons += arr.length;
    }
    animationFrames.push({ array: [...arr], sorted: Array.from({ length: arr.length }, (_, i) => i), attempts: attempts });
}

function pigeonholeSort(arr) {
    const min = Math.min(...arr);
    const max = Math.max(...arr);
    const range = max - min + 1;
    const holes = new Array(range).fill(0);

    for (let i = 0; i < arr.length; i++) {
        holes[arr[i] - min]++;
        swaps++;
        animationFrames.push({ array: [...arr], comparing: [i], pivot: arr[i] - min });
    }

    let index = 0;
    for (let j = 0; j < range; j++) {
        while (holes[j] > 0) {
            arr[index] = j + min;
            holes[j]--;
            swaps++;
            index++;
            animationFrames.push({ array: [...arr], comparing: [index - 1], sorted: Array.from({ length: index }, (_, idx) => idx) });
        }
    }
}

function cycleSort(arr) {
    const n = arr.length;
    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
        let item = arr[cycleStart];
        let pos = cycleStart;
        for (let i = cycleStart + 1; i < n; i++) {
            comparisons++;
            if (arr[i] < item) pos++;
        }
        if (pos === cycleStart) continue;
        while (item === arr[pos]) pos++;
        [arr[pos], item] = [item, arr[pos]];
        swaps++;
        animationFrames.push({ array: [...arr], comparing: [pos, cycleStart] });
        while (pos !== cycleStart) {
            pos = cycleStart;
            for (let i = cycleStart + 1; i < n; i++) {
                comparisons++;
                if (arr[i] < item) pos++;
            }
            while (item === arr[pos]) pos++;
            [arr[pos], item] = [item, arr[pos]];
            swaps++;
            animationFrames.push({ array: [...arr], comparing: [pos, cycleStart] });
        }
    }
    animationFrames.push({ array: [...arr], sorted: Array.from({ length: arr.length }, (_, i) => i) });
}

function oddEvenSort(arr) {
    let sorted = false;
    const n = arr.length;
    while (!sorted) {
        sorted = true;
        for (let i = 1; i < n - 1; i += 2) {
            comparisons++;
            animationFrames.push({ array: [...arr], comparing: [i, i + 1] });
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                sorted = false;
                swaps++;
                animationFrames.push({ array: [...arr], comparing: [i, i + 1] });
            }
        }
        for (let i = 0; i < n - 1; i += 2) {
            comparisons++;
            animationFrames.push({ array: [...arr], comparing: [i, i + 1] });
            if (arr[i] > arr[i + 1]) {
                [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
                sorted = false;
                swaps++;
                animationFrames.push({ array: [...arr], comparing: [i, i + 1] });
            }
        }
    }
    animationFrames.push({ array: [...arr], sorted: Array.from({ length: arr.length }, (_, i) => i) });
}

// UI: category cards setup and category explanation update
function setupCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');
    if (!categoryCards) return;
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            const categoryData = categoryInfo[category];
            const categoryExplanation = document.getElementById('category-explanation');
            const isArabic = document.body.classList.contains('arabic-language');
            if (!categoryData || !categoryExplanation) return;
            categoryExplanation.innerHTML = `\n                <h4>${categoryData.name}</h4>\n                <p>${isArabic ? categoryData.arabicDescription : categoryData.description}</p>\n                <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--primary);">\n                    Contains: ${categoryData.algorithms.map(algo => (algorithmInfo[algo] || {}).name || algo).join(', ')}\n                </div>\n            `;
            categoryCards.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function updateCategoryExplanation() {
    const selectedAlgorithm = algorithmSelect.value;
    let selectedCategory = null;
    for (const [category, data] of Object.entries(categoryInfo)) {
        if (data.algorithms.includes(selectedAlgorithm)) {
            selectedCategory = category;
            break;
        }
    }
    if (selectedCategory) {
        const categoryData = categoryInfo[selectedCategory];
        const isArabic = document.body.classList.contains('arabic-language');
        const categoryExplanation = document.getElementById('category-explanation');
        if (!categoryExplanation) return;
        categoryExplanation.innerHTML = `\n            <h4>${categoryData.name}</h4>\n            <p>${isArabic ? categoryData.arabicDescription : categoryData.description}</p>\n        `;
        document.querySelectorAll('.category-card').forEach(card => {
            card.classList.remove('active');
            if (card.dataset.category === selectedCategory) card.classList.add('active');
        });
    }
}


// Initialize
function init() {
    // Dark mode toggle
    const darkToggle = document.getElementById('dark-mode-toggle');
    copyPseudocodeBtn.addEventListener('click', copyPseudocode);
    darkToggle.addEventListener('change', function() {
        document.body.classList.toggle('dark-mode', this.checked);
        localStorage.setItem('darkMode', this.checked);
    });

    if (localStorage.getItem('darkMode') === 'true') {
        darkToggle.checked = true;
        document.body.classList.add('dark-mode');
    }
    
    // Language toggle
    const languageToggle = document.getElementById('language-toggle');
    languageToggle.addEventListener('change', function() {
        document.body.classList.toggle('arabic-language', this.checked);
        localStorage.setItem('arabicLanguage', this.checked);
        updateExplanationLanguage(algorithmSelect.value);
    });
    
    if (localStorage.getItem('arabicLanguage') === 'true') {
        languageToggle.checked = true;
        document.body.classList.add('arabic-language');
    }

    updateAlgorithmInfo();
    generateArray();
    
    algorithmSelect.addEventListener('change', function() {
        updateAlgorithmInfo();
        updateCategoryExplanation();
    });
    arrayTypeSelect.addEventListener('change', toggleCustomArrayInput);
    generateBtn.addEventListener('click', generateArray);
    startBtn.addEventListener('click', startSorting);
    pauseBtn.addEventListener('click', togglePause);
    resetBtn.addEventListener('click', resetVisualization);
    speedControl.addEventListener('input', updateSpeed);
    
    updateSpeed();
    
    // setup category cards UI (if present)
    setupCategoryCards();
    
    console.log("Sorting Algorithms Visualizer initialized successfully!");
}

// Start the application
document.addEventListener('DOMContentLoaded', init);