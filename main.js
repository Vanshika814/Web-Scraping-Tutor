// main.js
const fs = require('fs');
const fsExtra = require('fs-extra');
const { PROJECT_KEYS, CHECKPOINT_FILE, OUTPUT_FILE } = require('./config');
const { fetchIssuesPage } = require('./scrapper');
const { transformIssue, writeToJsonl } = require('./transformer');

// --- Checkpoint Logic ---

async function loadCheckpoint() {
    try {
        const data = await fsExtra.readJson(CHECKPOINT_FILE);
        console.log(`Checkpoint loaded: ${JSON.stringify(data)}`);
        return data;
    } catch (e) {
        // Return default startAt (0) for all projects if file doesn't exist
        const initial = PROJECT_KEYS.reduce((acc, key) => ({ ...acc, [key]: 0 }), {});
        console.log("No checkpoint found. Starting from scratch.");
        return initial;
    }
}

async function saveCheckpoint(checkpointData) {
    await fsExtra.writeJson(CHECKPOINT_FILE, checkpointData);
}

// --- Main Scraper Logic ---

async function runScraper() {
    let checkpoint = await loadCheckpoint();
    const outputStream = fs.createWriteStream(OUTPUT_FILE, { flags: 'a' }); // 'a' appends to file

    for (const projectKey of PROJECT_KEYS) {
        let startAt = checkpoint[projectKey];
        let totalIssues = Infinity; // Start high to enter the loop

        while (startAt < totalIssues) {
            try {
                const data = await fetchIssuesPage(projectKey, startAt);
                totalIssues = data.total;
                const issues = data.issues;
                
                console.log(`Processing ${issues.length} issues in ${projectKey}. Total progress: ${startAt}/${totalIssues}`);

                for (const issue of issues) {
                    const transformed = transformIssue(issue);
                    writeToJsonl(outputStream, transformed);
                }
                
                // Update startAt for the next page
                startAt += issues.length;
                
                // Update and save checkpoint after successful page processing
                checkpoint[projectKey] = startAt;
                await saveCheckpoint(checkpoint);

            } catch (error) {
                console.error(`Fatal error processing ${projectKey} at index ${startAt}:`, error.message);
                // Exit the loop for this project, the checkpoint is already saved to retry this page later
                break;
            }
        }
        console.log(`Finished scraping project ${projectKey}.`);
    }
    
    outputStream.end();
    console.log("Scraping pipeline complete!");
}

runScraper().catch(console.error);