// Helper to generate boilerplate topics with some realistic titles
const generateCOs = (
  subjectCode: string,
  coTitles: string[],
  topicMatrix: string[][]
): any[] => {
  return coTitles.map((coTitle, i) => ({
    id: `${subjectCode}_co${i + 1}`,
    title: `CO${i + 1}: ${coTitle}`,
    topics: topicMatrix[i].map((topicTitle, j) => {
      // Provide a highly detailed custom content for the very first topic of OS as a demo
      const isDemoTopic = subjectCode === '22CH362' && i === 0 && j === 0;
      
      const content = isDemoTopic 
        ? `Monolithic kernels and microkernels represent two fundamentally different architectural approaches to operating system design.\n\nIn a **Monolithic Kernel**, the entire operating system works in kernel space. This includes the scheduler, file system, memory management, and device drivers. Because all components share the same memory space, inter-process communication is extremely fast. However, a single bug in a device driver can crash the entire system.\n\nA **Microkernel**, on the other hand, strips the kernel down to its bare minimum—typically just IPC (Inter-Process Communication), basic scheduling, and basic memory management. All other services (like file systems and drivers) run in user space as separate servers. This provides excellent stability and modularity, as a crashing driver won't bring down the kernel. The tradeoff is performance overhead due to constant context switching and message passing between user space and kernel space.\n\n### Dual-Mode Execution\nTo ensure system protection, modern processors provide at least two modes of operation: User Mode and Kernel Mode. A mode bit in the hardware indicates the current mode. When a user application requests a service from the operating system (via a system call), the system transitions from user mode to kernel mode to execute the privileged instruction, returning to user mode upon completion.`
        : `This comprehensive module covers the foundational principles and advanced mechanics of **${topicTitle}**. \n\nStudents will explore the theoretical frameworks, algorithmic structures, and practical implementation details required to master this domain. The curriculum is strictly aligned with the core course outcomes, ensuring a rigorous mathematical and logical approach to problem-solving.\n\n### Key Learning Objectives\n- Understand the core architectural patterns associated with this topic.\n- Analyze the computational complexity and resource management tradeoffs.\n- Apply theoretical models to real-world engineering challenges.\n\nPlease refer to the linked presentation slides and PDF study modules below for the complete mathematical proofs and code reference architectures.`;

      return {
        id: `${subjectCode}_co${i + 1}_t${j + 1}`,
        title: topicTitle,
        content: content,
        resources: {
          ppt: '#',
          pdf: '#',
        },
      };
    }),
  }));
};

