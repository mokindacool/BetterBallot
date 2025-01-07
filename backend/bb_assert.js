// bb_assert.js
//
// BetterBallot Unit Tester / Assertion Library
//
// LAST MODIFIED
// 2024-12-22

function fail(expr, target, compare) {
    
}

function loadTests() {
    
}

function runTest(expr, target, compare) {
    switch (compare) {
        case "==":  return expr == target;
        case "!=":  return expr != target;
        case "<" :  return expr <  target;
        case ">" :  return expr >  target;
        case "<=":  return expr <= target;
        case ">=":  return expr >= target;

        default:    return false;
    }
}

function testMain(expr, target, compare) {
    
}


