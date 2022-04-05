

export function minDistance(A, B, E) {

    // vector AB
    let AB = [];
    AB.push(B[0] - A[0]);
    AB.push(B[1] - A[1]);

    // vector BP
    let BE = [];
    BE.push(E[0] - B[0]);
    BE.push(E[1] - B[1]);

    // vector AP
    let AE = [];
    AE.push(E[0] - A[0]);
    AE.push(E[1] - A[1]);

    // Variables to store dot product
    let AB_BE, AB_AE;

    // Calculating the dot product
    AB_BE = (AB[0] * BE[0] + AB[1] * BE[1]);
    AB_AE = (AB[0] * AE[0] + AB[1] * AE[1]);

    // Minimum distance from
    // point E to the line segment
    let reqAns = 0;

    // Case 1
    if (AB_BE > 0) {

        // Finding the magnitude
        const y = E[1] - B[1];
        const x = E[0] - B[0];
        reqAns = Math.sqrt(x * x + y * y);
    }

    // Case 2
    else if (AB_AE < 0) {
        const y = E[1] - A[1];
        const x = E[0] - A[0];
        reqAns = Math.sqrt(x * x + y * y);
    }

    // Case 3
    else {

        // Finding the perpendicular distance
        const x1 = AB[0];
        const y1 = AB[1];
        const x2 = AE[0];
        const y2 = AE[1];
        const mod = Math.sqrt(x1 * x1 + y1 * y1);
        reqAns = Math.abs(x1 * y2 - y1 * x2) / mod;
    }
    return reqAns;
}