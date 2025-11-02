// config.js
const JIRA_BASE_URL = "https://issues.apache.org/jira/rest/api/latest/";
const PROJECT_KEYS = ["CASSANDRA", "SPARK", "KAFKA"]; 
const MAX_RESULTS_PER_PAGE = 50;
const CHECKPOINT_FILE = "checkpoint.json";
const OUTPUT_FILE = "apache_issues_corpus.jsonl";

module.exports = {
    JIRA_BASE_URL,
    PROJECT_KEYS,
    MAX_RESULTS_PER_PAGE,
    CHECKPOINT_FILE,
    OUTPUT_FILE
};