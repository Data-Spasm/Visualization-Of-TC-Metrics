export const calculateClassEngagement = (readingAttempts) => {
    const passageData = {};

    readingAttempts.forEach((attempt) => {
        const passageTitle = attempt.title;
        const isCompleted = attempt.quit === false;

        if (!passageData[passageTitle]) {
            passageData[passageTitle] = { started: 0, completed: 0, quit: 0 };
        }

        passageData[passageTitle].started += 1;

        if (isCompleted) {
            passageData[passageTitle].completed += 1;
        } else {
            passageData[passageTitle].quit += 1;
        }
    });

    const engagementData = Object.keys(passageData).map((passageTitle) => {
        const { started, completed, quit } = passageData[passageTitle];
        const completionRate = (completed / started) * 100;
        const quitRate = (quit / started) * 100;

        return {
            passageTitle,
            started,
            completed,
            quit,
            completionRate,
            quitRate,
            count: started,
            bubbleSize: Math.sqrt(started) * 10 // Bubble size based on the number of attempts
        };
    });

    return engagementData;
};
