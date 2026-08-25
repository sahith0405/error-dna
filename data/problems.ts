export type Difficulty = "Easy" | "Medium" | "Hard";

export type Example = {
input: string;
output: string;
explanation?: string;
};

export type TestCase = {
id: string;
input: string;
expectedOutput: string;
isHidden?: boolean;
};

export type ErrorPattern = {
category: string;
description: string;
};

export type Problem = {
id: string;
title: string;
description: string;
difficulty: Difficulty;
topics: string[];
acceptance: string;
starterCode: string;
examples: Example[];
testCases: TestCase[];
expectedComplexity: string;
commonErrorPatterns: ErrorPattern[];
};

export const problems: Problem[] = [
{
id: "two-sum",
title: "Two Sum",
description:
"Find two numbers in an array that add up to a given target.",
difficulty: "Easy",
topics: ["Arrays", "Hashing"],
acceptance: "49.2%",

starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your solution here

    return {};
}

int main() {
    int n;
    cin >> n;

    vector<int> nums(n);

    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }

    int target;
    cin >> target;

    vector<int> result = twoSum(nums, target);

    for (int x : result) {
        cout << x << " ";
    }

    return 0;
}`,

examples: [
  {
    input: "nums = [2,7,11,15], target = 9",
    output: "[0,1]",
    explanation: "2 + 7 = 9.",
  },
  {
    input: "nums = [3,2,4], target = 6",
    output: "[1,2]",
    explanation: "2 + 4 = 6.",
  },
],

testCases: [
  {
    id: "two-sum-1",
    input: "4\n2 7 11 15\n9",
    expectedOutput: "0 1",
  },
  {
    id: "two-sum-2",
    input: "3\n3 2 4\n6",
    expectedOutput: "1 2",
  },
  {
    id: "two-sum-3",
    input: "2\n3 3\n6",
    expectedOutput: "0 1",
  },
  {
    id: "two-sum-4",
    input: "4\n1 5 8 12\n20",
    expectedOutput: "2 3",
  },
  {
    id: "two-sum-5",
    input: "4\n-3 4 3 90\n0",
    expectedOutput: "0 2",
  },
],

expectedComplexity: "O(n) time and O(n) space using a hash map.",

commonErrorPatterns: [
  {
    category: "Logic Error",
    description: "Incorrectly identifying the pair of values.",
  },
  {
    category: "Duplicate Handling",
    description: "Failing when the same value appears more than once.",
  },
  {
    category: "Index Error",
    description: "Returning values instead of their indices.",
  },
],

},

{
id: "valid-parentheses",
title: "Valid Parentheses",
description:
"Determine whether a string of brackets is correctly balanced.",
difficulty: "Easy",
topics: ["Stack", "Strings"],
acceptance: "42.8%",

starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <algorithm>
#include <numeric>
#include <string>
#include <cmath>
#include <limits>
#include <utility>

using namespace std;

bool isValid(string s) {
// Write your solution here

return false;

}

int main() {
string s = "()[]{}";

cout << (isValid(s) ? "true" : "false");

return 0;

}`,

examples: [
  {
    input: 's = "()"',
    output: "true",
  },
  {
    input: 's = "([)]"',
    output: "false",
  },
],

testCases: [
  {
    id: "parentheses-1",
    input: "()",
    expectedOutput: "true",
  },
  {
    id: "parentheses-2",
    input: "()[]{}",
    expectedOutput: "true",
  },
  {
    id: "parentheses-3",
    input: "(]",
    expectedOutput: "false",
  },
  {
    id: "parentheses-4",
    input: "([)]",
    expectedOutput: "false",
  },
  {
    id: "parentheses-5",
    input: "{[]}",
    expectedOutput: "true",
  },
],

expectedComplexity: "O(n) time and O(n) space using a stack.",

commonErrorPatterns: [
  {
    category: "Stack Logic Error",
    description:
      "Removing or comparing brackets in the wrong order.",
  },
  {
    category: "Edge Case Error",
    description:
      "Incorrectly handling an empty string.",
  },
  {
    category: "Matching Error",
    description:
      "Failing to match corresponding bracket types.",
  },
],

},

