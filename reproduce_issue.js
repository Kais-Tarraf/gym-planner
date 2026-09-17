
async function test() {
    const payload = {
        userId: "550e8400-e29b-41d4-a716-446655440000",
        goal: "bulk",
        experience: "intermediate",
        daysPerWeek: "4",
        sessionLength: "60",
        equipment: "full_gym",
        injuries: "",
        preferredSplit: "upper_lower"
    };

    try {
        const response = await fetch("http://localhost:3001/api/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Data:", data);
    } catch (error) {
        console.error("Error:", error);
    }
}

test();
