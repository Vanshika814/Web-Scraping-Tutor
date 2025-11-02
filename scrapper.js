// apiClient.js
const axios = require('axios');
const pRetry = require('p-retry').default;
const { JIRA_BASE_URL, MAX_RESULTS_PER_PAGE } = require('./config');

async function fetchIssuesPage(projectKey, startAt) {
    const url = `${JIRA_BASE_URL}search`;
    
    // The JQL query is crucial for fetching issues
    const jql = `project = ${projectKey} ORDER BY created ASC`; 

    const request = async () => {
        try {
            const response = await axios.get(url, {
                params: {
                    jql: jql,
                    startAt: startAt,
                    maxResults: MAX_RESULTS_PER_PAGE,
                    fields: 'summary,status,description,comment,created,updated,labels,issuetype'
                },
                timeout: 30000 // 30 seconds timeout
            });

            // If the status is 429 (Rate Limit) or 5xx (Server Error), throw to trigger p-retry
            if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
                // p-retry will handle the exponential backoff and wait time
                throw new Error(`HTTP Error ${response.status} received. Retrying...`);
            }

            return response.data; // Return the JSON payload on success

        } catch (error) {
            // Check if this is an error we should retry (e.g., connection issue)
            if (axios.isAxiosError(error) && error.code !== 'ECONNABORTED' && error.response) {
                // If it's a specific HTTP error, let p-retry handle it
                throw new Error(`Request failed: ${error.message}`);
            }
            // For other connection issues, re-throw to trigger p-retry
            throw error; 
        }
    };

    // Use p-retry for robust execution
    // It automatically implements exponential backoff for you!
    return pRetry(request, { 
        retries: 5, 
        onFailedAttempt: error => {
            console.log(`Attempt ${error.attemptNumber} failed. Retrying...`);
        }
    });
}

module.exports = { fetchIssuesPage };