{
id: "binary-search",
title: "Binary Search",
description:
"Find the target value in a sorted array using binary search.",
difficulty: "Easy",
topics: ["Binary Search", "Arrays"],
acceptance: "58.1%",

starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <algorithm>
#include <numeric>
#include <string>
#include <cmath>
#include <limits>
#include <utility>

using namespace std;

int search(vector<int>& nums, int target) {
// Write your solution here

return -1;

}

int main() {
vector<int> nums = {-1, 0, 3, 5, 9, 12};
int target = 9;

cout << search(nums, target);

return 0;

}`,

examples: [
  {
    input: "nums = [-1,0,3,5,9,12], target = 9",
    output: "4",
  },
  {
    input: "nums = [-1,0,3,5,9,12], target = 2",
    output: "-1",
  },
],

testCases: [
  {
    id: "binary-search-1",
    input: "-1 0 3 5 9 12 | 9",
    expectedOutput: "4",
  },
  {
    id: "binary-search-2",
    input: "-1 0 3 5 9 12 | 2",
    expectedOutput: "-1",
  },
  {
    id: "binary-search-3",
    input: "5 | 5",
    expectedOutput: "0",
  },
  {
    id: "binary-search-4",
    input: "1 3 5 7 9 | 1",
    expectedOutput: "0",
  },
  {
    id: "binary-search-5",
    input: "1 3 5 7 9 | 9",
    expectedOutput: "4",
  },
],

expectedComplexity: "O(log n) time and O(1) space.",

commonErrorPatterns: [
  {
    category: "Boundary Error",
    description:
      "Incorrectly handling left and right boundaries of the search range.",
  },
  {
    category: "Off-by-One Error",
    description:
      "Using incorrect updates such as left = mid or right = mid.",
  },
  {
    category: "Infinite Loop",
    description:
      "Failing to shrink the search range after calculating mid.",
  },
],

},

{
id: "best-time-stock",
title: "Best Time to Buy and Sell Stock",
description:
"Find the maximum profit possible from buying and selling a stock.",
difficulty: "Easy",
topics: ["Arrays", "Greedy"],
acceptance: "55.4%",

starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <algorithm>
#include <numeric>
#include <string>
#include <cmath>
#include <limits>
#include <utility>

using namespace std;

int maxProfit(vector<int>& prices) {
// Write your solution here

return 0;

}

int main() {
vector<int> prices = {7, 1, 5, 3, 6, 4};

cout << maxProfit(prices);

return 0;

}`,

examples: [
  {
    input: "prices = [7,1,5,3,6,4]",
    output: "5",
  },
  {
    input: "prices = [7,6,4,3,1]",
    output: "0",
  },
],

testCases: [
  {
    id: "stock-1",
    input: "7 1 5 3 6 4",
    expectedOutput: "5",
  },
  {
    id: "stock-2",
    input: "7 6 4 3 1",
    expectedOutput: "0",
  },
  {
    id: "stock-3",
    input: "1 2",
    expectedOutput: "1",
  },
  {
    id: "stock-4",
    input: "2 4 1",
    expectedOutput: "2",
  },
  {
    id: "stock-5",
    input: "3 3 3 3",
    expectedOutput: "0",
  },
],

expectedComplexity: "O(n) time and O(1) space.",

commonErrorPatterns: [
  {
    category: "State Update Error",
    description:
      "Updating the minimum price or maximum profit incorrectly.",
  },
  {
    category: "Logic Error",
    description:
      "Allowing a selling day to occur before the buying day.",
  },
  {
    category: "Initialization Error",
    description:
      "Starting minimum price or profit with an inappropriate value.",
  },
],

},

{
id: "valid-anagram",
title: "Valid Anagram",
description:
"Determine whether two strings contain the same characters with the same frequencies.",
difficulty: "Easy",
topics: ["Hashing", "Strings"],
acceptance: "64.7%",

starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <algorithm>
#include <numeric>
#include <string>
#include <cmath>
#include <limits>
#include <utility>

using namespace std;

bool isAnagram(string s, string t) {
// Write your solution here

return false;

}

int main() {
string s = "anagram";
string t = "nagaram";

cout << (isAnagram(s, t) ? "true" : "false");

return 0;

}`,

examples: [
  {
    input: 's = "anagram", t = "nagaram"',
    output: "true",
  },
  {
    input: 's = "rat", t = "car"',
    output: "false",
  },
],

testCases: [
  {
    id: "anagram-1",
    input: "anagram | nagaram",
    expectedOutput: "true",
  },
  {
    id: "anagram-2",
    input: "rat | car",
    expectedOutput: "false",
  },
  {
    id: "anagram-3",
    input: "listen | silent",
    expectedOutput: "true",
  },
  {
    id: "anagram-4",
    input: "hello | world",
    expectedOutput: "false",
  },
  {
    id: "anagram-5",
    input: "aacc | ccac",
    expectedOutput: "false",
  },
],

expectedComplexity:
  "O(n) time and O(1) auxiliary space for lowercase English letters.",

commonErrorPatterns: [
  {
    category: "Frequency Error",
    description:
      "Incorrectly counting or comparing character frequencies.",
  },
  {
    category: "Length Edge Case",
    description:
      "Failing to reject strings with different lengths.",
  },
  {
    category: "State Update Error",
    description:
      "Updating character counts incorrectly.",
  },
],

},

{
id: "longest-substring",
title: "Longest Substring Without Repeating Characters",
description:
"Find the length of the longest substring containing no repeated characters.",
difficulty: "Medium",
topics: ["Sliding Window", "Hashing"],
acceptance: "36.8%",

starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <algorithm>
#include <numeric>
#include <string>
#include <cmath>
#include <limits>
#include <utility>

using namespace std;

int lengthOfLongestSubstring(string s) {
// Write your solution here

return 0;

}

int main() {
string s = "abcabcbb";

cout << lengthOfLongestSubstring(s);

return 0;

}`,

examples: [
  {
    input: 's = "abcabcbb"',
    output: "3",
  },
  {
    input: 's = "bbbbb"',
    output: "1",
  },
],

testCases: [
  {
    id: "substring-1",
    input: "abcabcbb",
    expectedOutput: "3",
  },
  {
    id: "substring-2",
    input: "bbbbb",
    expectedOutput: "1",
  },
  {
    id: "substring-3",
    input: "pwwkew",
    expectedOutput: "3",
  },
  {
    id: "substring-4",
    input: "",
    expectedOutput: "0",
  },
  {
    id: "substring-5",
    input: "abcdef",
    expectedOutput: "6",
  },
],

expectedComplexity:
  "O(n) time and O(k) space using a sliding window.",

commonErrorPatterns: [
  {
    category: "Sliding Window Error",
    description:
      "Incorrectly moving the left boundary when a duplicate appears.",
  },
  {
    category: "State Update Error",
    description:
      "Failing to update the last seen position correctly.",
  },
  {
    category: "Boundary Error",
    description:
      "Incorrectly calculating the current window length.",
  },
],

},