export const INITIAL_DATA: any[] = [
  {
    id: 'sub_os',
    code: '22CH362',
    title: 'Operating Systems',
    description: 'Process management, memory management, file systems, and concurrency control in modern operating systems.',
    cos: generateCOs(
      '22CH362',
      [
        'OS Structures & System Calls',
        'Process & CPU Scheduling',
        'Process Synchronization & Deadlocks',
        'Memory Management',
        'Storage & File Systems',
        'Protection & Security',
      ],
      [
        ["Monolithic vs Microkernels, Dual-mode execution", "System Calls & Interrupts"],
        ["Process Control Block (PCB)", "Preemptive CPU Scheduling (Round Robin, FCFS)"],
        ["Critical Section Problem & Mutex Locks", "Banker's Algorithm for Deadlock Avoidance"],
        ["Paging, Segmentation, and TLB", "Virtual Memory & Page Replacement Algorithms"],
        ["File Allocation Methods (Contiguous, Linked, Indexed)", "Disk Scheduling Algorithms (SCAN, C-SCAN)"],
        ["Access Matrix & Cryptography basics", "Intrusion Detection & Malware concepts"],
      ]
    ),
  },
  {
    id: 'sub_dsa',
    code: '22CH342',
    title: 'Data Structures and Algorithm',
    description: 'In-depth study of arrays, linked lists, stacks, queues, trees, and graphs, focusing on algorithmic efficiency.',
    cos: generateCOs(
      '22CH342',
      [
        'Algorithmic Complexity & Arrays',
        'Linear Data Structures',
        'Hierarchical Data Structures',
        'Graph Algorithms',
        'Sorting & Searching',
        'Advanced Algorithmic Design',
      ],
      [
        ['Asymptotic Notations (Big-O, Omega, Theta)', 'Memory Allocation & Array Operations'],
        ['Stack/Queue Operations', 'Infix to Postfix Conversion', 'Singly & Doubly Linked Lists'],
        ['Binary Search Trees (BST)', 'AVL Trees & Rotations', 'Heap Data Structure'],
        ["Graph Traversals (BFS & DFS)", "Dijkstra's Shortest Path", "Minimum Spanning Trees (Prim & Kruskal)"],
        ['Quick Sort vs Merge Sort', 'Binary Search implementations', 'Hashing & Collision Resolution'],
        ['Dynamic Programming basics', 'Greedy Algorithms vs Divide and Conquer'],
      ]
    ),
  },
  {
    id: 'sub_oop',
    code: '22CH331',
    title: 'Object Oriented Programming',
    description: 'Principles of OOP including encapsulation, inheritance, and polymorphism using modern design patterns.',
    cos: generateCOs(
      '22CH331',
      [
        'Foundations of Java & JVM',
        'Classes and Encapsulation',
        'Inheritance & Polymorphism',
        'Interfaces & Abstract Classes',
        'Exception Handling & I/O',
        'Multithreading & Collections',
      ],
      [
        ['JVM Architecture, Bytecode, Primitive Data Types', 'Control Flow Statements'],
        ['Classes, Constructors, Garbage Collection', 'Access Modifiers & Scope'],
        ['Method Overloading vs Overriding', 'Super keyword & Constructor Chaining'],
        ['Defining Interfaces', 'Abstract Classes vs Interfaces', 'Multiple Inheritance via Interfaces'],
        ['Try-Catch-Finally blocks', 'Custom Exceptions', 'File Input/Output Streams'],
        ['Thread Lifecycle & Runnable Interface', 'Java Collections Framework (List, Set, Map)'],
      ]
    ),
  },
  {
    id: 'sub_prob',
    code: '22CH311',
    title: 'Probability and Statistics',
    description: 'Foundations of probability theory, statistical inference, and their applications in data analysis.',
    cos: generateCOs(
      '22CH311',
      [
        'Basic Probability Theory',
        'Discrete Random Variables',
        'Continuous Random Variables',
        'Joint Distributions',
        'Statistical Inference',
        'Hypothesis Testing',
      ],
      [
        ['Permutations & Combinations', 'Conditional Probability & Bayes Theorem'],
        ['Random Variables & PMF', 'Binomial & Poisson Distributions'],
        ['Probability Density Functions (PDF)', 'Normal & Exponential Distributions'],
        ['Marginal & Conditional Distributions', 'Covariance & Correlation'],
        ['Point Estimation & Maximum Likelihood', 'Confidence Intervals'],
        ['Null vs Alternative Hypothesis', 'T-Tests & Chi-Square Tests'],
      ]
    ),
  },
  {
    id: 'sub_tdpl',
    code: '22CH321',
    title: 'Theory and Design of Programming Languages',
    description: 'Study of programming language paradigms, syntax, semantics, and implementation techniques.',
    cos: generateCOs(
      '22CH321',
      [
        'Syntax and Semantics',
        'Lexical & Syntax Analysis',
        'Names, Bindings, & Scopes',
        'Data Types & Expressions',
        'Subprograms & Control Flow',
        'Language Paradigms',
      ],
      [
        ['Formal Methods of Describing Syntax', 'BNF & EBNF Grammars'],
        ['Lexical Analysis phases', 'Recursive-Descent Parsing', 'Syntax Trees'],
        ['Static vs Dynamic Scoping', 'Lifetime of Variables & Referencing Environments'],
        ['Strong vs Weak Typing', 'Pointer & Reference Types', 'Operator Precedence'],
        ['Parameter Passing Methods', 'Coroutines & Exception Handling'],
        ['Imperative vs Declarative paradigms', 'Functional Programming concepts', 'Logic Programming (Prolog)'],
      ]
    ),
  },
];
