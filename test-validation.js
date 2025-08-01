// Direct unit test for validation functions
const { validateEditProfileData } = require("./src/utils/validation");

console.log("🧪 Unit Testing Validation Functions...\n");

// Test cases
const testCases = [
  {
    name: "Valid profile data",
    input: {
      body: {
        firstName: "John",
        lastName: "Doe",
        age: 25,
        gender: "male",
        about: "Software developer",
      },
    },
    shouldPass: true,
  },
  {
    name: "Invalid field",
    input: {
      body: {
        firstName: "John",
        invalidField: "should not be allowed",
      },
    },
    shouldPass: false,
  },
  {
    name: "Invalid email",
    input: {
      body: {
        emailId: "invalid-email",
      },
    },
    shouldPass: false,
  },
  {
    name: "Invalid age (too young)",
    input: {
      body: {
        age: 15,
      },
    },
    shouldPass: false,
  },
  {
    name: "Invalid age (too old)",
    input: {
      body: {
        age: 150,
      },
    },
    shouldPass: false,
  },
  {
    name: "Invalid gender",
    input: {
      body: {
        gender: "invalid",
      },
    },
    shouldPass: false,
  },
  {
    name: "Invalid photo URL",
    input: {
      body: {
        photoUrl: "not-a-url",
      },
    },
    shouldPass: false,
  },
  {
    name: "Valid email",
    input: {
      body: {
        emailId: "test@example.com",
      },
    },
    shouldPass: true,
  },
  {
    name: "Valid photo URL",
    input: {
      body: {
        photoUrl: "https://example.com/photo.jpg",
      },
    },
    shouldPass: true,
  },
];

// Run tests
let passed = 0;
let failed = 0;

testCases.forEach((testCase, index) => {
  console.log(`📝 Test ${index + 1}: ${testCase.name}`);
  console.log(`Input: ${JSON.stringify(testCase.input.body)}`);

  try {
    const result = validateEditProfileData(testCase.input);

    if (testCase.shouldPass && result) {
      console.log("✅ PASSED");
      passed++;
    } else if (!testCase.shouldPass && result) {
      console.log("❌ FAILED: Should have thrown an error");
      failed++;
    } else {
      console.log("❌ FAILED: Unexpected result");
      failed++;
    }
  } catch (error) {
    if (!testCase.shouldPass) {
      console.log(`✅ PASSED: Correctly caught error - ${error.message}`);
      passed++;
    } else {
      console.log(`❌ FAILED: Unexpected error - ${error.message}`);
      failed++;
    }
  }
  console.log("");
});

console.log(`📊 Test Results:`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(
  `📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`
);

if (failed === 0) {
  console.log("\n🎉 All validation tests passed!");
} else {
  console.log(
    `\n⚠️  ${failed} test(s) failed. Please review the validation logic.`
  );
}