{
id: "rotated-search",
title: "Search in Rotated Sorted Array",
description:
"Search for a target inside a rotated sorted array in logarithmic time.",
difficulty: "Medium",
topics: ["Binary Search", "Arrays"],
acceptance: "41.3%",

starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <algorithm>
#include <numeric>
#include <string>
#include <cmath>
#include <limits>
#include <utility>

using namespace std;

int search(vector<int>& nums, int target) {
// Write your solution here

return -1;

}

int main() {
vector<int> nums = {4, 5, 6, 7, 0, 1, 2};
int target = 0;

cout << search(nums, target);

return 0;

}`,

examples: [
  {
    input: "nums = [4,5,6,7,0,1,2], target = 0",
    output: "4",
  },
  {
    input: "nums = [4,5,6,7,0,1,2], target = 3",
    output: "-1",
  },
],

testCases: [
  {
    id: "rotated-1",
    input: "4 5 6 7 0 1 2 | 0",
    expectedOutput: "4",
  },
  {
    id: "rotated-2",
    input: "4 5 6 7 0 1 2 | 3",
    expectedOutput: "-1",
  },
  {
    id: "rotated-3",
    input: "1 | 1",
    expectedOutput: "0",
  },
  {
    id: "rotated-4",
    input: "3 1 | 1",
    expectedOutput: "1",
  },
  {
    id: "rotated-5",
    input: "5 6 7 8 1 2 3 4 | 8",
    expectedOutput: "3",
  },
],

expectedComplexity: "O(log n) time and O(1) space.",

commonErrorPatterns: [
  {
    category: "Boundary Error",
    description:
      "Incorrectly updating left or right boundaries.",
  },
  {
    category: "Logic Error",
    description:
      "Incorrectly determining which half of the rotated array is sorted.",
  },
  {
    category: "Off-by-One Error",
    description:
      "Excluding a valid candidate while shrinking the search range.",
  },
],

},

{
id: "subarray-sum",
title: "Subarray Sum Equals K",
description:
"Count the number of continuous subarrays whose sum equals a given value.",
difficulty: "Medium",
topics: ["Prefix Sum", "Hashing"],
acceptance: "44.1%",

starterCode: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <unordered_set>
#include <map>
#include <set>
#include <queue>
#include <stack>
#include <algorithm>
#include <numeric>
#include <string>
#include <cmath>
#include <limits>
#include <utility>

using namespace std;

int subarraySum(vector<int>& nums, int k) {
// Write your solution here

return 0;

}

int main() {
vector<int> nums = {1, 1, 1};
int k = 2;

cout << subarraySum(nums, k);

return 0;

}`,

examples: [
  {
    input: "nums = [1,1,1], k = 2",
    output: "2",
  },
  {
    input: "nums = [1,2,3], k = 3",
    output: "2",
  },
],

testCases: [
  {
    id: "subarray-1",
    input: "1 1 1 | 2",
    expectedOutput: "2",
  },
  {
    id: "subarray-2",
    input: "1 2 3 | 3",
    expectedOutput: "2",
  },
  {
    id: "subarray-3",
    input: "1 -1 0 | 0",
    expectedOutput: "3",
  },
  {
    id: "subarray-4",
    input: "1 | 1",
    expectedOutput: "1",
  },
  {
    id: "subarray-5",
    input: "1 2 1 2 1 | 3",
    expectedOutput: "4",
  },
],

expectedComplexity:
  "O(n) time and O(n) space using prefix sums and a hash map.",

commonErrorPatterns: [
  {
    category: "Prefix Sum Error",
    description:
      "Incorrectly calculating or using prefix sums.",
  },
  {
    category: "Initialization Error",
    description:
      "Failing to initialize the zero-prefix count correctly.",
  },
  {
    category: "Frequency Error",
    description:
      "Storing incorrect frequencies of previous prefix sums.",
  },
],

},
];
